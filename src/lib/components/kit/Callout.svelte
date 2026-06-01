<script lang="ts">
	import type { Snippet } from 'svelte';

	import Info from '@lucide/svelte/icons/info';
	import Lightbulb from '@lucide/svelte/icons/lightbulb';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import CircleX from '@lucide/svelte/icons/circle-x';

	type CalloutType = 'info' | 'tip' | 'success' | 'warn' | 'warning' | 'error';

	let {
		type = 'info',
		title,
		children
	}: { type?: CalloutType; title?: string; children: Snippet } = $props();

	const variants = {
		info: { icon: Info, color: 'var(--fg-muted)' },
		tip: { icon: Lightbulb, color: 'oklch(0.62 0.2 300)' },
		success: { icon: CircleCheck, color: 'oklch(0.6 0.16 155)' },
		warn: { icon: TriangleAlert, color: 'oklch(0.7 0.16 75)' },
		error: { icon: CircleX, color: 'oklch(0.62 0.22 25)' }
	} as const;

	const variant = $derived(variants[type === 'warning' ? 'warn' : type]);
	const Icon = $derived(variant.icon);
</script>

<div
	class="callout my-5 flex gap-2.5 rounded-lg border border-(--c)/25 bg-(--c)/[0.07] px-4 py-3"
	style="--c: {variant.color};"
	role="note"
>
	<Icon size={18} class="mt-0.5 shrink-0 text-(--c)" />
	<div class="callout-body min-w-0 flex-1 text-sm leading-relaxed text-(--c)">
		{#if title}
			<p class="mb-0.5 font-semibold">{title}</p>
		{/if}
		{@render children()}
	</div>
</div>

<style>
	.callout-body :global(> :first-child) {
		margin-top: 0;
	}
	.callout-body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
