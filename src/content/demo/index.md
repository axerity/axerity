---
title: Introduction
description: A documentation site generator for Svelte.
icon: home
---

<script>
	import { Card, CardGroup, Callout } from '$lib';
</script>

# Introduction

Axerity is a documentation site generator for Svelte. You write your content in
Markdown, drop in Svelte components when you need them, and get a fast static
site with search, navigation, and a clean theme.

## What you get

- File based content. Add a Markdown file and it shows up in the sidebar.
- A `meta.json` in each folder to set titles, icons, and ordering.
- Code blocks with syntax highlighting, copy buttons, titles, line highlighting,
  and line numbers.
- Components you can use right inside Markdown: callouts, cards, tabs, steps,
  accordions, type tables, and a layout for API reference pages.
- Light and dark themes, driven entirely by CSS variables.
- Full text search, built at compile time.

<Callout type="tip">

The whole site is configured from one `axerity.json` file. Drop in Markdown,
set up your `meta.json` files, and you never have to touch the code.

</Callout>

## Get started

<CardGroup cols={2}>
	<Card title="Installation" icon="download" href="/installation">

Get Axerity running locally in about a minute.

    </Card>
    <Card title="Quick Start" icon="rocket" href="/quick-start">

Write your first page and watch the sidebar fill in.

    </Card>
    <Card title="Components" icon="blocks" href="/components/callout">

Browse the components you can use in your pages.

    </Card>
    <Card title="API Reference" icon="code" href="/api/pet/pet-object">

See the layout built for documenting an API.

    </Card>

</CardGroup>
