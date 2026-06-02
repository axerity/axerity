---
title: Rendering and components
description: How the document model becomes UI, and how the kit handles state.
icon: blocks
---

# Rendering and components

By the time a page reaches the browser it is no longer Markdown. It is a tree of plain data, a `DocNode[]`, parsed and serialized at request time. This page is about the other half of that story: how that tree turns into real UI, how the component kit receives its content, and the reactivity lessons that took real bugs to learn.

## The recursive renderer

Everything visible on a page is produced by one component, `src/lib/markdown/Markdown.svelte`. It takes a `nodes: DocNode[]` prop and walks it. For each node it branches on `node.type` and renders itself recursively for any children.

There are five node types, defined in `src/lib/markdown/types.ts`: `text`, `raw`, `code`, `element`, and `component`. The renderer handles each one directly.

<Steps>
	<Step title="Text nodes">

A `text` node is just a string. It renders as `{node.value}`, which means Svelte escapes it. No author text can inject markup through this path.

	</Step>
	<Step title="Raw and code nodes">

A `raw` node and a `code` node both carry a pre-built `html` string. Raw is sanitized inline HTML, code is the output of Shiki highlighting. Both render with `{@html node.html}`. This is the one place the renderer trusts a string, and it trusts it because that string was produced by the engine during parsing, not by the browser.

	</Step>
	<Step title="Element nodes">

An `element` node is a plain HTML tag like `<p>` or `<a>`. It renders with `<svelte:element this={node.tag} {...node.props}>`. The tag name and the attributes are both data, so one branch covers every HTML element the parser can emit.

	</Step>
	<Step title="Component nodes">

A `component` node names a kit component. The renderer looks the name up in the registry and, if it resolves, renders `<Comp {...node.props}>` with the children recursed through another `Markdown` instance.

	</Step>
</Steps>

### Void elements

HTML has a set of elements that cannot have children, like `<br>`, `<img>`, and `<hr>`. Writing `<svelte:element this="br"></svelte:element>` with a body is invalid, so the renderer keeps a module-level `VOID` set and checks it first:

```svelte
{#if VOID.has(node.tag)}
	<svelte:element this={node.tag} {...node.props} />
{:else}
	<svelte:element this={node.tag} {...node.props}>
		<Self nodes={node.children} />
	</svelte:element>
{/if}
```

A void element renders self-closing with no children branch at all. Everything else recurses.

### The empty-children detail

The most load-bearing detail in the renderer is small. When it renders a component node, it only emits a children snippet if the node actually has children:

```svelte
{#if node.children.length}
	<Comp {...node.props}>
		<Self nodes={node.children} />
	</Comp>
{:else}
	<Comp {...node.props} />
{/if}
```

A component written self-closing in Markdown, like `<Icon name="check" />`, has an empty `children` array. If the renderer always passed a snippet, every such component would receive a `children` that renders to nothing but is still a real snippet function. By omitting it, a self-closing component receives `children === undefined`. That single difference is why every kit component has to guard its children, which the next section covers.

<Callout type="info">

Lowercase tag names become `element` nodes, capitalized names become `component` nodes. The split happens in the parser, so the renderer never has to guess. `<br>` is an element, `<Icon>` is a component.

</Callout>

### SSR and hydration parity

The renderer reads data and nothing else. It has no `onMount` that fetches, no time-dependent branch, no access to anything that differs between the server and the client. Given the same `DocNode[]` it produces the same DOM on the server and on the client.

That is what makes hydration safe. The server renders the tree to HTML, the client renders the same tree over it, and the two match because they are pure functions of the same input. The reactivity and state described below all live inside individual kit components, never in the walk itself.

## The registry

The renderer never imports a component by name and never compiles anything. It resolves component nodes through a fixed map in `src/lib/markdown/registry.ts`:

```ts
export const registry: Record<string, Component> = {
	Callout: kit.Callout,
	Card: kit.Card,
	Steps: kit.Steps,
	Step: kit.Step,
	Tabs: kit.Tabs,
	Api: kit.Api,
	RequestExample: kit.RequestExample
};
```

If a name is not in the map, the renderer renders nothing for that node. There is no fallback to user code, because there is no user code.

This is a deliberate design choice and the reason for several of the engine's properties:

<CardGroup cols={2}>
	<Card title="Safety" icon="shield">

An author can only reach components the engine ships. A Markdown file cannot introduce arbitrary Svelte, so it cannot run arbitrary code in the serving path.

	</Card>
	<Card title="No compilation" icon="zap">

The registry is resolved at runtime against already-compiled components. Nothing in a project gets bundled, which is why a page renders without a bundler anywhere near it.

	</Card>
	<Card title="Predictable surface" icon="list">

The set of usable tags is exactly the keys of this map. That makes the authoring surface documentable and stable, and it makes adding a component a deliberate registration rather than an implicit import.

	</Card>
	<Card title="Consistent props" icon="check">

Every component is fed by the same attribute grammar, so values arrive typed the same way no matter which component receives them.

	</Card>
</CardGroup>

## How components receive content

A kit component receives two kinds of input, and they arrive very differently.

Props come from the attribute grammar as real typed values. `cols={2}` arrives as the number `2`, a bare `open` arrives as `true`, and a quoted `title="Heads up"` arrives as a string. A component declares them with `$props()` and uses them directly.

Children arrive as an already-rendered `Snippet`. The component does not see Markdown or a node array, it sees a snippet it can render with `{@render children()}`. This is what lets a component wrap arbitrary content without knowing anything about it.

### The null-safety requirement

Because the renderer omits children for self-closing components, `children` is optional on every kit component, and a component must never call it unguarded. There are two safe patterns.

The defensive render with optional chaining, as in `Steps.svelte`:

```svelte
<div class="steps">
	{@render children?.()}
</div>
```

The explicit guard, as in `Step.svelte` and `Card.svelte`, which is used when the wrapper markup should disappear entirely for empty content:

```svelte
{#if children}
	<div class="step-body">
		{@render children()}
	</div>
{/if}
```

`Card.svelte` does the same with its body, so a card with only a title and icon renders without an empty body div.

<Callout type="warning">

A component that calls `children()` without a guard will throw the moment it is used self-closing, because `children` is `undefined`. In strict component validation that throw is build-failing, and at runtime it tears down the render. Treat `{@render children?.()}` or an `{#if children}` guard as mandatory for every kit component.

</Callout>

## The context-collection pattern

Some components are not configured by props alone, they are configured by their children. An `<Api>` block does not know its own request and response examples until the `<RequestExample>` and `<ResponseExample>` components inside it tell it. `<Tabs>` does not know its tab titles until each `<Tab>` registers one.

The pattern that solves this is context collection. The parent sets a context object with register and unregister functions, backed by a `$state` array. Each child reads the context on mount and registers itself, then unregisters on destroy.

In `Api.svelte` the parent owns the array and exposes the two functions through `setContext`:

```ts
const examples = $state<ApiExampleEntry[]>([]);
let counter = 0;

setContext<ApiContext>(API, {
	registerExample(entry) {
		const id = counter++;
		examples.push({ ...entry, id });
		return id;
	},
	unregisterExample(id) {
		const index = examples.findIndex((example) => example?.id === id);
		if (index !== -1) examples.splice(index, 1);
	}
});
```

A child like `RequestExample.svelte` registers on mount and unregisters on destroy, passing its own `children` snippet up so the parent can render it in the rail:

```ts
const api = getContext<ApiContext>(API);
const id = untrack(() => api.registerExample({ title, kind: 'request', snippet: children }));
onDestroy(() => api.unregisterExample(id));
```

The `untrack` matters: registration is a side effect on mount, not something that should re-run when reactive state read inside it changes.

The parent then groups the flat array with `$derived` filters by `kind`:

```ts
const requests = $derived(examples.filter((example) => example?.kind === 'request'));
const responses = $derived(examples.filter((example) => example?.kind === 'response'));
const objects = $derived(examples.filter((example) => example?.kind === 'object'));
```

`Tabs.svelte` uses the identical shape, registering `TabMeta` entries and finding the active one by title:

```ts
const activeId = $derived.by(() => {
	const match = activeValue !== undefined ? tabs.find((t) => t?.title === activeValue) : undefined;
	return match?.id ?? tabs[0]?.id;
});
```

### The critical lesson: null-safe filters

Look closely at those filters and finds. Every one of them reads `example?.kind` and `t?.title`, with the optional chaining. That is not stylistic. It is the fix for a real and subtle bug.

During client-side navigation, the children of an `<Api>` or `<Tabs>` block are destroyed as the page tears down. Svelte processes those destroys, and the `unregister` calls that come with them, in an order that does not perfectly match the structure of the array. For a transient moment the `$state` array can contain a hole, an `undefined` slot that has not yet been spliced out. During that same moment the `$derived` filter re-runs, because the array it depends on just changed.

If the filter read `example.kind` instead of `example?.kind`, it would dereference `undefined` and throw.

<Callout type="warning">

An error thrown inside a `$derived` or inside a `filter` that feeds one does not just break that one value. It propagates out of the reactive effect that is evaluating it, and an uncaught error in Svelte's reactivity graph halts that graph. The effects stop re-running. From that point on, for the rest of the session, nothing on the page reacts: tabs do not switch, code groups do not sync, nothing updates until a full page reload rebuilds the graph.

</Callout>

That is what makes this bug so easy to miss and so damaging when it lands. It does not show up on a static first render, because the array is never holey there. It only shows up during navigation teardown, and when it shows up it does not produce a visible crash, it silently kills client reactivity. The symptom is a page that worked a second ago and now ignores every click.

The defense is uniform: any filter, find, or map that runs over one of these registration arrays inside reactive code must treat elements as possibly `undefined`. `examples.filter((e) => e?.kind === 'request')` and `tabs.find((t) => t?.title === activeValue)` are correct. The unguarded versions are a trap.

## Shared selection state

Two components share a selection across the whole page so that picking an option in one place updates every matching place. Both use a small `$state`-backed store persisted to `localStorage`, but they reach their children in opposite ways.

### Grouped tabs

`tabs-store.svelte.ts` holds a record of group name to selected title:

```ts
class TabGroupStore {
	#values = $state<Record<string, string>>({});

	init(group: string) {
		if (!browser || this.#values[group] !== undefined) return;
		const stored = localStorage.getItem(PREFIX + group);
		if (stored !== null) this.#values[group] = stored;
	}

	set(group: string, value: string) {
		this.#values[group] = value;
		if (browser) localStorage.setItem(PREFIX + group, value);
	}
}
```

A `<Tabs group="install">` reads its active title from the store rather than from local state. When one set of grouped tabs changes, every other set with the same group reads the new value through the shared `$state` and re-derives its active tab. The selection survives reloads because it is mirrored to `localStorage`, and it is only read in the browser so it never desyncs server rendering.

`code-group-store.svelte.ts` is the same idea reduced to a single label, used to keep every code group on the same language tab.

### Code groups are DOM-based

`CodeGroup.svelte` looks different from `Tabs.svelte`, and the reason is structural. A code block is not a child component. It is pre-highlighted HTML produced by Shiki during parsing, a `code` node that renders through `{@html}`. There is no `<Tab>` to register a title, only rendered markup.

So `CodeGroup` reads the DOM instead of a registration array. After mount, an `$effect` queries the container for the pre-rendered blocks and pulls their titles out of the markup:

```svelte
$effect(() => {
	codeGroups.init();
	if (!container || tabs.length) return;
	const found = Array.from(
		container.querySelectorAll('.cg-blocks > .code-block')
	) as HTMLElement[];
	if (!found.length) return;

	blocks = found;
	tabs = found.map((block, index) => {
		const title = block.querySelector('.code-title')?.textContent?.trim();
		return title || `Tab ${index + 1}`;
	});
});
```

A second `$effect` toggles the `hidden` class on each block whenever the active index changes, so switching tabs shows and hides pre-rendered DOM rather than rendering anything new.

The tradeoff is deliberate. Reading the DOM means the component depends on the markup Shiki emits, the `.code-block`, `.code-title`, and `.line` class names, and it does its work in an effect after mount rather than during render. In exchange the code stays highlighted HTML the whole way through, with no re-highlighting in the browser and no need to turn every fenced block into a child component just so a wrapper can enumerate it. For content that is already finished HTML by the time it reaches the page, reaching into the DOM is the honest representation of what is actually there.
