<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<kbd
	class="inline-flex min-w-5 items-center justify-center rounded border border-b-2 border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-xs text-fg-muted"
>
	{@render children()}
</kbd>
