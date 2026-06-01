<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';

	let {
		direction = 'receive',
		name,
		children
	}: {
		direction?: 'send' | 'receive' | 'publish' | 'subscribe';
		name?: string;
		children?: Snippet;
	} = $props();

	const isSend = $derived(direction === 'send' || direction === 'publish');
</script>

<div class="message">
	<div class="message-head" data-direction={isSend ? 'send' : 'receive'}>
		{#if isSend}
			<ArrowUp size={14} />
		{:else}
			<ArrowDown size={14} />
		{/if}
		<span class="message-label">{isSend ? 'Send' : 'Receive'}</span>
		{#if name}
			<code class="message-name">{name}</code>
		{/if}
	</div>
	{#if children}
		<div class="message-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.message {
		margin: 1.75rem 0 0;
	}
	.message-head {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: var(--radius-md);
		padding: 0.25rem 0.6rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--d);
		background-color: color-mix(in oklab, var(--d) 12%, transparent);
	}
	.message-head[data-direction='send'] {
		--d: oklch(0.6 0.16 250);
	}
	.message-head[data-direction='receive'] {
		--d: oklch(0.6 0.15 155);
	}
	.message-name {
		font-family: var(--font-mono);
		font-weight: 600;
		color: inherit;
	}
	.message-body :global(> :first-child) {
		margin-top: 0.75rem;
	}
</style>
