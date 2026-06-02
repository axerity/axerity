<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext, untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import { ACCORDION_GROUP } from './accordion-context';

	let {
		title,
		icon,
		open = false,
		children
	}: { title: string; icon?: string; open?: boolean; children: Snippet } = $props();

	// `open` is an uncontrolled initial value; toggling afterwards is internal.
	let isOpen = $state(untrack(() => open));

	const grouped = getContext(ACCORDION_GROUP) === true;

	// Standalone accordions are self-contained cards; grouped ones inherit the
	// group's border and dividers.
	const wrapperClass = grouped ? 'bg-surface' : 'my-5 rounded-xl border border-border bg-surface';
</script>

<div class={wrapperClass}>
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-fg transition hover:bg-bg-subtle"
	>
		{#if icon}
			<DynamicIcon name={icon} size={18} class="shrink-0 text-accent" />
		{/if}
		<span class="flex-1">{title}</span>
		<ChevronDown
			size={18}
			class="shrink-0 text-fg-subtle transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isOpen}
		<div transition:slide={{ duration: 200 }}>
			<div class="accordion-body px-4 pb-4 text-sm text-fg-muted">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Trim stray margins from markdown rendered inside the panel. */
	.accordion-body :global(> :first-child) {
		margin-top: 0;
	}
	.accordion-body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
