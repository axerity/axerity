<script lang="ts">
	import Markdown from '$lib/markdown/Markdown.svelte';
	import type { DocNode } from '$lib/markdown/types';

	let { path, nodes }: { path: string; nodes: DocNode[] } = $props();
</script>

{#key path}
	<Markdown {nodes} />
{/key}
