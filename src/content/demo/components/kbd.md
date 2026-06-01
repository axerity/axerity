---
title: Keyboard
description: Show keyboard keys and shortcuts.
icon: keyboard
---

<script>
	import { Kbd } from '$lib';
</script>

# Keyboard

Wrap a key name in `Kbd` to render it as a physical keyboard key. It is handy
for documenting shortcuts inline.

## Example

Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, or <Kbd>Esc</Kbd> to close a dialog.

## Usage

```svelte
<script>
	import { Kbd } from '$lib';
</script>

Save with <Kbd>Ctrl</Kbd> <Kbd>S</Kbd>.
```
