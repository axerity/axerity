<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { withBase } from '$lib/base';

	let { name, href, children }: { name: string; href?: string; children?: Snippet } = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	href={href ? withBase(href) : undefined}
	class="event-item flex items-center gap-3 px-4 py-3 text-sm transition {href
		? 'hover:bg-bg-subtle'
		: ''}"
>
	<code class="shrink-0 font-mono text-fg">{name}</code>
	{#if children}
		<span class="min-w-0 flex-1 truncate text-fg-muted">{@render children()}</span>
	{/if}
	{#if href}
		<ArrowRight size={15} class="ml-auto shrink-0 text-fg-subtle" />
	{/if}
</svelte:element>
