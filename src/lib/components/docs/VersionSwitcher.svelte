<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import type { Version } from '$lib/types';

	let { versions }: { versions: Version[] } = $props();

	let open = $state(false);

	const current = $derived(
		versions.find((version) => page.url.pathname.startsWith(version.href)) ?? versions[0]
	);
</script>

<div class="relative">
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		class="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
	>
		{current.label}
		<ChevronDown size={13} class="text-fg-subtle transition-transform {open ? 'rotate-180' : ''}" />
	</button>

	{#if open}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default"
			aria-label="Close versions"
			onclick={() => (open = false)}
		></button>
		<div
			class="absolute left-0 z-50 mt-1.5 w-36 overflow-hidden rounded-lg border border-border bg-surface-raised p-1 shadow-lg"
			transition:fade={{ duration: 100 }}
		>
			{#each versions as version (version.label)}
				<a
					href={version.href}
					onclick={() => (open = false)}
					class="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition hover:bg-bg-subtle
						{version === current ? 'text-fg' : 'text-fg-muted'}"
				>
					{version.label}
					{#if version === current}
						<Check size={14} class="text-fg-subtle" />
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
