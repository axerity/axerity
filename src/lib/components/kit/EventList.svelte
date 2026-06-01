<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="event-list my-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
	{@render children()}
</div>
