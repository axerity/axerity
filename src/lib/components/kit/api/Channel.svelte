<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { API, type ApiContext, type ApiExampleEntry } from './api-context';
	import ApiExamplePanel from './ApiExamplePanel.svelte';

	let {
		address,
		protocol = 'ws',
		server,
		description,
		children
	}: {
		address: string;
		protocol?: string;
		server?: string;
		description?: string;
		children: Snippet;
	} = $props();

	const examples = $state<ApiExampleEntry[]>([]);
	let counter = 0;

	const objects = $derived(examples.filter((example) => example?.kind === 'object'));
	const messages = $derived(examples.filter((example) => example?.kind !== 'object'));

	const url = $derived((server ? server.replace(/\/$/, '') : '') + address);

	setContext<ApiContext>(API, {
		registerExample(entry) {
			const id = counter++;
			examples.push({ ...entry, id });
			return id;
		},
		unregisterExample(id) {
			const index = examples.findIndex((example) => example?.id === id);
			if (index !== -1) examples.splice(index, 1);
		}
	});
</script>

<div class="api">
	<div class="api-main">
		<div class="channel-head">
			<span class="channel-protocol">{protocol.toUpperCase()}</span>
			<code class="channel-address">{url}</code>
		</div>
		{#if description}
			<p class="channel-sub">{description}</p>
		{/if}
		{@render children?.()}
	</div>

	<div class="api-rail">
		<div class="api-rail-sticky">
			{#each objects as object (object.id)}
				<ApiExamplePanel label={object.title} entries={[object]} />
			{/each}
			<ApiExamplePanel label="Messages" entries={messages} />
		</div>
	</div>
</div>

<style>
	.api {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 2rem;
	}
	@media (min-width: 1024px) {
		.api {
			grid-template-columns: minmax(0, 1fr) 28rem;
			gap: 2.5rem;
			align-items: start;
		}
	}
	.api-main :global(h2) {
		margin-top: 1.75rem;
		font-size: 1.2rem;
	}

	.channel-head {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.5rem;
	}
	.channel-protocol {
		flex-shrink: 0;
		border-radius: var(--radius-md);
		background-color: color-mix(in oklab, var(--accent) 14%, transparent);
		padding: 0.15rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--accent);
	}
	.channel-address {
		font-family: var(--font-mono);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--fg);
	}
	.channel-sub {
		margin-top: 0;
		color: var(--fg-muted);
	}

	.api-rail-sticky {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	@media (min-width: 1024px) {
		.api-rail-sticky {
			position: sticky;
			top: calc(var(--spacing-header) + 1.5rem);
		}
	}
</style>
