<script lang="ts">
	import { getContext, onDestroy, untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import { CHANGELOG, type ChangelogContext } from './changelog-context';

	let {
		label,
		description,
		date,
		tags = [],
		anchor,
		children
	}: {
		label: string;
		description?: string;
		date?: string;
		tags?: string[];
		anchor?: string;
		children: Snippet;
	} = $props();

	const changelog = getContext<ChangelogContext | undefined>(CHANGELOG);
	if (changelog) {
		const id = untrack(() => changelog.register(tags));
		onDestroy(() => changelog.unregister(id));
	}

	const visible = $derived(changelog ? changelog.isVisible(tags) : true);
</script>

{#if visible}
	<div class="update" id={anchor || undefined}>
		<div class="update-meta">
			{#if anchor}
				<a class="update-label" href={`#${anchor}`}>{label}</a>
			{:else}
				<span class="update-label">{label}</span>
			{/if}
			{#if description}
				<div class="update-desc">{description}</div>
			{/if}
			{#if date}
				<div class="update-date">{date}</div>
			{/if}
			{#if tags?.length}
				<div class="update-tags">
					{#each tags as tag (tag)}
						<span class="update-tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
		<div class="update-body">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.update {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		gap: 2rem;
	}
	.update-meta {
		position: sticky;
		top: 6rem;
		align-self: start;
		padding-top: 0.125rem;
	}
	.update-label {
		display: inline-block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--accent);
		text-decoration: none;
	}
	.update-label:hover {
		text-decoration: underline;
	}
	.update-desc {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--fg);
	}
	.update-date {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--fg-subtle);
	}
	.update-tags {
		margin-top: 0.625rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.update-tag {
		font-size: 0.6875rem;
		font-weight: 500;
		line-height: 1.2;
		padding: 0.1875rem 0.5rem;
		border-radius: 9999px;
		border: 1px solid var(--border);
		color: var(--fg-muted);
		background: var(--bg-subtle);
	}
	.update-body {
		position: relative;
		border-left: 1px solid var(--border);
		padding-left: 2rem;
		padding-bottom: 3rem;
	}
	.update-body::before {
		content: '';
		position: absolute;
		left: -0.3125rem;
		top: 0.45rem;
		width: 0.5625rem;
		height: 0.5625rem;
		border-radius: 9999px;
		background: var(--border-strong);
		box-shadow: 0 0 0 0.25rem var(--bg);
	}
	.update:last-child .update-body {
		border-color: transparent;
		padding-bottom: 0;
	}
	.update-body :global(> :first-child) {
		margin-top: 0;
	}
	.update-body :global(> :last-child) {
		margin-bottom: 0;
	}

	@media (max-width: 640px) {
		.update {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.75rem;
		}
		.update-meta {
			position: static;
		}
		.update-body {
			border-left: none;
			padding-left: 0;
			padding-bottom: 2rem;
		}
		.update-body::before {
			display: none;
		}
	}
</style>
