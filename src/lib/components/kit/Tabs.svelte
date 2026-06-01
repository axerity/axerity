<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { TABS, type TabsContext } from './tabs-context';
	import { tabGroups } from './tabs-store.svelte';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let { group, children }: { group?: string; children: Snippet } = $props();

	interface TabMeta {
		id: number;
		title: string;
		icon?: string;
	}

	const tabs = $state<TabMeta[]>([]);
	let localValue = $state<string | undefined>(undefined);
	let counter = 0;

	$effect(() => {
		if (group) tabGroups.init(group);
	});

	const activeValue = $derived(group ? tabGroups.get(group) : localValue);

	const activeId = $derived.by(() => {
		const match = activeValue !== undefined ? tabs.find((t) => t.title === activeValue) : undefined;
		return match?.id ?? tabs[0]?.id;
	});

	function select(title: string) {
		if (group) tabGroups.set(group, title);
		else localValue = title;
	}

	setContext<TabsContext>(TABS, {
		register(title, icon) {
			const id = counter++;
			tabs.push({ id, title, icon });
			return id;
		},
		unregister(id) {
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index !== -1) tabs.splice(index, 1);
		},
		isActive: (id) => activeId === id
	});
</script>

<div class="my-5 flex flex-col overflow-hidden rounded-xl border border-border">
	<div class="order-2 p-4">
		{@render children()}
	</div>

	<div
		role="tablist"
		class="order-1 flex gap-1 overflow-x-auto border-b border-border bg-bg-subtle px-2"
	>
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				role="tab"
				aria-selected={activeId === tab.id}
				onclick={() => select(tab.title)}
				class="-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition
					{activeId === tab.id ? 'border-accent text-fg' : 'border-transparent text-fg-muted hover:text-fg'}"
			>
				{#if tab.icon}
					<DynamicIcon name={tab.icon} size={15} />
				{/if}
				{tab.title}
			</button>
		{/each}
	</div>
</div>
