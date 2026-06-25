<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { TocEntry } from '$lib/types';

	let { toc = [] }: { toc?: TocEntry[] } = $props();

	let activeId = $state<string | null>(null);

	$effect(() => {
		if (toc.length === 0) return;

		const elements = toc
			.map((e) => document.getElementById(e.id))
			.filter((el): el is HTMLElement => el !== null);

		const visible = new SvelteSet<string>();
		const observer = new IntersectionObserver(
			(records) => {
				for (const record of records) {
					if (record.isIntersecting) visible.add(record.target.id);
					else visible.delete(record.target.id);
				}
				const firstVisible = toc.find((e) => visible.has(e.id));
				if (firstVisible) activeId = firstVisible.id;
			},
			{ rootMargin: '0px 0px -70% 0px', threshold: 0 }
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

{#if toc.length > 0}
	<nav class="flex flex-col gap-2 text-sm" aria-label="On this page">
		<p class="px-3 text-xs font-semibold tracking-wide text-fg-subtle uppercase">On this page</p>
		<ul class="flex flex-col gap-0.5">
			{#each toc as entry (entry.id)}
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
