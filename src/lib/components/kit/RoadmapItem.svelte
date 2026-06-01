<script lang="ts">
	import type { Snippet } from 'svelte';

	type Status = 'planned' | 'exploring' | 'in-progress' | 'shipped';

	let {
		title,
		status = 'planned',
		eta,
		children
	}: {
		title: string;
		status?: Status;
		eta?: string;
		children?: Snippet;
	} = $props();

	const meta = {
		planned: { label: 'Planned', color: 'var(--fg-subtle)' },
		exploring: { label: 'Exploring', color: 'oklch(0.62 0.2 295)' },
		'in-progress': { label: 'In progress', color: 'oklch(0.7 0.16 75)' },
		shipped: { label: 'Shipped', color: 'oklch(0.6 0.16 155)' }
	} as const;

	const current = $derived(meta[status] ?? meta.planned);
</script>

<div class="item" style="--c: {current.color};">
	<span class="dot" aria-hidden="true"></span>
	<div class="content">
		<div class="head">
			<span class="title">{title}</span>
			<span class="status">{current.label}</span>
			{#if eta}
				<span class="eta">· {eta}</span>
			{/if}
		</div>
		{#if children}
			<div class="body">
				{@render children()}
			</div>
		{/if}
	</div>
</div>

<style>
	.item {
		display: flex;
		gap: 0.875rem;
		padding-bottom: 1.5rem;
	}
	.item:last-child {
		padding-bottom: 0;
	}
	.dot {
		position: relative;
		margin-top: 0.35rem;
		height: 0.5rem;
		width: 0.5rem;
		flex-shrink: 0;
		border-radius: 9999px;
		background-color: var(--c);
	}
	.item:not(:last-child) .dot::after {
		content: '';
		position: absolute;
		top: 0.9rem;
		left: 50%;
		height: calc(100% + 1.5rem);
		width: 1px;
		transform: translateX(-50%);
		background-color: var(--border);
	}
	.content {
		min-width: 0;
		flex: 1;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.5rem;
	}
	.title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--fg);
	}
	.status {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--c);
	}
	.eta {
		font-size: 0.8rem;
		color: var(--fg-subtle);
	}
	.body {
		margin-top: 0.2rem;
		font-size: 0.875rem;
		color: var(--fg-muted);
	}
	.body :global(> :first-child) {
		margin-top: 0;
	}
	.body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
