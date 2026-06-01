<script lang="ts">
	import type { Snippet } from 'svelte';

	let { cols = 2, children }: { cols?: number; children: Snippet } = $props();
</script>

<div class="columns-grid" style="--cols: {cols};">
	{@render children()}
</div>

<style>
	.columns-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
		margin: 1.25rem 0;
	}
	@media (min-width: 640px) {
		.columns-grid {
			grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		}
	}
	.columns-grid :global(> *) {
		margin: 0;
	}
</style>
