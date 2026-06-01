---
title: Badge
description: Small inline labels for status and tags.
icon: tag
---

<script>
	import { Badge } from '$lib';
</script>

# Badge

A badge is a small pill you can drop inline to label something, a status, a
version, or a tag. It sits on the text baseline so it reads inside a sentence.

## Colors

Stripe is <Badge color="success">live</Badge>, billing is <Badge color="warn">in review</Badge>, and the old API is <Badge color="error">deprecated</Badge>. Use <Badge color="info">info</Badge> or the default <Badge>neutral</Badge> for everything else.

## Usage

```svelte
<script>
	import { Badge } from '$lib';
</script>

The new endpoint is <Badge color="success">stable</Badge>.
```

## Props

| Prop    | Type     | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| `color` | `string` | `neutral`, `info`, `success`, `warn`, or `error` |
