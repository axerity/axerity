# CLAUDE.md

Axerity (`@axerity/cli`) is a documentation-site generator. End users write
Markdown + one `axerity.json`, run the `axerity` CLI, and get a portable static
site. This repo is **the engine**: a prebuilt SvelteKit (adapter-node) app driven
by a thin, dependency-free CLI.

## The mental model that explains everything

There are two run modes, and the same compiled engine serves both:

- **End-user project**: `axerity dev|build|preview` runs the prebuilt engine
  (`dist/`) against the user's content. `bin/axerity.js` locates their content
  (`docs/` → `content/docs/` → `content/`) and config (`axerity.json` or
  `docs.json`) and passes everything to the engine via env vars
  (`AXERITY_CONTENT_DIR`, `AXERITY_CONFIG`, `AXERITY_ASSETS`, `AXERITY_STATIC_DIR`,
  `AXERITY_OUT`, `AXERITY_DEV`). Users never touch SvelteKit.
- **This repo (developing the engine)**: the engine renders its own demo docs in
  `src/content/demo/`.

The CLI never invokes SvelteKit directly. `runtime/*.js` are plain Node scripts
that import the adapter-node `handler` from `dist/`: `serve.js` (dev + SSE
live-reload), `crawl.js` (boots the handler, reads `/__manifest`, fetches every
URL, writes `./build`), `preview.js`, `openapi.js`, `static.js`.

## Commands

| Task                    | Command                                                       |
| ----------------------- | ------------------------------------------------------------- |
| Dev server              | `pnpm dev` (predev rebuilds the engine first)                 |
| Build static site       | `pnpm build` → `./build`                                      |
| Preview built site      | `pnpm preview`                                                |
| Build engine only       | `pnpm build:engine` (`vite build` + `build:openapi`)          |
| Typecheck               | `pnpm check` (svelte-check)                                   |
| Lint                    | `pnpm lint` (prettier --check + eslint)                       |
| Format                  | `pnpm format`                                                 |
| All tests               | `pnpm test` (`vitest run`)                                    |
| Watch tests             | `pnpm test:watch`                                             |
| Coverage                | `pnpm test:coverage`                                          |
| One test file           | `pnpm test -- tests/unit/versioning.test.ts`                  |
| One project             | `pnpm test -- --project unit` (or `components`)               |
| Update golden snapshots | `pnpm test -- -u` (review the `.snap` diff before committing) |

Node >= 24, pnpm. CI runs `check`, `lint`, `build:engine`, `test`.

## Generated files — do not hand-edit

`scripts/prepare-engine.mjs` runs on every `prepare`/`predev`/`prebuild`/`check`
and **overwrites** these (all gitignored), so edits to them are lost:

- `axerity.json` ← copied from **`axerity.default.json`** (edit this instead)
- `src/content/docs/` ← symlinks into **`src/content/demo/`** (edit demo instead)
- `static/axerity.schema.json` ← copied from **`axerity.schema.json`**
- `dist/` ← the compiled engine (`pnpm build:engine`)

## Content pipeline

Request flow for a doc page: `src/routes/[...slug=docpage]/+page.server.ts` →
`render(slug)` in `src/lib/server/content-store.ts` → `parseMarkdown` in
`src/lib/markdown/parse.ts` → `Markdown.svelte` renders the result.

- **No mdsvex**, despite the keyword and stale comments. Markdown is compiled by a
  hand-rolled unified/remark + custom MDX-JSX pipeline (`parse.ts`) into a
  serializable `DocNode[]` AST, which `markdown/Markdown.svelte` walks
  recursively. `svelte.config.js` only registers `.svelte` extensions.
- Capitalized JSX tags resolve to Svelte components via `markdown/registry.ts`
  (the kit: `Callout`, `Card`, `Tabs`, `Api`, `Endpoint`, …); unknown names render
  nothing. Lowercase tags become plain elements.
- JSX attribute values are evaluated by `markdown/attr-grammar.ts`, a safe
  acorn-based evaluator (whitelists literals/arrays/objects, no `eval`). Author
  `<script>` blocks are stripped before parsing.
- Routing: `[...slug=docpage]` renders pages (matcher rejects `.md`);
  `[...path=mdfile]` serves raw markdown for `.md` URLs. Other endpoints:
  `llms.txt`, `llms-full.txt`, `search.json`, `sitemap.xml`, `rss.xml`,
  `og/[...slug]` (Satori/resvg OG images), `__manifest` (crawl list).
- Sidebar/order is data-driven by per-folder `meta.json` (`tree.ts`,
  `buildSidebar`). Slugs: `index.md` → `''`, `foo/index.md` → `/foo`.

## Config & theming

- `src/lib/server/site.ts` (`getSite`) loads `AXERITY_CONFIG`, normalizes hrefs/
  assets, and memoizes — **except when `AXERITY_DEV=1`**, which bypasses caching
  (content-store and site config both cache per-process otherwise).
- `p(href)` prefixes internal hrefs with the SvelteKit `base`. `basePath` in
  `axerity.json` sets `base` in `svelte.config.js`. **Everything is base-path
  aware** — when adding/comparing URLs, account for `base` (see `pathInVersion`,
  `tree.ts`, `parse.ts`).
- `SiteConfig` lives in `src/lib/types.ts`; `axerity.schema.json` is the source of
  truth for the full field list. Only `name` + `topNav` are required.
- Theme tokens are CSS custom properties in `src/routes/layout.css`; presets are
  `[data-theme='<name>']` blocks applied server-side in `src/hooks.server.ts`
  (`brand` overrides injected with `!important`). Light/dark preference is
  client-side in `src/lib/state/theme.svelte.ts` (localStorage `axerity-theme`).

## Conventions

- **Regression-test-first**: every bug fix lands with a test that fails before the
  fix (see `CONTRIBUTING.md`). New kit components are auto-covered by
  `tests/components/kit-children.test.ts` once registered.
- Tests use `$app/*` mocks in `tests/mocks/` (`base = ''`). To test base-path
  behavior, `vi.mock('$app/paths', …)` in a dedicated file.
- Integration tests (`tests/integration/build.test.ts`) **skip unless
  `dist/handler.js` exists** — run `pnpm build:engine` first to exercise them.
- Comments are rare and explain _why_, not _what_. Prefer self-documenting code.

---

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
