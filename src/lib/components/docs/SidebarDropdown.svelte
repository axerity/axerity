<script lang="ts">
	import { fade } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import type { Dropdown } from '$lib/types';

	let { dropdowns, active }: { dropdowns: Dropdown[]; active: Dropdown } = $props();

	let open = $state(false);
</script>

<div class="relative mb-5">
	<button
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		class="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-fg transition hover:border-border-strong"
	>
		{#if active.icon}
			<DynamicIcon name={active.icon} size={16} class="text-fg-muted" />
		{/if}
		<span class="flex-1 text-left">{active.label}</span>
		<ChevronDown size={15} class="text-fg-subtle transition-transform {open ? 'rotate-180' : ''}" />
	</button>

	{#if open}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default"
			aria-label="Close"
			onclick={() => (open = false)}
		></button>
		<div
			class="absolute right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-surface-raised p-1 shadow-lg"
			transition:fade={{ duration: 100 }}
		>
			{#each dropdowns as dropdown (dropdown.label)}
				<a
					href={dropdown.href}
					onclick={() => (open = false)}
					class="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition hover:bg-bg-subtle
						{dropdown === active ? 'font-medium text-fg' : 'text-fg-muted'}"
				>
					{#if dropdown.icon}
						<DynamicIcon name={dropdown.icon} size={16} />
					{/if}
					<span class="flex-1">{dropdown.label}</span>
					{#if dropdown === active}
						<Check size={15} class="text-fg-subtle" />
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
