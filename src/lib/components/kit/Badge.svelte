<script lang="ts">
	import type { Snippet } from 'svelte';

	type Color = 'neutral' | 'info' | 'success' | 'warn' | 'error';

	let { color = 'neutral', children }: { color?: Color; children: Snippet } = $props();

	const variants = {
		neutral: 'border-border bg-bg-subtle text-fg-muted',
		info: 'border-transparent bg-(--c)/15 text-(--c)',
		success: 'border-transparent bg-(--c)/15 text-(--c)',
		warn: 'border-transparent bg-(--c)/15 text-(--c)',
		error: 'border-transparent bg-(--c)/15 text-(--c)'
	} as const;

	const colors = {
		neutral: 'var(--fg-muted)',
		info: 'oklch(0.62 0.2 250)',
		success: 'oklch(0.6 0.16 155)',
		warn: 'oklch(0.7 0.16 75)',
		error: 'oklch(0.62 0.22 25)'
	} as const;
</script>

<span
	class="inline-flex items-center rounded-full border px-2 py-0.5 align-middle text-xs font-medium {variants[
		color
	]}"
	style="--c: {colors[color]};"
>
	{@render children?.()}
</span>
