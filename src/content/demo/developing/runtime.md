---
title: The runtime
description: How the CLI drives the prebuilt server in dev and build.
icon: terminal
---

# The runtime

The engine ships a prebuilt server in `dist/`. The CLI never compiles anything. Its whole job is to find a project's content and config, hand them to that server through environment variables, and run one of the small scripts in `runtime/`. Those scripts wrap the compiled handler for local editing, crawl it into a static site, or serve the result. This page goes through each of them and explains why the seams fall where they do.

## The CLI

`bin/axerity.js` is the entry point published as the `axerity` binary. It does not run a bundler, in dev or in build. There is no Vite in the serving path because there is nothing left to assemble. The engine was already compiled once, in CI, before publish.

The first thing the CLI works out is where it is running. It compares the current working directory against its own install root.

```js
const engineRoot = resolve(here, '..');
const userRoot = process.cwd();
const isEngineRepo = userRoot === engineRoot;
```

When you run `pnpm dev` inside the engine repo itself, `userRoot` and `engineRoot` are the same path, so `isEngineRepo` is true. When a user runs `axerity dev` in their own project, the binary lives in their `node_modules` and the two paths differ. This one flag decides where content, config, and static files are read from.

### Resolving a project

`context()` produces the four paths every runtime script needs. For the engine repo it points at the demo content bundled in the source tree. For a user project it discovers them.

<Steps>
	<Step title="Find the content directory">

`findContentDir()` checks `docs`, then `content/docs`, then `content`, and returns the first that exists. This is why a user can drop their Markdown in any of those folders and the CLI just picks it up.

    </Step>
    <Step title="Require a config">

A user project must have an `axerity.json` at its root. If it is missing the CLI tells the user to run `axerity init` and exits. The engine repo uses its own `axerity.json` instead.

    </Step>
    <Step title="Set the static directory">

For a user project the static directory is the project root, so logos and images sit next to the config. For the engine repo it is the content directory.

    </Step>

</Steps>

### Handing off through the environment

The CLI never imports the server. It spawns a runtime script as a child process and passes everything through `AXERITY_*` variables. The compiled server and every runtime script read these and nothing else, so the same `dist/` works for any project without being rebuilt.

| Variable              | Meaning                                       |
| --------------------- | --------------------------------------------- |
| `AXERITY_CONTENT_DIR` | The resolved Markdown folder                  |
| `AXERITY_CONFIG`      | The path to `axerity.json`                    |
| `AXERITY_ASSETS`      | The compiled client assets in `dist/client`   |
| `AXERITY_STATIC_DIR`  | Where the project's own static files live     |
| `AXERITY_OUT`         | The build output folder, set only for `build` |
| `AXERITY_DEV`         | Set to `1` only for `dev`                     |

`runScript` spawns the matching file in `runtime/` with `process.execPath`, inherits stdio so the child's output is the user's output, and forwards `SIGINT` and `SIGTERM` so Ctrl+C stops the server cleanly. The child always runs with its cwd set to `engineRoot`, because that is where `dist/` lives.

<Callout type="info">

`ensureDist()` runs before `dev` and `build`. It checks that `dist/handler.js` exists and exits with a clear message if it does not. Inside the engine repo this is the reminder to run `pnpm build:engine`. In a published package `dist/` is always present, so this guard only ever fires during engine development.

</Callout>

## The OpenAPI prestep

A user project can set an `openapi` key in `axerity.json` to generate reference pages from an OpenAPI spec. This runs as a prestep before `dev` and `build`, never during serving.

`hasOpenapi()` reads the config and returns true only for user projects with that key set. When it is true, and the compiled generator `dist/openapi.js` exists, the CLI runs `runtime/openapi.js` through `runStep`. The important detail is the cwd.

```js
await runStep('openapi.js', env(ctx), userRoot);
```

Every other runtime script runs with its cwd at `engineRoot`. The prestep runs with its cwd at `userRoot`. That is deliberate. Spec paths in the config are written relative to the user's project, and the generator also writes a `.gitignore` block listing the pages it created, so it needs to resolve and write inside the user's tree. `runtime/openapi.js` resolves each non absolute, non URL spec path against the config's own directory, then calls the compiled `generateApiDocs` to write reference pages into the content directory.

### Why a separate compiled entry

`generateApiDocs` lives in `dist/openapi.js`, built as its own Vite library entry, separate from the SSR handler in `dist/handler.js`. There are two reasons it is not part of the server bundle.

<CardGroup cols={2}>
	<Card title="It is not a request path" icon="split">
		The generator writes files to disk once, before the server starts. Folding it into the SSR bundle would pull a spec parser and a file writer into the hot rendering path for no reason.
	</Card>
	<Card title="User projects have no bundler" icon="package">
		A user project never runs Vite. The only way to ship the generator to them is as a prebuilt entry the CLI can import directly, exactly like the handler.
	</Card>
</CardGroup>

## Dev

`runtime/serve.js` runs the compiled handler for local editing. It imports `handler` from `dist/handler.js` and wraps it in a plain Node `http` server. There is no framework around it.

A request is handled in two stages.

<Steps>
	<Step title="Serve user static assets first">

For a `GET`, `resolveAsset` checks whether the URL maps to a real file under the static directory. If it does, the file is streamed with the right MIME type and the handler is never reached. This is what lets a logo referenced as `/logo.svg` resolve straight from the project root.

    </Step>
    <Step title="Delegate to the handler">

Anything that is not a static asset is passed to the compiled handler, with a fallback that returns a plain `404`.

    </Step>

</Steps>

### Live reload

A `chokidar` watcher tracks the content directory and the config file. On any change it adds the path to a set and schedules a debounced flush 60 milliseconds later. The flush writes `data: reload` to every client connected to the `/__axerity_livereload` Server Sent Events endpoint, then prints a single reloaded line that names the changed file.

The browser side is tiny and is injected by `hooks.server.ts`, not by `serve.js`. The hook adds a small `EventSource` script before `</body>`, but only when `AXERITY_DEV` is `1`.

```js
const liveReload =
	process.env.AXERITY_DEV === '1'
		? `<script>...EventSource('/__axerity_livereload')...location.reload()</script>`
		: '';
```

Because the injection is gated on the dev flag, build output never contains the reload script. And because the server reads content from disk on every request, a reload always reflects the current files. There is no rebuild step between editing a Markdown file and seeing it, only a page refresh.

<Callout type="warning">

This is the single most important thing to keep straight while developing. Editing content or config live reloads, because content is read per request. Editing engine code does not, because the server is prebuilt. After changing anything in `src`, run `pnpm build:engine` or restart `pnpm dev`.

</Callout>

## The asset helper

`runtime/static.js` is shared by dev and build, so user assets resolve the same way whether they are streamed live or copied into a static site.

It exports four things. `MIME` is a map from file extension to content type covering images, fonts, video, audio, and PDFs. `isAsset` is true only for extensions in that map. `mimeFor` looks up a type and falls back to `application/octet-stream`. `resolveAsset` turns a URL into a real file path, and `walkAssets` is a generator that yields every asset under a root.

The guard in `resolveAsset` is the part that matters.

```js
const base = resolve(root);
const file = resolve(base, clean);
if (file !== base && !file.startsWith(base + sep)) return null;
```

The URL is stripped of its query and leading slashes, rejected unless its extension is a known asset type, then resolved against the static root. The result must still sit inside that root or it is refused. This path containment check stops a request like `/../../etc/passwd` from escaping the project, even though the helper is pointed at the project root with no allowlist of individual files.

`walkAssets` does the same job in reverse for the build. It walks the tree, skips dotfiles and a fixed `IGNORE` set (`node_modules`, `.git`, build output folders, framework caches), and yields each asset with its path relative to the root.

Serving assets straight from the project is what makes logos and images work with zero configuration. There is no manifest of files to register and no `static/` folder to mirror. If a file exists in the project and its extension is a known asset type, it is reachable.

## Build

`runtime/crawl.js` turns the prebuilt server into a folder of static files. It boots the compiled handler in process and crawls it.

<Steps>
	<Step title="Boot on an ephemeral port">

It wraps the same `handler` in an `http` server and listens on port `0`, so the OS picks a free port. Nothing is exposed to the network. The origin is built from the assigned port and used only for in process fetches.

    </Step>
    <Step title="Prepare the output folder">

It clears `./build`, recreates it, copies `dist/client` in, then copies the user's static assets over using `walkAssets`. The build folder's own name is passed as an extra ignore so the output cannot copy itself.

    </Step>
    <Step title="Read the manifest">

It fetches `/__manifest` to get the full list of routes to write. This is the single source of truth for what ends up on disk.

    </Step>
    <Step title="Write every route">

For each page it writes the HTML and the matching `__data.json`. For raw Markdown, OG images, and fixed routes it writes the response body. It also writes the `404.html` page from the not found route.

    </Step>

</Steps>

### Failing loudly

The resilience of the build lives in one function.

```js
async function fetchOk(path) {
	try {
		const res = await get(path);
		if (!res.ok) {
			failures.push({ path, reason: `HTTP ${res.status}` });
			return null;
		}
		return res;
	} catch (error) {
		failures.push({ path, reason: error.message });
		return null;
	}
}
```

Every route the crawler cares about goes through `fetchOk`. A non 2xx response or a thrown error is recorded as a failure and the route is skipped rather than written. At the end, if there were any failures, the build prints a clean summary listing each broken route and its reason, then exits non zero.

This pairs with the `handleError` hook in `hooks.server.ts`, which logs one readable line per failing route instead of a stack trace.

```js
process.stderr.write(`  ${mark} ${event.url.pathname} ${sep} ${message}\n`);
```

A broken page must fail the build loudly because a static site has no server to recover at request time. If a page throws during the crawl and the build still succeeds, the broken page ships and the error only surfaces when a reader hits it. By treating any non 2xx as a build failure, the output is either complete or it is rejected, and the engineer sees exactly which routes broke and why before anything is published.

## The manifest

`src/routes/__manifest/+server.ts` is the contract between the server and the crawler. It is the only place that decides what a build contains, so the crawler never has to guess at routes.

It returns `base` and four lists.

| List    | Source               | Contents                                                             |
| ------- | -------------------- | -------------------------------------------------------------------- |
| `pages` | `allSlugs()`         | Every rendered page, with the empty slug mapped to the root          |
| `md`    | `getNav().flatPages` | The raw `.md` source for each page                                   |
| `og`    | `allSourcePaths()`   | One `.png` per page, only when `og.enabled` is set                   |
| `fixed` | a constant list      | `search.json`, `sitemap.xml`, `rss.xml`, `llms.txt`, `llms-full.txt` |

Every path is prefixed with `base`, so the crawler can strip that prefix back off to get an on disk location. Because the OG list is gated on `og.enabled`, a project with OG images turned off never has the crawler request a route that would not exist.

## Config at runtime

`src/lib/server/site.ts` reads `axerity.json` from disk and hands the rest of the server a normalized config. `getSite()` parses the file, caches the result, and returns the cache on later calls. The cache is bypassed when `AXERITY_DEV` is `1`, so a dev edit to the config is picked up on the next request while production reads the file once.

It normalizes the parts of the config that point at things. `asset` rewrites a local path like `logo.svg` into a base prefixed URL while leaving absolute URLs and data URIs alone. `p` base prefixes any link that starts with a slash. Logo, favicon, OG logo, top nav, versions, sidebar links, and dropdowns all run through these so the rest of the server can treat every href and asset path as final.

Brand and theme are not baked into `dist/`. They are injected per request by the `handle` hook in `hooks.server.ts`.

```js
transformPageChunk: ({ html }) =>
	html
		.replace('<html', `<html data-theme="${theme}"`)
		.replace('</head>', `${brandTag}</head>`)
		.replace('</body>', `${liveReload}</body>`);
```

`brandStyle` turns the config's brand colors and radius into a small `<style>` block of CSS variables, sanitizing each value so a stray brace cannot break out of the style. The theme name lands on the `<html>` tag. Because this happens in the hook on every render, one compiled server themes itself from whatever project's config it was pointed at, with no rebuild.

## OG images

`src/routes/og/[...slug]/+server.ts` renders an OG image per page on demand. It loads the Geist font weights from `dist/client/fonts`, finds the site logo by trying the static directory and then the compiled assets, reads the page frontmatter for the title and description, derives an eyebrow from the sidebar section, and renders a PNG. During a build these routes are listed in the manifest's `og` array and written to disk like any other route.

## Preview

`runtime/preview.js` serves `./build` the way a static host would, so the build can be checked before it ships. It is a minimal `http` server with clean URL resolution. For a request it tries the path as a file, then as a directory with an `index.html`, then with an `.html` suffix, and finally falls back to the root `index.html`. If nothing matches it serves `404.html`. This mirrors how a host maps a clean URL to a file, so what you see in preview is what a reader gets.

## Where to go next

<CardGroup cols={2}>
	<Card title="Architecture" icon="layers" href="/developing">
		Why the engine is a prebuilt server.
	</Card>
	<Card title="Dev and build" icon="terminal" href="/developing/dev-and-build">
		The shorter tour of the same flow.
	</Card>
</CardGroup>
