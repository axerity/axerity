<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="steps">
	{@render children()}
</div>

<style>
	.steps {
		counter-reset: axerity-step;
		margin: 1.5rem 0;
	}
</style>
