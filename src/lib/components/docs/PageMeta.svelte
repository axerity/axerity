<script lang="ts">
	import PencilLine from '@lucide/svelte/icons/pencil-line';

	let { editUrl, updated }: { editUrl?: string; updated?: string } = $props();

	const formatted = $derived.by(() => {
		if (!updated) return undefined;
		const date = new Date(updated);
		if (Number.isNaN(date.getTime())) return updated;
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	});
</script>

{#if editUrl || formatted}
	<div
		class="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-sm text-fg-subtle"
	>
		{#if formatted}
			<span>Last updated {formatted}</span>
		{:else}
			<span></span>
		{/if}
		{#if editUrl}
			<a
				href={editUrl}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-1.5 transition hover:text-fg"
			>
				<PencilLine size={14} />
				Edit this page
			</a>
		{/if}
	</div>
{/if}
