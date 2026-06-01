<script lang="ts">
	import { page } from '$app/state';
	import type { NavLink } from '$lib/types';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let { item, depth = 0 }: { item: NavLink; depth?: number } = $props();

	const active = $derived(page.url.pathname === item.href);
</script>

<a
	href={item.href}
	aria-current={active ? 'page' : undefined}
	style="padding-left: {0.75 + depth * 0.75}rem"
	class="group flex items-center gap-2.5 rounded-md py-1.5 pr-3 text-sm transition
		{active
		? 'bg-accent/10 font-medium text-accent'
		: 'text-fg-muted hover:bg-bg-subtle hover:text-fg'}"
>
	{#if item.method}
		<span class="method-badge" data-method={item.method.toUpperCase()}>
			{item.method.toUpperCase()}
		</span>
	{:else if item.icon}
		<DynamicIcon
			name={item.icon}
			size={16}
			class={active ? 'text-accent' : 'text-fg-subtle group-hover:text-fg-muted'}
		/>
	{/if}
	<span class="flex-1">{item.title}</span>
	{#if item.badge}
		<span
			class="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase"
		>
			{item.badge}
		</span>
	{/if}
</a>

<style>
	/* Color-coded HTTP method label, mirroring the <Endpoint> badge. */
	.method-badge {
		flex-shrink: 0;
		width: 2.75rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--m);
	}
	.method-badge[data-method='GET'] {
		--m: oklch(0.6 0.15 155);
	}
	.method-badge[data-method='POST'] {
		--m: oklch(0.6 0.16 250);
	}
	.method-badge[data-method='PUT'] {
		--m: oklch(0.68 0.15 75);
	}
	.method-badge[data-method='PATCH'] {
		--m: oklch(0.62 0.19 300);
	}
	.method-badge[data-method='DELETE'] {
		--m: oklch(0.62 0.21 25);
	}
</style>
