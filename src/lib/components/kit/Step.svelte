<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title?: string; children: Snippet } = $props();
</script>

<div class="step">
	{#if title}
		<div class="step-title">{title}</div>
	{/if}
	<div class="step-body">
		{@render children()}
	</div>
</div>

<style>
	.step {
		position: relative;
		margin-left: 0.85rem;
		padding-left: 2.25rem;
		padding-bottom: 1.5rem;
		border-left: 2px solid var(--border);
	}

	.step:last-child {
		border-left-color: transparent;
		padding-bottom: 0;
	}

	.step::before {
		counter-increment: axerity-step;
		content: counter(axerity-step);
		position: absolute;
		top: -0.2rem;
		left: 0;
		transform: translateX(-50%);
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		border-radius: 9999px;
		background-color: var(--surface-raised);
		border: 1px solid var(--border-strong);
		color: var(--fg);
		font-size: 0.8rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.step-title {
		margin-bottom: 0.5rem;
		font-weight: 600;
		line-height: 1.7rem;
		color: var(--fg);
	}

	.step-body :global(> :first-child) {
		margin-top: 0;
	}
	.step-body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
