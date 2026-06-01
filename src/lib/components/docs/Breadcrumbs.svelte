<script lang="ts">
	import { page } from '$app/state';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { NavEntry, NavSection } from '$lib/types';

	let { sidebar }: { sidebar: NavSection[] } = $props();

	function findTrail(entries: NavEntry[], acc: string[], path: string): string[] | null {
		for (const entry of entries) {
			if ('href' in entry) {
				if (entry.href === path) return [...acc, entry.title];
			} else {
				const nested = findTrail(entry.items, [...acc, entry.title], path);
				if (nested) return nested;
			}
		}
		return null;
	}

	const trail = $derived.by(() => {
		for (const section of sidebar) {
			const found = findTrail(section.items, [section.title], page.url.pathname);
			if (found) return found;
		}
		return [];
	});
</script>

{#if trail.length > 1}
	<nav class="flex min-w-0 items-center gap-1.5 text-xs text-fg-subtle" aria-label="Breadcrumb">
		{#each trail as crumb, index (index)}
			{#if index > 0}
				<ChevronRight size={12} class="shrink-0" />
			{/if}
			<span class="truncate {index === trail.length - 1 ? 'text-fg-muted' : ''}">{crumb}</span>
		{/each}
	</nav>
{/if}
