<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { ACCORDION_GROUP } from './accordion-context';

	let { children }: { children: Snippet } = $props();

	setContext(ACCORDION_GROUP, true);
</script>

<div class="my-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
	{@render children?.()}
</div>
