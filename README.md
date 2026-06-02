# Axerity

A documentation site generator built with SvelteKit. Write Markdown, configure
one JSON file, and ship a fast static site.

## Quick start

```sh
pnpm dlx @axerity/cli init mydocs
cd mydocs
pnpm dlx @axerity/cli dev
```

That scaffolds a content-only project and starts a live dev server at
`http://localhost:5173`.

```
mydocs/
  axerity.json     # all configuration
  docs/            # your Markdown
    meta.json      # ordering and icons per folder
    index.md
    quickstart.md
```

## Install

Run it without installing:

```sh
pnpm dlx @axerity/cli <command>
```

Or add it to a project so the version is pinned and reproducible:

```sh
pnpm add -D @axerity/cli
```

```json
{
	"scripts": {
		"dev": "axerity dev",
		"build": "axerity build",
		"preview": "axerity preview"
	}
}
```

## Commands

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `axerity init`    | Scaffold a new docs site              |
| `axerity dev`     | Start the dev server with live reload |
| `axerity build`   | Build a static site into `./build`    |
| `axerity preview` | Serve the production build locally    |

The build output is a plain static site you can host anywhere: Vercel, Netlify,
Cloudflare, GitHub Pages, nginx, or any static host.

## Features

- Markdown with a built in component kit: callouts, cards, tabs, steps,
  accordions, code groups, badges, trees, frames, and more
- API references generated from an OpenAPI spec, plus webhook and WebSocket
  components
- Versioned content with a switcher that follows the reader across versions
- Themes, custom brand colors, and full white labelling from `axerity.json`
- Build time search, an RSS feed, sitemap, `llms.txt`, and dynamic OpenGraph
  images
- Mermaid diagrams, Twoslash type hovers, and syntax highlighting

## Configuration

Everything global lives in `axerity.json`. A few of the common keys:

```json
{
	"$schema": "https://axerity.com/axerity.schema.json",
	"name": "My Docs",
	"theme": "neutral",
	"openapi": "./openapi.json",
	"topNav": [{ "title": "Docs", "href": "/" }]
}
```

Point `$schema` at the bundled JSON schema for autocomplete and validation in
your editor.

## Requirements

Node.js 24 or newer.

## License

MIT
