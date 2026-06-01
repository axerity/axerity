<script lang="ts">
	import { page } from '$app/state';
	import { SvelteSet } from 'svelte/reactivity';
	import type { TocEntry } from '$lib/types';

	// Where to read headings from — the rendered markdown container.
	let { containerId = 'doc-content' }: { containerId?: string } = $props();

	let entries = $state<TocEntry[]>([]);
	let activeId = $state<string | null>(null);

	// Extract h2/h3 headings from the rendered content, re-running on navigation.
	$effect(() => {
		// Reading the pathname makes this effect re-run (re-extract) on navigation.
		const pathname = page.url.pathname;
		const container = document.getElementById(containerId);
		if (!container || !pathname) {
			entries = [];
			return;
		}
		const headings = container.querySelectorAll<HTMLElement>('h2[id], h3[id]');
		entries = Array.from(headings).map((h) => ({
			id: h.id,
			title: h.textContent?.trim() ?? '',
			depth: h.tagName === 'H3' ? 3 : 2
		}));
	});

	// Scroll-spy: highlight the heading nearest the top of the viewport.
	$effect(() => {
		if (entries.length === 0) return;

		const elements = entries
			.map((e) => document.getElementById(e.id))
			.filter((el): el is HTMLElement => el !== null);

		const visible = new SvelteSet<string>();
		const observer = new IntersectionObserver(
			(records) => {
				for (const record of records) {
					if (record.isIntersecting) visible.add(record.target.id);
					else visible.delete(record.target.id);
				}
				const firstVisible = entries.find((e) => visible.has(e.id));
				if (firstVisible) activeId = firstVisible.id;
			},
			{ rootMargin: '0px 0px -70% 0px', threshold: 0 }
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

{#if entries.length > 0}
	<nav class="flex flex-col gap-2 text-sm" aria-label="On this page">
		<p class="px-3 text-xs font-semibold tracking-wide text-fg-subtle uppercase">On this page</p>
		<ul class="flex flex-col gap-0.5">
			{#each entries as entry (entry.id)}
				{@const active = activeId === entry.id}
				<li>
					<a
						href="#{entry.id}"
						aria-current={active ? 'location' : undefined}
						class="block border-l-2 py-1 pr-3 transition
							{entry.depth === 3 ? 'pl-6' : 'pl-3'}
							{active
							? 'border-accent font-medium text-accent'
							: 'border-transparent text-fg-subtle hover:text-fg'}"
					>
						{entry.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
