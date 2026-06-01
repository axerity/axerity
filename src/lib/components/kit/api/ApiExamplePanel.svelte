<script lang="ts">
	import type { ApiExampleEntry } from './api-context';

	let { label, entries }: { label: string; entries: ApiExampleEntry[] } = $props();

	let activeId = $state<number | undefined>(undefined);
	const active = $derived(entries.find((entry) => entry.id === activeId) ?? entries[0]);
	const multiple = $derived(entries.length > 1);
</script>

{#if entries.length}
	<div class="panel">
		<div class="panel-head">
			<span class="panel-label">{label}</span>
			{#if multiple}
				<div class="panel-tabs" role="tablist">
					{#each entries as entry (entry.id)}
						<button
							type="button"
							role="tab"
							aria-selected={active?.id === entry.id}
							class:active={active?.id === entry.id}
							onclick={() => (activeId = entry.id)}
						>
							{entry.title}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="panel-body">
			{#if active}
				{@render active.snippet()}
			{/if}
		</div>
	</div>
{/if}

<style>
	.panel {
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background-color: var(--surface-raised);
	}

	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.4rem 0.4rem 0.4rem 0.85rem;
		border-bottom: 1px solid var(--border);
		background-color: var(--bg-subtle);
	}

	.panel-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-muted);
	}

	.panel-tabs {
		display: flex;
		gap: 0.15rem;
		overflow-x: auto;
	}
	.panel-tabs button {
		flex-shrink: 0;
		padding: 0.2rem 0.55rem;
		border-radius: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--fg-muted);
		cursor: pointer;
		transition:
			color 0.12s,
			background-color 0.12s;
	}
	.panel-tabs button:hover {
		color: var(--fg);
	}
	.panel-tabs button.active {
		color: var(--fg);
		background-color: var(--surface);
	}

	.panel-body :global(.code-block) {
		margin: 0;
	}
	.panel-body :global(pre.shiki) {
		border: 0;
		border-radius: 0;
		background-color: transparent !important;
	}

	.panel-body :global(.code-header) {
		border-top: 0;
	}
</style>
