<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import { withBase } from '$lib/base';

	let {
		title,
		icon,
		href,
		horizontal = false,
		children
	}: {
		title: string;
		icon?: string;
		href?: string;
		horizontal?: boolean;
		children?: Snippet;
	} = $props();

	const isLink = $derived(!!href);
	const external = $derived(!!href && /^https?:\/\//.test(href));
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	href={withBase(href) || undefined}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
	class="card-root group block rounded-lg border border-border bg-surface p-4 transition
		{isLink ? 'hover:border-border-strong hover:bg-bg-subtle' : ''}
		{horizontal ? 'flex items-start gap-3.5' : ''}"
>
	{#if icon}
		<div
			class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-subtle text-fg
				{horizontal ? '' : 'mb-3'}"
		>
			<DynamicIcon name={icon} size={17} />
		</div>
	{/if}

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-1.5">
			<span class="font-semibold text-fg">{title}</span>
			{#if isLink}
				<ArrowRight
					size={15}
					class="text-fg-subtle transition-transform group-hover:translate-x-0.5"
				/>
			{/if}
		</div>
		{#if children}
			<div class="card-body mt-1 text-sm text-fg-muted">
				{@render children()}
			</div>
		{/if}
	</div>
</svelte:element>

<style>
	.card-root,
	.card-root:hover {
		text-decoration: none;
	}
	.card-body :global(> :first-child) {
		margin-top: 0;
	}
	.card-body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
