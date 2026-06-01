<script lang="ts">
	import { page } from '$app/state';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { NavLink } from '$lib/types';

	let { pages }: { pages: NavLink[] } = $props();

	const index = $derived(pages.findIndex((entry) => entry.href === page.url.pathname));
	const prev = $derived(index > 0 ? pages[index - 1] : undefined);
	const next = $derived(index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined);
</script>

{#if prev || next}
	<nav class="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2" aria-label="Pagination">
		{#if prev}
			<a
				href={prev.href}
				class="flex items-center gap-3 rounded-lg border border-border p-4 transition hover:border-border-strong hover:bg-bg-subtle"
			>
				<ChevronLeft size={18} class="shrink-0 text-fg-subtle" />
				<span class="min-w-0">
					<span class="block text-xs text-fg-subtle">Previous</span>
					<span class="block truncate text-sm font-medium text-fg">{prev.title}</span>
				</span>
			</a>
		{:else}
			<span class="hidden sm:block"></span>
		{/if}

		{#if next}
			<a
				href={next.href}
				class="flex items-center justify-end gap-3 rounded-lg border border-border p-4 text-right transition hover:border-border-strong hover:bg-bg-subtle"
			>
				<span class="min-w-0">
					<span class="block text-xs text-fg-subtle">Next</span>
					<span class="block truncate text-sm font-medium text-fg">{next.title}</span>
				</span>
				<ChevronRight size={18} class="shrink-0 text-fg-subtle" />
			</a>
		{/if}
	</nav>
{/if}
