<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="tree my-5 overflow-hidden rounded-lg border border-border bg-surface p-2 font-mono text-sm text-fg"
>
	{@render children?.()}
</div>
