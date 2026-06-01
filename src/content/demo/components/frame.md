---
title: Frame
description: Wrap an image, video, or component in a styled border with a caption.
icon: image
---

<script>
	import { Frame } from '$lib';
</script>

# Frame

A frame puts a soft border and padding around whatever you place inside it, so a
screenshot or diagram sits apart from the surrounding text instead of bleeding
into it. Add a caption to label what the reader is looking at.

Click a frame to open it full screen, then click anywhere or press `Escape` to
close. Pass `zoom={false}` to turn that off.

## With a caption

<Frame caption="The dashboard after a fresh install">
	<img src="https://placehold.co/720x360/png" alt="Dashboard screenshot" />
</Frame>

## Without a caption

<Frame>
	<img src="https://placehold.co/720x240/png" alt="A wide banner" />
</Frame>

## Usage

Frame works with any content, an image, a video, or another component:

```svelte
<script>
	import { Frame } from '$lib';
</script>

<Frame caption="The dashboard after a fresh install">
	<img src="/screenshots/dashboard.png" alt="Dashboard" />
</Frame>
```

## Props

| Prop      | Type      | Description                            |
| --------- | --------- | -------------------------------------- |
| `caption` | `string`  | Text shown below the framed content    |
| `zoom`    | `boolean` | Click to open full screen (default on) |
