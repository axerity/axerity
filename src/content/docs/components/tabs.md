---
title: Tabs
description: Switch between alternative content in place.
icon: layers
---

<script>
	import { Tabs, Tab } from '$lib';
</script>

# Tabs

Tabs let readers switch between alternative content, package managers, OSes, or
languages, without leaving the page.

## Example

<Tabs>
	<Tab title="pnpm">

```bash
pnpm add axerity
```

    </Tab>
    <Tab title="npm">

```bash
npm install axerity
```

    </Tab>
    <Tab title="yarn">

```bash
yarn add axerity
```

    </Tab>

</Tabs>

The first tab is selected by default.

## Icons

Give a `Tab` an `icon` (any Lucide name) to show a glyph next to its label:

<Tabs>
	<Tab title="TypeScript" icon="code">

```ts
export const x: number = 1;
```

    </Tab>
    <Tab title="Config" icon="file-text">

```json
{ "x": 1 }
```

    </Tab>

</Tabs>

## Shared & persistent groups

Give multiple `Tabs` the same `group` and they sync, picking a tab in one
switches every other group on the page, and the choice is **remembered across
reloads** (via `localStorage`). Tabs are matched by title.

<Tabs group="pm">
	<Tab title="pnpm">

```bash
pnpm add axerity
```

    </Tab>
    <Tab title="npm">

```bash
npm install axerity
```

    </Tab>

</Tabs>

<Tabs group="pm">
	<Tab title="pnpm">

```bash
pnpm dev
```

    </Tab>
    <Tab title="npm">

```bash
npm run dev
```

    </Tab>

</Tabs>

Switch one of the two blocks above, the other follows.

## Usage

Import `Tabs` and `Tab`, then give each `Tab` a `title`. Remember the blank
lines around tab content so the Markdown inside is parsed:

````md
<script>
	import { Tabs, Tab } from '$lib';
</script>

<Tabs>
	<Tab title="pnpm">

    ```bash
    pnpm add axerity
    ```

    </Tab>
    <Tab title="npm">

    ```bash
    npm install axerity
    ```

    </Tab>

</Tabs>
````

## Props

| Component | Prop    | Description                                     |
| --------- | ------- | ----------------------------------------------- |
| `Tabs`    | `group` | Sync + persist selection across same-group tabs |
| `Tab`     | `title` | Tab label (required)                            |
| `Tab`     | `icon`  | Optional Lucide icon name                       |
