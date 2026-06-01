<script lang="ts">
	import type { Snippet } from 'svelte';

	let { label, date, children }: { label: string; date?: string; children: Snippet } = $props();
</script>

<div class="update relative border-l border-border pb-8 pl-6">
	<span class="update-dot absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-border-strong"
	></span>
	<div class="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
		<h3 class="m-0 text-base font-semibold text-fg">{label}</h3>
		{#if date}
			<span class="text-xs text-fg-subtle">{date}</span>
		{/if}
	</div>
	<div class="update-body text-sm text-fg-muted">
		{@render children()}
	</div>
</div>

<style>
	.update:last-child {
		border-color: transparent;
		padding-bottom: 0;
	}
	.update-body :global(> :first-child) {
		margin-top: 0;
	}
	.update-body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
