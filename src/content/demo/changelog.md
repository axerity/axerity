---
title: Changelog
description: What's new in Axerity.
icon: history
date: 2026-06-04
updated: 2026-06-04
---

<script>
	import { Update, Changelog, Badge } from '$lib';
</script>

# Changelog

Every notable change, newest first. Filter by tag to narrow the list.

<Changelog>

<Update label="June 4, 2026" description="v0.3.0" tags={["Feature"]}>

Redesigned the `Update` component and added the `Changelog` wrapper.
<Badge color="success">new</Badge>

- A two-column layout with a label, a description, and tags.
- Wrap your updates in `Changelog` to turn the tags into a filter bar.
- Each update gets its own anchor and its own entry in the RSS feed.
- Headings inside an update stay out of the table of contents.
- A full field-by-field reference for `axerity.json`.

</Update>

<Update label="June 3, 2026" description="v0.2.6" tags={["Feature"]}>

- The config file can be named `docs.json` as well as `axerity.json`.
- Broader test coverage across the content store, OpenGraph, hooks, and the generated endpoints.

</Update>

<Update label="June 2, 2026" description="v0.2.5" tags={["Performance"]}>

- Smaller installs and a lazily loaded search index.
- The config schema is now hosted, so editor autocomplete works from a URL.
- A full Vitest suite, a CI gate that runs on every change, and coverage thresholds on the core.
- A deep dive on the engine internals and design decisions.

</Update>

<Update label="June 2, 2026" description="v0.2.4" tags={["Fix"]}>

- Fixed code group state sync and the doubled borders on nested groups.
- Made the API reference layout responsive.

</Update>

<Update label="June 2, 2026" description="v0.2.3" tags={["Feature"]}>

- Prebundled the common syntax-highlighting languages.
- Resilient builds: a broken page now fails the build instead of shipping a 500.

</Update>

<Update label="June 2, 2026" description="v0.2.2" tags={["Feature"]}>

- Generate an OpenAPI reference for your own project, not just the demo.
- Configurable favicon and per-page OpenGraph images.
- Crash fixes for self-closing components and reactive null-safety.

</Update>

<Update label="June 2, 2026" description="v0.2.1" tags={["Fix"]}>

- Serve your own static assets, with logo paths normalized.
- Run the crawler correctly in a Vercel build.
- A new Development section in the docs.

</Update>

<Update label="June 1, 2026" description="v0.2.0" tags={["Release"]}>

Rewrote the engine as a prebuilt server. <Badge color="info">major</Badge>

- Reads your content and `axerity.json` at runtime, so there is nothing to clone or compile.

</Update>

<Update label="June 1, 2026" description="v0.1.4" tags={["Fix"]}>

- Disabled the Vite dependency scan under store mounts.
- Hot-reload of `axerity.json` in dev.

</Update>

<Update label="June 1, 2026" description="v0.1.3" tags={["Fix"]}>

- Render dynamic icons from the Lucide data map instead of per-icon modules.
- Updated the docs and the config schema URL.

</Update>

<Update label="June 1, 2026" description="v0.1.2" tags={["Feature"]}>

- A `--version` flag on the CLI.
- A package readme.
- Relaxed `fs.strict` so dev works from the pnpm store.

</Update>

<Update label="June 1, 2026" description="v0.1.1" tags={["Fix"]}>

- Resolve the Vite bin through Node resolution so it works under pnpm and dlx layouts.

</Update>

<Update label="June 1, 2026" description="v0.1.0" tags={["Preview"]}>

First public preview.

- The `axerity` CLI: `init`, `dev`, `build`, and `preview`.
- Markdown rendering, dark mode, and the flat layout.
- Theme presets, sidebar variants, and custom brand accent and radius overrides.
- Serve docs at the root or under a configurable `basePath`.
- OpenAPI generation, webhook and WebSocket components, versioned docs, and a roadmap component.
- A JSON config schema, and deployment guides for Vercel, Cloudflare, Netlify, Pages, nginx, and Caddy.

</Update>

</Changelog>
