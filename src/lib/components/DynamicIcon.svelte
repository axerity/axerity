<script lang="ts" module>
	import type { Component } from 'svelte';

	const modules = import.meta.glob<{ default: Component }>(
		'/node_modules/@lucide/svelte/dist/icons/*.svelte',
		{ eager: true }
	);

	const registry: Record<string, Component> = {};
	for (const [path, mod] of Object.entries(modules)) {
		const name = path.slice(path.lastIndexOf('/') + 1).replace('.svelte', '');
		registry[name] = mod.default;
	}
</script>

<script lang="ts">
	let {
		name,
		size = 16,
		class: className = ''
	}: { name?: string; size?: number; class?: string } = $props();

	const Icon = $derived(name ? registry[name] : undefined);
</script>

{#if Icon}
	<Icon {size} class={className} />
{/if}
