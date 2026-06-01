---
title: Deployment
description: Build and host your docs.
icon: rocket
---

# Deployment

Axerity builds to a static site, so you can host it anywhere that serves static
files.

## Build

```bash
axerity build
```

This prerenders every page to HTML and writes the search index, the `.md` URLs,
and the `llms.txt` files. The output is a plain folder of static assets.

## Host it

Point any static host at the build output. Common choices are Vercel, Netlify,
Cloudflare Pages, and GitHub Pages. No server is required.

## Adapters

The build target is set by the SvelteKit adapter in `svelte.config.js`. The
default adapter detects common hosts automatically. If you deploy somewhere it
does not recognize, swap in a specific adapter such as the static adapter for
plain file hosting.
