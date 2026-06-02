---
title: The content pipeline
description: How a Markdown file becomes a rendered page.
icon: file-code
---

# The content pipeline

This is the heart of the engine. A Markdown file is never compiled into a Svelte component. It is parsed into a plain data structure once, then rendered at request time by a fixed component kit. Everything in `src/lib/markdown/` and `src/lib/server/content-store.ts` exists to make that happen, and to make it safe.

This page goes deep into how the pipeline actually works and why each piece is shaped the way it is. If you only want the shape of the data, read [The document model](#the-document-model). If you want to understand the parser, read [Inside the parser](#inside-the-parser).

## The full journey

A request for a page slug turns into a tree of plain objects, then into HTML. Here is the path it takes.

<Steps>
	<Step title="content-store.render(slug)">

`render(slug)` in `src/lib/server/content-store.ts` maps the slug to a file key, reads the file off disk with `readFileSync`, and hands the text to `parseMarkdown`. It reads at request time on purpose, so the same prebuilt server can serve any project's content without rebuilding. The base path from `$app/paths` is passed in so internal links can be rewritten.

    </Step>
    <Step title="parseMarkdown(text, base)">

`parseMarkdown` in `src/lib/markdown/parse.ts` runs the unified pipeline, pulls the frontmatter off the front, highlights every code fence, walks the tree into `DocNode`s, and runs a transform pass for headings, the table of contents, and links. It returns a `CompiledDoc`.

    </Step>
    <Step title="DocNode tree">

The result is a tree of plain JSON objects. No functions, no component references, no class instances. Just `element`, `component`, `text`, and `raw` shapes. This is the whole reason the pipeline exists in this form.

    </Step>
    <Step title="Page data">

`+page.server.ts` returns the `CompiledDoc` as load data. Because the tree is plain JSON it serializes cleanly and travels to the browser as part of the page payload. That payload is what lets interactive components hydrate on the client.

    </Step>
    <Step title="Markdown.svelte">

The renderer walks the tree and emits each node. An `element` becomes its HTML tag, a `raw` node is inserted as HTML, and a `component` is looked up by name in the registry and rendered with its parsed props and a children snippet. The renderer never parses or highlights anything. It only reads data.

    </Step>

</Steps>

### Caching and why content is read at request time

`render` keeps a `Map` of compiled results keyed by slug. Once a slug is rendered, the `CompiledDoc` is cached and returned directly on the next request. Misses are cached too, so an unknown slug is only resolved against the file tree once.

The cache is bypassed entirely when `AXERITY_DEV` is set to `1`. In dev, every request reparses the file so an edit shows up on the next reload without a restart. The same flag controls the content tree cache, so `invalidate()` can drop both the tree and the render cache together when files change.

<Callout type="info">

Reading at request time is the point of the prebuilt model. The server in `dist/` is compiled once in CI. A project's Markdown lives on the user's filesystem and is read fresh, so the same binary serves any content without a bundler ever running on the user's machine.

</Callout>

## The document model

A compiled page is a `CompiledDoc`, defined in `src/lib/markdown/types.ts`:

```ts
interface CompiledDoc {
	frontmatter: PageFrontmatter;
	toc: TocEntry[];
	doc: DocNode[];
	raw: string;
}
```

`frontmatter` is the parsed YAML block. `toc` is the table of contents collected from `h2` and `h3` headings. `doc` is the document tree. `raw` is the original Markdown with the frontmatter and any `<script>` blocks stripped, kept so a page can offer a copy-as-Markdown action without reconstructing the source.

A `DocNode` is one of a small set of shapes:

```ts
type DocNode =
	| { type: 'element'; tag: string; props: Record<string, JsonValue>; children: DocNode[] }
	| { type: 'component'; name: string; props: Record<string, JsonValue>; children: DocNode[] }
	| { type: 'code'; html: string; raw: string; lang: string; mermaid?: string }
	| { type: 'text'; value: string }
	| { type: 'raw'; html: string };
```

An `element` is a plain HTML tag with attributes. A `component` is a kit component, addressed by name and resolved through the registry at render time. A `text` node is a run of text. A `raw` node holds a string of pre-rendered HTML, which is how highlighted code blocks and inline HTML travel through the tree. A `code` node carries highlighted HTML alongside its raw source and language, which is the shape mermaid and other source-aware features can use.

Every value in `props` is a `JsonValue`. That type is the contract for the whole pipeline:

```ts
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
```

<Callout type="info">

The model is plain JSON on purpose. It has to survive being serialized into the page payload and rehydrated in the browser, and it has to render identically on the server and the client. A tree that held functions or component classes could not do either. By keeping props to `JsonValue`, the same tree is data on the server, data over the wire, and data in the browser.

</Callout>

## Inside the parser

The parser is a small unified pipeline plus a pair of mutually recursive functions that turn the parsed tree into `DocNode`s. The interesting work is in how it reuses standard Markdown machinery while breaking out cleanly at component boundaries.

### The unified pipeline

```ts
const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkSmartypants)
	.use(remarkFrontmatter, ['yaml'])
	.use(remarkMdxJsx);
```

`remarkParse` builds the mdast tree. `remarkGfm` adds tables, strikethrough, task lists, and autolinks. `remarkSmartypants` turns straight quotes and dashes into typographic ones. `remarkFrontmatter` recognizes the leading YAML block so it lands as a `yaml` node rather than a horizontal rule.

`remarkMdxJsx` is the local plugin that wires in JSX. It registers two things on the processor's data:

<CodeGroup>

```ts title="remarkMdxJsx"
function remarkMdxJsx(this) {
	const data = this.data();
	const micromarkExtensions = (data.micromarkExtensions ??= []);
	const fromMarkdownExtensions = (data.fromMarkdownExtensions ??= []);
	micromarkExtensions.push({ disable: { null: ['codeIndented'] } });
	micromarkExtensions.push(mdxJsx({ acorn, addResult: true }));
	fromMarkdownExtensions.push(mdxJsxFromMarkdown());
}
```

</CodeGroup>

`mdxJsx` from `micromark-extension-mdx-jsx` and `mdxJsxFromMarkdown` from `mdast-util-mdx-jsx` add JSX _syntax_ to the parser. That is the whole extent of what they do here. They recognize `<Component prop={...}>` tags and produce `mdxJsxFlowElement` and `mdxJsxTextElement` nodes with parsed attributes. No JavaScript is ever evaluated. `addResult: true` asks the extension to attach the parsed ESTree for each attribute expression, which the attribute grammar walks later.

<Callout type="warning">

This is syntax only. There is no MDX runtime, no module evaluation, no JavaScript execution. The engine borrows JSX's tag and attribute _grammar_ and nothing else. That is what keeps the no-bundler and no-eval guarantee intact even when content uses components.

</Callout>

### Disabling codeIndented

The plugin disables the `codeIndented` micromark construct. In plain Markdown, four spaces or a tab of indentation means a code block. But component content is routinely indented under its opening tag for readability, like the body of a `<Step>`. Without disabling `codeIndented`, that indented Markdown would be swallowed into a code block instead of parsed as content. Turning the construct off means indentation is just indentation, and fenced code blocks (with backticks or tildes) remain the only way to write code.

### mdast to DocNode, and the break to hast

The tree is walked by two functions that call each other: `mdastToDoc` and `hastToDoc`. The trick is that standard Markdown is converted by reusing `mdast-util-to-hast`, while JSX nodes are pulled out by hand.

`mdastToDoc` looks at each mdast node:

<Steps>
	<Step title="JSX nodes become components or elements">

If the node is an `mdxJsxFlowElement` or `mdxJsxTextElement`, its attributes are resolved into props and its children are walked recursively. A node with no name (a JSX fragment) collapses to just its children.

    </Step>
    <Step title="Plain Markdown is handed to mdast-util-to-hast">

For any other node, `mdastToDoc` calls `toHast` and then `hastToDoc` on the result. This reuses the standard, well-tested Markdown-to-HTML mapping for paragraphs, lists, emphasis, links, and everything else, instead of reimplementing it.

    </Step>
    <Step title="hast walks back into DocNodes">

`hastToDoc` turns hast `element` nodes into `DocNode` elements, `text` into text, and `raw` into raw HTML. If it meets an `mdxJsx` node again (a component nested inside Markdown), it calls back into `mdastToDoc`. That is the mutual recursion, and it is what lets a component sit inside a list item, and a list sit inside a component.

    </Step>

</Steps>

The break works because of one option passed to `toHast`:

```ts
const HAST_OPTS = {
	allowDangerousHtml: true,
	passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement']
};
```

`passThrough` tells `mdast-util-to-hast` to leave JSX nodes untouched in the output rather than trying to convert them. They pass straight through into the hast tree, where `hastToDoc` recognizes them and hands them back to `mdastToDoc`. Without this, the conversion would either drop the components or choke on them. `allowDangerousHtml` keeps inline HTML as `raw` nodes so it can be carried through verbatim.

### The element versus component rule

When `mdastToDoc` resolves a JSX node, the tag name decides what it becomes:

```ts
if (/^[a-z]/.test(name)) return [{ type: 'element', tag: name, props, children }];
return [{ type: 'component', name, props, children }];
```

A lowercase initial means a plain HTML element, so `<div>` or `<span>` written in Markdown stays HTML. A capitalized initial means a kit component, so `<Callout>` or `<Card>` is resolved through the registry at render time. This is the same convention JSX itself uses, and it keeps the author's intent unambiguous without any configuration.

### Unwrapping a paragraph of components

Markdown wraps loose inline content in a paragraph. So a component written on its own line, like a `<Card>`, often ends up as the only child of a `<p>`. Rendering a block component inside a paragraph produces invalid HTML.

`mdastToDoc` handles this: when a paragraph contains only JSX nodes and whitespace text, it unwraps them and drops the paragraph. The components become direct children of whatever contained the paragraph. Mixed paragraphs (text with an inline component) are left alone, so inline usage still works.

### Highlighting happens before the walk

`highlightAll` runs over the mdast tree before it is turned into `DocNode`s. It collects every `code` node, highlights each one, and then rewrites the node in place: it sets `node.type = 'html'` and replaces `node.value` with the highlighted markup. By the time `mdastToDoc` runs, those nodes are ordinary `html` nodes, so they flow through as `raw` `DocNode`s carrying finished HTML. The renderer never highlights, which means highlighting cost is paid once at parse time and then cached.

### Stripping scripts, fence-aware

Before parsing, `stripScripts` removes any `<script>` blocks from the source. This matters because content is not code: a stray script tag in a Markdown file should never run. The stripping is fence-aware. It tracks whether it is inside a fenced code block (backticks or tildes, matching the opening fence length and character) and leaves anything inside a fence alone. So a `<script>` shown as an _example_ inside a code block survives untouched, while a real `<script>` in the document body is dropped. The same removal is mirrored when building the `raw` copy of the document.

## The eval-free attribute grammar

Component attributes are where it would be easiest to let arbitrary JavaScript leak in, because `prop={...}` looks exactly like a JSX expression. The grammar in `src/lib/markdown/attr-grammar.ts` reads those expressions as _data_ and refuses anything that is _logic_.

`resolveAttributes` walks the attributes the JSX extension parsed for a tag. It handles three shapes:

<Steps>
	<Step title="Bare attributes are true">

`<Card featured>` with no value becomes `featured: true`.

    </Step>
    <Step title="String attributes pass through">

`<Card title="Hello">` becomes `title: "Hello"` directly.

    </Step>
    <Step title="Expression attributes are evaluated as data">

`<CardGroup cols={2}>` carries an ESTree (attached because the extension ran with `addResult: true`). The grammar pulls the single `ExpressionStatement` and evaluates it into plain JSON.

    </Step>

</Steps>

`evaluateExpression` is a small ESTree walker, not an interpreter. It accepts only literal data:

- `Literal` for strings, numbers, booleans, and null. A regex literal is rejected.
- `ArrayExpression` for arrays, with sparse elements and spreads rejected.
- `ObjectExpression` for object literals, with only plain `init` properties and non-computed keys allowed.
- `TemplateLiteral` only when it has no interpolations, so a backtick string with no `${...}` is allowed but an interpolated one is not.
- `UnaryExpression` only for `-`, `+`, and `!` on values it has already reduced, so `-1` and `!false` work.

Anything else throws an `AttrError`. An identifier throws, a function call throws, a member access throws, a spread attribute throws. There is no scope to resolve a name against and no way to call anything, because the walker simply has no case for those node types.

```ts
case 'Identifier': {
	const name = node.name;
	if (name === 'undefined') return null;
	throw new AttrError(`identifier "${name}" is not allowed (use a literal)`);
}
```

<Callout type="warning">

The rule is data, not logic. An attribute can say `{2}` or `{['a', 'b']}` or `{{ cols: 3 }}`, but it cannot say `{getCols()}` or `{cols}`. This keeps content safe to render anywhere, and it preserves the no-eval guarantee. Nothing the author writes in an attribute is ever executed. It is parsed into JSON and handed to a component as a prop.

</Callout>

Once evaluated, the resulting JSON values become the node's `props`, which is exactly the `JsonValue` shape the rest of the pipeline expects.

## Highlighting at parse time

`src/lib/markdown/highlight.ts` turns code fences into themed HTML using Shiki, once, at parse time. The output is stored as HTML on the node, so the renderer is never in the highlighting business.

### Dual theme and the language set

```ts
const themes = { light: 'github-light', dark: 'vesper' } as const;
```

Every block is highlighted for both `github-light` and `vesper` in a single pass, with `defaultColor: 'light'`. The dark theme rides along as CSS custom properties, so switching themes is a CSS swap with no rehighlighting.

A fixed set of common languages is prebundled into the highlighter at startup, covering the long list in `langs` (TypeScript, Svelte, JSON, YAML, Bash, Python, Go, Rust, and the rest). The highlighter is created lazily and memoized behind `getHighlighter`.

For the long tail, `ensureLanguage` loads grammars on demand. If a fence's language is not already loaded but exists in Shiki's `bundledLanguages`, it is loaded at that moment and then stays available. If it is unknown or fails to load, the block falls back to `text`. So every Shiki-supported language highlights without paying the startup cost of bundling all of them.

### The transformers

Meta on the fence (the text after the language) drives a set of Shiki transformers, added conditionally:

<CardGroup cols={2}>
	<Card title="Copy button" icon="copy">

A copy button is injected into every block, either inside a header when the fence has a `title`, or floating when it does not.

    </Card>
    <Card title="Line numbers" icon="list-ordered">

`showLineNumbers` adds a class to the `pre` so CSS can render the gutter.

    </Card>
    <Card title="Highlight lines" icon="highlighter">

A range like `{1,3-5}` marks those lines with a `highlighted` class.

    </Card>
    <Card title="Dim YAML markers" icon="minus">

In YAML, the `---` document markers are dimmed so frontmatter examples read cleanly.

    </Card>
    <Card title="Remove line breaks" icon="scissors">

The stray newline text nodes Shiki emits between lines are stripped so line layout is clean.

    </Card>
    <Card title="Twoslash" icon="badge-info">

With `twoslash` on the fence, the Twoslash transformer runs type-aware rendering. It uses an explicit trigger, so it only runs when asked.

    </Card>

</CardGroup>

A fence with a `title` gets a header element with the escaped title and the copy button. The wrapper class records whether the block has a header and whether Twoslash is active, so the styles can adapt.

### Mermaid passthrough

A `mermaid` fence is not highlighted. It is escaped and wrapped in `<pre class="mermaid">`, and the original source is returned alongside the HTML so the client can render the diagram. This is the one fence that the highlighter deliberately passes through rather than tokenizing.

```ts
if (lang === 'mermaid') {
	const graph = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return { html: `<pre class="mermaid">${graph}</pre>`, mermaid: code };
}
```

## Putting it together

The pipeline is one read, one parse, and a cache. A file is read at request time, parsed into a plain JSON tree with components broken out at JSX boundaries and code already highlighted, transformed for headings and links, and then cached unless the engine is in dev mode. Because the output is only data, it serializes into the page payload, hydrates in the browser, and renders the same on both sides. The parser borrows JSX syntax but never runs it, and the attribute grammar accepts data but never logic. That is what lets the engine carry rich, component-driven content without a bundler or an evaluator anywhere in the serving path.
