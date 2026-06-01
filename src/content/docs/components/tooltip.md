---
title: Tooltip
description: Show a short hint when a reader hovers or focuses a word.
icon: message-circle
---

<script>
	import { Tooltip } from '$lib';
</script>

# Tooltip

Tooltips attach a short note to a word or phrase. The note stays hidden until the
reader hovers the trigger or moves keyboard focus onto it. Use them for quick
definitions and asides that would clutter the sentence if written inline.

## Example

The request returns a <Tooltip tip="JavaScript Object Notation, a plain text data format.">JSON</Tooltip> body with the pet record. Hover the dotted word to read the hint.

## Usage

```svelte
<script>
	import { Tooltip } from '$lib';
</script>

The request returns a <Tooltip tip="JavaScript Object Notation.">JSON</Tooltip> body.
```

The text between the tags is the trigger. It gets a dotted underline so readers
know there is more to see. The `tip` text is the note that appears above it.

## Keyboard and screen readers

The trigger is a real button, so it is reachable with the Tab key and the note
shows on focus as well as hover. The `tip` is also exposed as the button's label,
so screen readers announce it.

## Props

| Prop  | Type     | Description              |
| ----- | -------- | ------------------------ |
| `tip` | `string` | The hint text (required) |
