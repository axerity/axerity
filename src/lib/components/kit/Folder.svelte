<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import FolderClosed from '@lucide/svelte/icons/folder';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let {
		name,
		icon,
		defaultOpen = false,
		children
	}: { name: string; icon?: string; defaultOpen?: boolean; children?: Snippet } = $props();

	let isOpen = $state(untrack(() => defaultOpen));
</script>

<div class="tree-folder">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		class="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left transition hover:bg-surface-raised"
	>
		<ChevronRight
			size={14}
			class="shrink-0 text-fg-subtle transition-transform duration-150 {isOpen ? 'rotate-90' : ''}"
		/>
		{#if icon}
			<DynamicIcon name={icon} size={16} class="shrink-0 text-fg-muted" />
		{:else if isOpen}
			<FolderOpen size={16} class="shrink-0 text-fg-muted" />
		{:else}
			<FolderClosed size={16} class="shrink-0 text-fg-muted" />
		{/if}
		<span class="truncate">{name}</span>
	</button>

	{#if isOpen && children}
		<div transition:slide={{ duration: 150 }} class="ml-[0.6875rem] border-l border-border pl-2">
			{@render children()}
		</div>
	{/if}
</div>
