<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';

	let {
		caption,
		zoom = true,
		children
	}: { caption?: string; zoom?: boolean; children: Snippet } = $props();

	let open = $state(false);

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window {onkeydown} />

<figure class="frame my-6">
	{#if zoom}
		<button
			type="button"
			onclick={() => (open = true)}
			class="frame-inner flex w-full cursor-zoom-in justify-center rounded-xl border border-border bg-surface-raised p-4 transition hover:border-border-strong"
		>
			{@render children()}
		</button>
	{:else}
		<div
			class="frame-inner flex justify-center rounded-xl border border-border bg-surface-raised p-4"
		>
			{@render children()}
		</div>
	{/if}
	{#if caption}
		<figcaption class="mt-2.5 text-center text-sm text-fg-subtle">{caption}</figcaption>
	{/if}
</figure>

{#if open}
	<button
		type="button"
		onclick={() => (open = false)}
		aria-label="Close expanded view"
		class="frame-overlay fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<span class="frame-overlay-inner block max-h-full max-w-5xl" transition:scale={{ start: 0.96 }}>
			{@render children()}
		</span>
	</button>
{/if}

<style>
	.frame-inner :global(img),
	.frame-inner :global(video) {
		margin: 0;
		border-radius: 0.5rem;
		max-width: 100%;
		height: auto;
	}
	.frame-overlay-inner :global(img),
	.frame-overlay-inner :global(video) {
		margin: 0;
		border-radius: 0.5rem;
		max-height: 85vh;
		max-width: 100%;
		width: auto;
		height: auto;
	}
</style>
