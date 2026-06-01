---
title: Installation
description: Get Axerity running locally in a minute.
icon: download
---

# Installation

Axerity is a SvelteKit project. Clone it, install dependencies, and start the dev
server.

## Requirements

- Node.js 20 or newer
- pnpm (the project's package manager)

## Set up

Install dependencies and start developing:

```bash
pnpm install
pnpm dev
```

Your site is now running at `http://localhost:5173`.

## Project layout

Content lives under `src/content/docs`. Everything else is the engine:

```
src/
  content/docs/      your markdown + meta.json
  lib/components/    layout + UI components
  lib/content/       content-tree generator
  routes/            sveltekit routes
```
