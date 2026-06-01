<script lang="ts">
	import { getContext, onDestroy, untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import { TABS, type TabsContext } from './tabs-context';

	let { title, icon, children }: { title: string; icon?: string; children: Snippet } = $props();

	const tabs = getContext<TabsContext>(TABS);
	const id = untrack(() => tabs.register(title, icon));

	onDestroy(() => tabs.unregister(id));
</script>

{#if tabs.isActive(id)}
	<div role="tabpanel" class="tab-panel">
		{@render children()}
	</div>
{/if}

<style>
	.tab-panel :global(> :first-child) {
		margin-top: 0;
	}
	.tab-panel :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
