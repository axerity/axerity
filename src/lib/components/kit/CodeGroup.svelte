<script lang="ts">
	import type { Snippet } from 'svelte';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { codeGroups } from './code-group-store.svelte';

	let { children }: { children: Snippet } = $props();

	let container = $state<HTMLElement>();
	let tabs = $state<string[]>([]);
	let localActive = $state(0);
	let copied = $state(false);

	let blocks: HTMLElement[] = [];

	const active = $derived.by(() => {
		const preferred = codeGroups.get();
		if (preferred) {
			const match = tabs.indexOf(preferred);
			if (match !== -1) return match;
		}
		return localActive;
	});

	$effect(() => {
		codeGroups.init();
		if (!container || tabs.length) return;
		const found = Array.from(
			container.querySelectorAll('.cg-blocks > .code-block')
		) as HTMLElement[];
		if (!found.length) return;

		blocks = found;
		tabs = found.map((block, index) => {
			const title = block.querySelector('.code-title')?.textContent?.trim();
			return title || `Tab ${index + 1}`;
		});
	});

	$effect(() => {
		const current = active;
		if (!tabs.length) return;
		blocks.forEach((block, index) => block.classList.toggle('hidden', index !== current));
	});

	function select(index: number) {
		localActive = index;
		codeGroups.set(tabs[index]);
	}

	async function copyActive() {
		const pre = blocks[active]?.querySelector('pre');
		const lines = pre?.querySelectorAll('.line');
		const code =
			lines && lines.length
				? Array.from(lines)
						.map((line) => line.textContent)
						.join('\n')
				: (pre?.textContent ?? '');
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
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
			<button
				type="button"
				onclick={copyActive}
				aria-label="Copy code"
				class="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition hover:bg-surface hover:text-fg"
			>
				{#if copied}
					<Check size={14} />
				{:else}
					<Copy size={14} />
				{/if}
			</button>
		</div>
	{/if}
	<div class="cg-blocks">
		{@render children?.()}
	</div>
</div>

<style>
	.code-group :global(.code-block) {
		margin: 0;
	}
	.code-group :global(.code-header) {
		display: none;
	}
	.code-group :global(.code-block pre) {
		margin: 0;
		border: 0;
		border-radius: 0;
	}
</style>
