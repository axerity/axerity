<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { theme } from '$lib/state/theme.svelte';
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition hover:border-border-strong hover:bg-bg-subtle hover:text-fg"
	aria-label="Toggle theme"
	title={theme.resolved === 'dark' ? 'Switch to light' : 'Switch to dark'}
>
	{#if theme.resolved === 'dark'}
		<Moon size={17} />
	{:else}
		<Sun size={17} />
	{/if}
</button>
