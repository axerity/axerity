<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="roadmap">
	{@render children?.()}
</div>

<style>
	.roadmap {
		margin: 1.5rem 0;
	}
</style>
