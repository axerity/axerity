<script lang="ts" module>
	import type { Component } from 'svelte';

	const modules = import.meta.glob('/node_modules/@lucide/svelte/dist/icons/*.svelte');

	const loaders: Record<string, () => Promise<{ default: Component }>> = {};
	for (const [path, loader] of Object.entries(modules)) {
		const name = path.slice(path.lastIndexOf('/') + 1).replace('.svelte', '');
		loaders[name] = loader as () => Promise<{ default: Component }>;
	}
</script>

<script lang="ts">
	let {
		name,
		size = 16,
		class: className = ''
	}: { name?: string; size?: number; class?: string } = $props();

	let Icon = $state<Component | null>(null);

	$effect(() => {
		const loader = name ? loaders[name] : undefined;
		if (!loader) {
			Icon = null;
			return;
		}
		let cancelled = false;
		loader().then((module) => {
			if (!cancelled) Icon = module.default;
		});
		return () => {
			cancelled = true;
		};
	});
</script>

{#if Icon}
	<Icon {size} class={className} />
{/if}
