<script lang="ts" module>
	export interface TypeTableProp {
		/** Short type signature, shown in the collapsed row (e.g. `string`). */
		type?: string;
		/** Short prose describing the property. */
		description?: string;
		/** Full type signature, shown in the expanded detail (e.g. `string | undefined`). */
		typeDescription?: string;
		/** Optional href turning the expanded type into a link. */
		typeDescriptionLink?: string;
		/** Default value, shown in the expanded detail. */
		default?: string;
		required?: boolean;
		deprecated?: boolean;
	}
</script>

<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { withBase } from '$lib/base';

	let { type }: { type: Record<string, TypeTableProp> } = $props();

	const entries = $derived(Object.entries(type));

	// Rows are open by default; track the ones the reader has collapsed.
	const collapsed = new SvelteSet<string>();
	const isOpen = (name: string) => !collapsed.has(name);
	function toggle(name: string) {
		if (collapsed.has(name)) collapsed.delete(name);
		else collapsed.add(name);
	}
</script>

<div class="tt">
	<div class="tt-head">
		<span>Prop</span>
		<span>Type</span>
		<span class="tt-spacer"></span>
	</div>

	{#each entries as [name, prop] (name)}
		<div class="tt-item">
			<button
				type="button"
				class="tt-summary"
				aria-expanded={isOpen(name)}
				onclick={() => toggle(name)}
			>
				<span class="tt-prop" class:tt-deprecated={prop.deprecated}>
					{name}{prop.required ? '' : '?'}
				</span>
				<span class="tt-type">{prop.type ?? '—'}</span>
				<ChevronDown size={16} class="tt-chevron {isOpen(name) ? 'tt-chevron-open' : ''}" />
			</button>

			{#if isOpen(name)}
				<div class="tt-detail" transition:slide={{ duration: 150 }}>
					{#if prop.description}
						<p class="tt-desc">{prop.description}</p>
					{/if}
					<div class="tt-meta-row">
						<span class="tt-meta-label">Type</span>
						{#if prop.typeDescriptionLink}
							<a class="tt-code tt-link" href={withBase(prop.typeDescriptionLink)}>
								{prop.typeDescription ?? prop.type ?? '—'}
							</a>
						{:else}
							<span class="tt-code">{prop.typeDescription ?? prop.type ?? '—'}</span>
						{/if}
					</div>
					{#if prop.default !== undefined}
						<div class="tt-meta-row">
							<span class="tt-meta-label">Default</span>
							<span class="tt-code">{prop.default}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.tt {
		margin: 1.5rem 0;
		padding: 0.4rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background-color: var(--bg-subtle);
	}

	.tt-head {
		display: grid;
		grid-template-columns: 1fr 1.4fr auto;
		gap: 1rem;
		padding: 0.5rem 0.85rem;
		font-size: 0.78rem;
		color: var(--fg-subtle);
	}

	.tt-item {
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background-color: var(--surface);
	}
	.tt-item + .tt-item {
		margin-top: 0.4rem;
	}

	.tt-summary {
		display: grid;
		grid-template-columns: 1fr 1.4fr auto;
		gap: 1rem;
		align-items: center;
		width: 100%;
		padding: 0.6rem 0.85rem;
		text-align: left;
		cursor: pointer;
	}

	.tt-prop {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--accent);
	}
	.tt-deprecated {
		text-decoration: line-through;
		opacity: 0.7;
	}

	.tt-type {
		overflow: hidden;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--fg-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* :global because the class lands on the <svg> rendered by the icon component. */
	.tt-summary :global(.tt-chevron) {
		color: var(--fg-subtle);
		transition: transform 0.15s ease;
	}
	.tt-summary :global(.tt-chevron-open) {
		transform: rotate(180deg);
	}

	.tt-detail {
		padding: 0 0.85rem 0.85rem;
		border-top: 1px solid var(--border);
	}

	.tt-desc {
		margin: 0.75rem 0 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--fg-muted);
	}

	.tt-meta-row {
		display: flex;
		gap: 1rem;
		padding-top: 0.7rem;
	}
	.tt-meta-label {
		flex-shrink: 0;
		width: 4.5rem;
		font-size: 0.85rem;
		color: var(--fg-subtle);
	}
	.tt-code {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--fg);
	}
	.tt-link {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
