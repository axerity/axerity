---
title: Code Group
description: Switch between related code blocks in a single tabbed panel.
icon: code
---

<script>
	import { CodeGroup } from '$lib';
</script>

# Code Group

A code group collapses several code blocks into one panel with a tab for each.
It is handy for showing the same step across package managers or languages. Each
tab takes its label from the block's `title`, so give every block one.

## Example

<CodeGroup>

```bash title="npm"
npm install axerity
```

```bash title="pnpm"
pnpm add axerity
```

```bash title="yarn"
yarn add axerity
```

</CodeGroup>

## Usage

Wrap the blocks in `<CodeGroup>` and leave a blank line around each one so the
Markdown is parsed:

````md
<CodeGroup>

```bash title="npm"
npm install axerity
```

```bash title="pnpm"
pnpm add axerity
```

</CodeGroup>
````

The `title` on each block becomes its tab. Without a title a block falls back to
`Tab 1`, `Tab 2`, and so on.
