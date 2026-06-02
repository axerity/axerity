<script lang="ts">
	import type { Snippet } from 'svelte';

	let { cols = 2, children }: { cols?: number; children: Snippet } = $props();
</script>

<div class="card-group my-5 grid gap-3" style="--cols: {cols};">
	{@render children?.()}
</div>

<style>
	.card-group {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	@media (min-width: 640px) {
		.card-group {
			grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		}
	}
</style>
