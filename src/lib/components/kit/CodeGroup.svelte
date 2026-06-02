<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let container = $state<HTMLElement>();
	let tabs = $state<string[]>([]);
	let active = $state(0);

	let blocks: HTMLElement[] = [];
	let initialized = false;

	$effect(() => {
		if (!container || initialized) return;
		const found = Array.from(
			container.querySelectorAll('.cg-blocks > .code-block')
		) as HTMLElement[];
		if (!found.length) return;

		blocks = found;
		tabs = found.map((block, index) => {
			const title = block.querySelector('.code-title')?.textContent?.trim();
			block.querySelector('.code-header')?.classList.add('hidden');
			return title || `Tab ${index + 1}`;
		});
		select(0);
		initialized = true;
	});

	function select(index: number) {
		active = index;
		blocks.forEach((block, i) => block.classList.toggle('hidden', i !== index));
	}
</script>

<div class="code-group my-5 overflow-hidden rounded-lg border border-border" bind:this={container}>
	{#if tabs.length}
		<div class="cg-tabs flex items-center gap-1 border-b border-border bg-bg-subtle px-1.5 py-1.5">
			{#each tabs as tab, index (index)}
				<button
					type="button"
					onclick={() => select(index)}
					class="rounded-md px-2.5 py-1 font-mono text-xs transition
						{index === active ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'}"
				>
					{tab}
				</button>
			{/each}
		</div>
	{/if}
	<div class="cg-blocks">
		{@render children?.()}
	</div>
</div>

<style>
	.code-group :global(.code-block) {
		margin: 0;
		border-radius: 0;
	}
	.code-group :global(.code-block pre) {
		border: 0;
		border-radius: 0;
	}
</style>
