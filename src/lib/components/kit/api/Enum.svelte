<script lang="ts">
	import type { Snippet } from 'svelte';

	let { value, children }: { value: string; children?: Snippet } = $props();
</script>

<div class="enum-item">
	<code class="enum-pill">{value}</code>
	{#if children}
		<div class="enum-desc">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.enum-item {
		padding: 0.6rem 0;
	}

	.enum-pill {
		display: inline-block;
		padding: 0.1rem 0.45rem;
		border: 1px solid var(--border);
		border-radius: 0.3rem;
		background-color: var(--surface);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--fg);
	}

	.enum-desc {
		margin-top: 0.35rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fg-muted);
	}
	.enum-desc :global(> :first-child) {
		margin-top: 0;
	}
	.enum-desc :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
