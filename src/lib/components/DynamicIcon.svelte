<script lang="ts" module>
	import type { Component } from 'svelte';
	import * as icons from '@lucide/svelte';

	const registry = icons as unknown as Record<string, Component>;

	const pascal = (name: string) =>
		name
			.split(/[-_]/)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
</script>

<script lang="ts">
	let {
		name,
		size = 16,
		class: className = ''
	}: { name?: string; size?: number; class?: string } = $props();

	const Icon = $derived(name ? registry[pascal(name)] : undefined);
</script>

{#if Icon}
	<Icon {size} class={className} />
{/if}
