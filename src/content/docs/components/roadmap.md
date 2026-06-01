---
title: Roadmap
description: Show what you are building, in progress, and shipped.
icon: map
---

<script>
	import { Roadmap, RoadmapItem } from '$lib';
</script>

# Roadmap

A roadmap is a list of items, each with a status and an optional target. Use it
on a public roadmap page so readers can see what is planned, what you are working
on now, and what already shipped.

## Example

<Roadmap>

<RoadmapItem title="Versioned content" status="shipped" eta="June 2026">

Keep separate v1 and v2 content trees with a switcher that follows the reader
across versions.

</RoadmapItem>

<RoadmapItem title="Search filters" status="in-progress" eta="Q3 2026">

Filter results by section and tag.

</RoadmapItem>

<RoadmapItem title="Offline reading" status="exploring">

Bundle pages into a service worker so docs stay available without a connection.

</RoadmapItem>

<RoadmapItem title="PDF export" status="planned" />

</Roadmap>

## Usage

Wrap the items in `<Roadmap>` and give each `<RoadmapItem>` a `title` and a
`status`. The body is optional, and so is the `eta`.

```svelte
<script>
	import { Roadmap, RoadmapItem } from '$lib';
</script>

<Roadmap>
	<RoadmapItem title="Versioned content" status="shipped" eta="June 2026">
		Separate content trees with a version switcher.
	</RoadmapItem>

	<RoadmapItem title="Search filters" status="in-progress" eta="Q3 2026">
		Filter results by section and tag.
	</RoadmapItem>

	<RoadmapItem title="PDF export" status="planned" />
</Roadmap>
```

## Status

Each status has its own color and label.

| Status        | Label       |
| ------------- | ----------- |
| `planned`     | Planned     |
| `exploring`   | Exploring   |
| `in-progress` | In progress |
| `shipped`     | Shipped     |

## Props

### RoadmapItem

| Prop     | Type     | Description                                         |
| -------- | -------- | --------------------------------------------------- |
| `title`  | `string` | The item name                                       |
| `status` | `string` | `planned`, `exploring`, `in-progress`, or `shipped` |
| `eta`    | `string` | Optional target, e.g. `Q3 2026`                     |
