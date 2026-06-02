<script lang="ts">
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Plus from '@lucide/svelte/icons/plus';
	import Minus from '@lucide/svelte/icons/minus';

	let {
		title = 'child attributes',
		open = false,
		children
	}: { title?: string; open?: boolean; children: Snippet } = $props();

	let isOpen = $state(untrack(() => open));
</script>

<div class="expandable">
	<button
		type="button"
		class="expandable-toggle"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
	>
		{#if isOpen}
			<Minus size={14} />
		{:else}
			<Plus size={14} />
		{/if}
		<span>{isOpen ? 'Hide' : 'Show'} {title}</span>
	</button>

	{#if isOpen}
		<div class="expandable-body" transition:slide={{ duration: 150 }}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.expandable {
		margin-top: 0.6rem;
	}

	.expandable-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.7rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background-color: var(--surface);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-muted);
		cursor: pointer;
		transition:
			color 0.12s,
			border-color 0.12s;
	}
	.expandable-toggle:hover {
		color: var(--fg);
		border-color: var(--border-strong);
	}

	.expandable-body {
		margin-top: 0.5rem;
		padding-left: 1rem;
		border-left: 1px solid var(--border);
	}
</style>
