---
title: Steps
description: Numbered, vertical walkthroughs.
icon: list
---

<script>
	import { Steps, Step } from '$lib';
</script>

# Steps

Steps lay out a sequence of instructions as a numbered, vertical walkthrough.
Numbering is automatic.

## Example

<Steps>
	<Step title="Install">

Add Axerity to your project:

```bash
pnpm add axerity
```

    </Step>
    <Step title="Create a page">

Drop a Markdown file into `src/content/docs`.

    </Step>
    <Step title="Run it">

Start the dev server with `pnpm dev` and open the page.

    </Step>

</Steps>

## Usage

Wrap `Step`s in `Steps`. Each `Step` takes an optional `title`. Keep the blank
lines around content so the Markdown is parsed:

````md
<script>
	import { Steps, Step } from '$lib';
</script>

<Steps>
	<Step title="Install">

    ```bash
    pnpm add axerity
    ```

    </Step>
    <Step title="Run it">

    Start the dev server.

    </Step>

</Steps>
````

## Props

| Component | Prop    | Description             |
| --------- | ------- | ----------------------- |
| `Step`    | `title` | Step heading (optional) |
