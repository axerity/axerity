---
title: Type Table
description: Document an object's properties in a configurable table.
icon: tag
---

<script>
	import { TypeTable } from '$lib';
</script>

# Type Table

`TypeTable` documents the shape of an object, component props, config options,
API parameters, from a single object. The **Default** column hides itself when
no property defines one.

## Example

<TypeTable
type={{
		title: {
			type: 'string',
			description: 'The heading shown at the top.',
			required: true
		},
		icon: {
			type: 'string',
			description: 'A Lucide icon name shown beside the title.'
		},
		open: {
			type: 'boolean',
			description: 'Whether the panel starts expanded.',
			default: 'false'
		},
		variant: {
			type: "'flat' | 'boxed'",
			typeDescription: 'Controls the container width.',
			default: "'flat'"
		},
		legacy: {
			type: 'boolean',
			description: 'No longer used.',
			deprecated: true
		}
	}}
/>

## Usage

```svelte
<script>
	import { TypeTable } from '$lib';
</script>

<TypeTable
	type={{
		title: { type: 'string', description: 'The heading.', required: true },
		open: { type: 'boolean', default: 'false' }
	}}
/>
```

## Per-property fields

<TypeTable
type={{
		type: { type: 'string', description: 'Shown as a code chip.' },
		description: { type: 'string', description: 'Short prose under the name.' },
		typeDescription: {
			type: 'string',
			description: 'Longer note shown muted under the type.'
		},
		default: { type: 'string', description: 'Shown as a code chip in the Default column.' },
		required: { type: 'boolean', description: 'Adds a "required" badge.' },
		deprecated: { type: 'boolean', description: 'Strikes the name and adds a badge.' }
	}}
/>
