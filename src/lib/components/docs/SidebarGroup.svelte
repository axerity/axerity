<script lang="ts">
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { NavEntry, NavGroup } from '$lib/types';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import SidebarLink from './SidebarLink.svelte';
	import Self from './SidebarGroup.svelte';

	let {
		group,
		depth = 0,
		defaultOpen = false
	}: { group: NavGroup; depth?: number; defaultOpen?: boolean } = $props();

	function containsActive(items: NavEntry[], path: string): boolean {
		return items.some((entry) =>
			'href' in entry ? entry.href === path : containsActive(entry.items, path)
		);
	}

	// Open when the group (or the site default) sets `defaultOpen`, or when a
	// descendant is the current page (so the active page is never hidden).
	let open = $state(
		untrack(
			() =>
				(group.defaultOpen ?? defaultOpen) === true ||
				containsActive(group.items, page.url.pathname)
		)
	);

	const key = (entry: NavEntry) => ('href' in entry ? entry.href : entry.title);
</script>

<div>
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		style="padding-left: {0.75 + depth * 0.75}rem"
		class="group flex w-full items-center gap-2.5 rounded-md py-1.5 pr-3 text-sm font-medium text-fg-muted transition hover:bg-bg-subtle hover:text-fg"
	>
		{#if group.icon}
			<DynamicIcon name={group.icon} size={16} class="text-fg-subtle" />
		{/if}
		<span class="flex-1 text-left">{group.title}</span>
		<ChevronRight size={14} class="text-fg-subtle transition-transform {open ? 'rotate-90' : ''}" />
	</button>

	{#if open}
		<div transition:slide={{ duration: 150 }} class="mt-0.5 flex flex-col gap-0.5">
			{#each group.items as entry (key(entry))}
				{#if 'href' in entry}
					<SidebarLink item={entry} depth={depth + 1} />
				{:else}
					<Self group={entry} depth={depth + 1} {defaultOpen} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
