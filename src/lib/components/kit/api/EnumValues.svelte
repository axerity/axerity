<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title = 'Possible enum values', children }: { title?: string; children: Snippet } =
		$props();
</script>

<div class="enum">
	<div class="enum-head">{title}</div>
	<div class="enum-body">
		{@render children()}
	</div>
</div>

<style>
	.enum {
		margin: 0.75rem 0;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background-color: var(--bg-subtle);
	}
	.enum-head {
		padding: 0.55rem 0.85rem;
		border-bottom: 1px solid var(--border);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-muted);
	}
	.enum-body {
		padding: 0.25rem 0.85rem;
	}
	.enum-body > :global(.enum-item:not(:first-child)) {
		border-top: 1px solid var(--border);
	}
</style>
