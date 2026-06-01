---
title: File tree
description: Show a folder and file layout the way it looks on disk.
icon: folder-tree
---

<script>
	import { Tree, Folder, File } from '$lib';
</script>

# File tree

A file tree shows how files and folders are arranged. Use it to point readers to
the right place in a project without making them guess.

## Example

<Tree>
	<Folder name="src" defaultOpen>
		<Folder name="content">
			<Folder name="docs">
				<File name="index.md" />
				<File name="installation.md" />
			</Folder>
		</Folder>
		<Folder name="lib">
			<File name="index.ts" />
		</Folder>
		<File name="app.html" />
	</Folder>
	<File name="axerity.json" />
	<File name="package.json" />
</Tree>

Click a folder to open or close it. Pass `defaultOpen` to a folder to show its
contents on load.

## Usage

```svelte
<script>
	import { Tree, Folder, File } from '$lib';
</script>

<Tree>
	<Folder name="src" defaultOpen>
		<Folder name="content">
			<File name="index.md" />
		</Folder>
		<File name="app.html" />
	</Folder>
	<File name="package.json" />
</Tree>
```

## Custom icons

By default folders use a folder glyph and files use a file glyph. Pass `icon`
with any Lucide name to override either one.

<Tree>
	<Folder name="images" icon="image" defaultOpen>
		<File name="logo.svg" icon="file-image" />
	</Folder>
	<File name="README.md" icon="book-open" />
</Tree>

## Props

### Folder

| Prop          | Type      | Description            |
| ------------- | --------- | ---------------------- |
| `name`        | `string`  | Folder name (required) |
| `icon`        | `string`  | Lucide icon name       |
| `defaultOpen` | `boolean` | Expand on load         |

### File

| Prop   | Type     | Description          |
| ------ | -------- | -------------------- |
| `name` | `string` | File name (required) |
| `icon` | `string` | Lucide icon name     |
