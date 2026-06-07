---
title: Update
description: A timeline entry for changelogs and release notes.
icon: history
date: 2026-06-01
---

<script>
	import { Update, Changelog, Badge } from '$lib';
</script>

# Update

Use the `Update` component to display changelog entries, version updates, and
release notes with consistent formatting. Each entry has a label rail on the
left and its content on the right. Stack several to build a changelog.

Give an entry a `title` and it becomes the heading at the top of the entry and
the one line that entry contributes to the table of contents. Headings inside an
entry stay out of the page outline, so the contents list the updates themselves
rather than every heading within them.

## Example

<Changelog>

<Update label="2026-06-01" title="Plan changes, proration & analytics" description="v1.1.0" tags={["Feature"]}>

You can add anything here, like a screenshot, a code snippet, or a list of
changes. <Badge color="success">new</Badge>

### Highlights

- Responsive two-column layout.
- An anchor for each update.
- A generated RSS feed entry for each update.

</Update>

<Update label="2026-05-20" title="Narrow-screen rendering fix" description="v1.0.1" tags={["Fix"]}>

Patched a rendering bug on narrow screens.

</Update>

<Update label="2026-05-01" title="First stable release" description="v1.0.0" tags={["Release"]}>

The first stable release.

</Update>

</Changelog>

## Usage

```svelte
<script>
	import { Update } from '$lib';
</script>

<Update
	label="2026-06-01"
	title="Plan changes, proration & analytics"
	description="v1.1.0"
	tags={['Feature']}
>
	This is an update with a label, title, description, and tag.
</Update>
```

The `title` is what the table of contents shows for this entry. Leave it off and
the contents fall back to the `label`.

Add a `date` to the page frontmatter and each update becomes its own entry in
the RSS feed, linked to its anchor.

## Filtering by tag

Wrap your updates in a `Changelog` to collect every tag into a filter bar at the
top. Readers click a tag to show only the updates that carry it, and the tags
are sorted automatically. Without the wrapper, updates render on their own and
no filter bar appears.

```svelte
<script>
	import { Update, Changelog } from '$lib';
</script>

<Changelog>
	<Update label="2026-06-01" tags={['Feature']}>A new feature.</Update>
	<Update label="2026-05-20" tags={['Fix']}>A small fix.</Update>
</Changelog>
```

## Props

`Update`:

| Prop          | Type       | Description                                                |
| ------------- | ---------- | ---------------------------------------------------------- |
| `label`       | `string`   | The label on the rail, usually a date or version. Required |
| `title`       | `string`   | A heading at the top of the entry, and its line in the toc |
| `description` | `string`   | A secondary line under the label, such as a version        |
| `date`        | `string`   | An optional date shown under the label                     |
| `tags`        | `string[]` | Short pills shown under the label, and the filter values   |

The entry's anchor comes from its `title`, or the `label` when there is no
title, so the table of contents and the RSS feed link straight to it.
`Changelog` takes no props; it reads the tags from the updates inside it.
