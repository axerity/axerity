<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { API, type ApiContext, type ApiExampleEntry } from './api-context';
	import ApiExamplePanel from './ApiExamplePanel.svelte';

	let { children }: { children: Snippet } = $props();

	const examples = $state<ApiExampleEntry[]>([]);
	let counter = 0;

	const requests = $derived(examples.filter((example) => example.kind === 'request'));
	const responses = $derived(examples.filter((example) => example.kind === 'response'));
	const objects = $derived(examples.filter((example) => example.kind === 'object'));

	setContext<ApiContext>(API, {
		registerExample(entry) {
			const id = counter++;
			examples.push({ ...entry, id });
			return id;
		},
		unregisterExample(id) {
			const index = examples.findIndex((example) => example.id === id);
			if (index !== -1) examples.splice(index, 1);
		}
	});
</script>

<div class="api">
	<div class="api-main">
		{@render children()}
	</div>

	<div class="api-rail">
		<div class="api-rail-sticky">
			{#each objects as object (object.id)}
				<ApiExamplePanel label={object.title} entries={[object]} />
			{/each}
			<ApiExamplePanel label="Request" entries={requests} />
			<ApiExamplePanel label="Response" entries={responses} />
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
	.api-main :global(h2:first-child) {
		margin-top: 0;
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
