<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		name,
		type,
		typeLink,
		required = false,
		deprecated = false,
		default: defaultValue,
		children
	}: {
		name: string;
		type?: string;
		typeLink?: string;
		required?: boolean;
		deprecated?: boolean;
		default?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="field">
	<div class="field-head">
		<code class="field-name" class:field-deprecated={deprecated}>{name}</code>
		{#if type}
			{#if typeLink}
				<a class="field-type field-type-link" href={typeLink}>{type}</a>
			{:else}
				<span class="field-type">{type}</span>
			{/if}
		{/if}
		{#if required}
			<span class="field-flag field-required">required</span>
		{/if}
		{#if deprecated}
			<span class="field-flag">deprecated</span>
		{/if}
		{#if defaultValue !== undefined}
			<span class="field-default">default: <code>{defaultValue}</code></span>
		{/if}
	</div>
	{#if children}
		<div class="field-desc">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.field {
		padding: 0.7rem 0;
		border-top: 1px solid var(--border);
	}
	.field:last-of-type {
		border-bottom: 1px solid var(--border);
	}

	.field-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
	}

	.field-name {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--fg);
	}
	.field-deprecated {
		text-decoration: line-through;
		opacity: 0.7;
	}

	.field-type {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--fg-muted);
	}
	.field-type-link {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.field-flag {
		padding: 0.05rem 0.4rem;
		border-radius: 9999px;
		font-size: 0.62rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--fg-subtle);
		background-color: var(--bg-subtle);
	}
	.field-required {
		color: oklch(0.62 0.21 25);
		background-color: color-mix(in oklch, oklch(0.62 0.21 25) 14%, transparent);
	}

	.field-default {
		font-size: 0.78rem;
		color: var(--fg-subtle);
	}
	.field-default code {
		font-family: var(--font-mono);
	}

	.field-desc {
		margin-top: 0.4rem;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--fg-muted);
	}
	.field-desc :global(> :first-child) {
		margin-top: 0;
	}
	.field-desc :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
