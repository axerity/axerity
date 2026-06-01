<script lang="ts">
	import { page } from '$app/state';
	import type { Dropdown, NavEntry, NavSection, TopNavLink } from '$lib/types';
	import { activeFor } from '$lib/nav-match';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import SidebarLink from './SidebarLink.svelte';
	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarDropdown from './SidebarDropdown.svelte';

	let { sections, dropdowns }: { sections: NavSection[]; dropdowns?: Dropdown[] } = $props();

	const activeDropdown = $derived(
		dropdowns && dropdowns.length
			? (activeFor(page.url.pathname, dropdowns) ?? dropdowns[0])
			: undefined
	);

	const tabs = $derived(activeDropdown?.tabs ?? []);
	const activeTab = $derived(
		tabs.length ? (activeFor(page.url.pathname, tabs) ?? tabs[0]) : undefined
	);

	function firstHref(entries: NavEntry[]): string | undefined {
		for (const entry of entries) {
			const href = 'href' in entry ? entry.href : firstHref(entry.items);
			if (href) return href;
		}
		return undefined;
	}

	function pruneByTab(entries: NavEntry[], tabList: TopNavLink[], target: TopNavLink): NavEntry[] {
		const result: NavEntry[] = [];
		for (const entry of entries) {
			if ('href' in entry) {
				if (activeFor(entry.href, tabList) === target) result.push(entry);
			} else {
				const items = pruneByTab(entry.items, tabList, target);
				if (items.length) result.push({ ...entry, items });
			}
		}
		return result;
	}

	const visibleSections = $derived.by(() => {
		let result = sections;
		if (dropdowns && activeDropdown) {
			result = result.filter((section) => {
				const href = firstHref(section.items);
				return !href || activeFor(href, dropdowns) === activeDropdown;
			});
		}
		if (tabs.length && activeTab) {
			result = result
				.map((section) => ({ ...section, items: pruneByTab(section.items, tabs, activeTab) }))
				.filter((section) => section.items.length);
		}
		return result;
	});
</script>

<nav class="flex flex-col gap-6" aria-label="Documentation">
	{#if dropdowns && dropdowns.length && activeDropdown}
		<SidebarDropdown {dropdowns} active={activeDropdown} />
	{/if}

	{#each visibleSections as section (section.title)}
		<div class="flex flex-col gap-0.5">
			<h2
				class="mb-1 flex items-center gap-2 px-3 text-xs font-semibold tracking-wide text-fg-subtle uppercase"
			>
				{#if section.icon}
					<DynamicIcon name={section.icon} size={14} />
				{/if}
				{section.title}
			</h2>
			{#each section.items as entry ('href' in entry ? entry.href : entry.title)}
				{#if 'href' in entry}
					<SidebarLink item={entry} />
				{:else}
					<SidebarGroup group={entry} />
				{/if}
			{/each}
		</div>
	{/each}
</nav>
