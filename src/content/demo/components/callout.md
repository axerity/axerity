---
title: Callout
description: Draw attention to important notes.
icon: info
---

<script>
	import { Callout } from '$lib';
</script>

# Callout

Callouts highlight notes, tips, warnings, and more. Import the component in a
page's `<script>` block, then use it anywhere in your Markdown.

## Variants

<Callout type="info">

This is the default **info** callout.

</Callout>

<Callout type="tip">

A handy **tip** to make your life easier.

</Callout>

<Callout type="success">

Everything worked, **success!**

</Callout>

<Callout type="warn">

Careful, this is a **warning**.

</Callout>

<Callout type="error">

Something went wrong, this is an **error**.

</Callout>

## Usage

Leave a blank line between the tags and the content so the inner text is parsed
as Markdown (an mdsvex requirement):

```svelte
<script>
	import { Callout } from '$lib';
</script>

<Callout type="warn">Careful, this is a **warning** with a [link](/).</Callout>
```

## Types

| Type               | Use for                          |
| ------------------ | -------------------------------- |
| `info` _(default)_ | General notes and asides         |
| `tip`              | Helpful suggestions              |
| `success`          | Confirmations and positive notes |
| `warn` / `warning` | Things to be careful about       |
| `error`            | Errors and destructive warnings  |

## Custom title

Pass a `title` to override the default heading:

<Callout type="tip" title="Pro tip">

You can set any heading you like.

</Callout>

```svelte
<Callout type="tip" title="Pro tip">You can set any heading you like.</Callout>
```
