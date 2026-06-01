<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let { name, icon }: { name: string; icon?: string } = $props();
</script>

<div class="tree-file flex items-center gap-1.5 rounded-md py-1 pr-1.5 pl-[1.625rem] text-fg-muted">
	{#if icon}
		<DynamicIcon name={icon} size={16} class="shrink-0 text-fg-subtle" />
	{:else}
		<FileIcon size={16} class="shrink-0 text-fg-subtle" />
	{/if}
	<span class="truncate">{name}</span>
</div>
