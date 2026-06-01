---
title: Video
description: Embed a YouTube video in a responsive player.
icon: play
---

<script>
	import { Video } from '$lib';
</script>

# Video

The `Video` component renders a responsive 16:9 player. It works with hosted
files and with the common providers, and picks the right player for whatever you
give it:

- A direct video file (`.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`) plays in the
  browser's native player.
- A YouTube link or id embeds through the privacy friendly `youtube-nocookie`
  host.
- A Vimeo link embeds through the Vimeo player.

## YouTube

<Video src="https://youtu.be/oRdxUFDoQe0" title="Michael Jackson - Beat It" />

A full watch link, a short `youtu.be` link, or a bare video id all work:

```svelte
<Video src="https://youtu.be/oRdxUFDoQe0" title="Michael Jackson - Beat It" />
<Video src="https://www.youtube.com/watch?v=oRdxUFDoQe0" />
<Video src="oRdxUFDoQe0" />
```

## Hosted file

Point `src` at a video file and it plays inline with native controls. Pass
`poster` for a still frame to show before playback:

```svelte
<Video src="/media/demo.mp4" poster="/media/demo-poster.jpg" title="Product demo" />
```

## Vimeo

```svelte
<Video src="https://vimeo.com/76979871" title="Vimeo example" />
```

## Props

| Prop     | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| `src`    | `string` | File URL, provider URL, or YouTube id (required) |
| `title`  | `string` | Label for screen readers (default `Video`)       |
| `poster` | `string` | Still frame for hosted files, shown before play  |
