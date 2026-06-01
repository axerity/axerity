<script lang="ts">
	import type { Snippet } from 'svelte';

	let { tip, children }: { tip: string; children: Snippet } = $props();
</script>

<span class="tooltip group relative inline-flex">
	<button type="button" class="tooltip-trigger" aria-label={tip}>
		{@render children()}
	</button>
	<span
		role="tooltip"
		class="tooltip-pop pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 scale-95 rounded-md bg-fg px-2.5 py-1.5 text-xs leading-snug font-medium text-surface opacity-0 shadow-md transition duration-150 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100"
	>
		{tip}
		<span
			class="tooltip-arrow absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-fg"
		></span>
	</span>
</span>

<style>
	.tooltip-trigger {
		cursor: help;
		text-decoration: underline dotted from-font;
		text-underline-offset: 0.2em;
	}
	.tooltip-trigger:focus-visible {
		outline: 2px solid var(--border-strong);
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
