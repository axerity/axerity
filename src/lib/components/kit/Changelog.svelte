<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { CHANGELOG, type ChangelogContext } from './changelog-context';

	let { children }: { children: Snippet } = $props();

	interface Entry {
		id: number;
		tags: string[];
	}

	const entries = $state<Entry[]>([]);
	let counter = 0;
	let active = $state<string | null>(null);

	const allTags = $derived.by(() => {
		const list: string[] = [];
		for (const entry of entries)
			for (const tag of entry.tags) if (!list.includes(tag)) list.push(tag);
		return list.sort((a, b) => a.localeCompare(b));
	});

	setContext<ChangelogContext>(CHANGELOG, {
		register(tags) {
			const id = counter++;
			entries.push({ id, tags });
			return id;
		},
		unregister(id) {
			const index = entries.findIndex((entry) => entry?.id === id);
			if (index !== -1) entries.splice(index, 1);
		},
		isVisible: (tags) => !active || tags.includes(active)
	});
</script>

{#if allTags.length}
	<div class="changelog-filters">
		<button type="button" class:active={!active} onclick={() => (active = null)}>All</button>
		{#each allTags as tag (tag)}
			<button
				type="button"
				class:active={active === tag}
				onclick={() => (active = active === tag ? null : tag)}
			>
				{tag}
			</button>
		{/each}
	</div>
{/if}

<div>
	{@render children?.()}
</div>

<style>
	.changelog-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
	.changelog-filters button {
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1.2;
		padding: 0.3125rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid var(--border);
		color: var(--fg-muted);
		background: var(--bg);
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s,
			background 0.15s;
	}
	.changelog-filters button:hover {
		color: var(--fg);
		border-color: var(--border-strong);
	}
	.changelog-filters button.active {
		color: var(--accent-contrast);
		background: var(--accent);
		border-color: var(--accent);
	}
</style>
