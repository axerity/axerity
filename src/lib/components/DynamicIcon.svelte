<script lang="ts" module>
	import { icons } from 'lucide';

	type IconNode = [string, Record<string, string | number>][];
	const registry = icons as unknown as Record<string, IconNode>;

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

	const node = $derived(name ? registry[pascal(name)] : undefined);
</script>

{#if node}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={`lucide ${className}`}
	>
		{#each node as [tag, attrs], i (i)}
			<svelte:element this={tag} {...attrs} />
		{/each}
	</svg>
{/if}
