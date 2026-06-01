<script lang="ts" module>
	const VOID = new Set([
		'area',
		'base',
		'br',
		'col',
		'embed',
		'hr',
		'img',
		'input',
		'link',
		'meta',
		'param',
		'source',
		'track',
		'wbr'
	]);
</script>

<script lang="ts">
	import type { DocNode } from './types';
	import { registry } from './registry';
	import Self from './Markdown.svelte';

	let { nodes }: { nodes: DocNode[] } = $props();
</script>

{#each nodes as node, i (i)}
	{#if node.type === 'text'}
		{node.value}
	{:else if node.type === 'raw' || node.type === 'code'}
		{@html node.html}
	{:else if node.type === 'element'}
		{#if VOID.has(node.tag)}
			<svelte:element this={node.tag} {...node.props} />
		{:else}
			<svelte:element this={node.tag} {...node.props}>
				<Self nodes={node.children} />
			</svelte:element>
		{/if}
	{:else if node.type === 'component'}
		{@const Comp = registry[node.name]}
		{#if Comp}
			{#if node.children.length}
				<Comp {...node.props}>
					<Self nodes={node.children} />
				</Comp>
			{:else}
				<Comp {...node.props} />
			{/if}
		{/if}
	{/if}
{/each}
