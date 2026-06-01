<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	let { links }: { links: { title: string; href: string }[] } = $props();
</script>

<div class="flex flex-col gap-0.5 border-t border-border pt-3">
	{#each links as link (link.href)}
		<a
			href={link.href}
			target="_blank"
			rel="noreferrer"
			class="group flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm text-fg-muted transition hover:bg-bg-subtle hover:text-fg"
		>
			<span>{link.title}</span>
			<ArrowUpRight size={14} class="text-fg-subtle transition group-hover:text-fg-muted" />
		</a>
	{/each}
</div>
