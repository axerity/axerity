<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';

	let {
		method = 'GET',
		path,
		baseUrl = ''
	}: { method?: string; path: string; baseUrl?: string } = $props();

	const upper = $derived(method.toUpperCase());

	const segments = $derived(path.split(/(\{[^}]+\})/).filter(Boolean));

	let copied = $state(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(baseUrl + path);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}
</script>

<div class="endpoint">
	<span class="endpoint-method" data-method={upper}>{upper}</span>
	<code class="endpoint-path">
		{#if baseUrl}<span class="endpoint-base">{baseUrl}</span
			>{/if}{#each segments as segment (segment)}{#if /^\{.*\}$/.test(segment)}<span
					class="endpoint-param">{segment}</span
				>{:else}{segment}{/if}{/each}
	</code>
	<button type="button" class="endpoint-copy" onclick={copy} aria-label="Copy endpoint URL">
		{#if copied}
			<Check size={15} />
		{:else}
			<Copy size={15} />
		{/if}
	</button>
</div>

<style>
	.endpoint {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin: 1.25rem 0;
		padding: 0.55rem 0.65rem 0.55rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background-color: var(--bg-subtle);
	}

	.endpoint-method {
		flex-shrink: 0;
		padding: 0.15rem 0.5rem;
		border-radius: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--m);
		background-color: color-mix(in oklch, var(--m) 15%, transparent);
	}
	.endpoint-method[data-method='GET'] {
		--m: oklch(0.6 0.15 155);
	}
	.endpoint-method[data-method='POST'] {
		--m: oklch(0.6 0.16 250);
	}
	.endpoint-method[data-method='PUT'] {
		--m: oklch(0.68 0.15 75);
	}
	.endpoint-method[data-method='PATCH'] {
		--m: oklch(0.62 0.19 300);
	}
	.endpoint-method[data-method='DELETE'] {
		--m: oklch(0.62 0.21 25);
	}

	.endpoint-path {
		flex: 1;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--fg);
		white-space: nowrap;
	}
	.endpoint-base {
		color: var(--fg-subtle);
	}
	.endpoint-param {
		color: var(--accent);
	}

	.endpoint-copy {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		border-radius: 0.375rem;
		color: var(--fg-subtle);
		cursor: pointer;
		transition:
			color 0.15s,
			background-color 0.15s;
	}
	.endpoint-copy:hover {
		color: var(--fg);
		background-color: var(--surface);
	}
</style>
