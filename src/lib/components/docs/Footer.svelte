<script lang="ts">
	import type { SiteConfig } from '$lib/types';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let { site }: { site: SiteConfig } = $props();
</script>

<footer
	class="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-fg-subtle sm:flex-row sm:items-center"
>
	<div class="flex flex-col gap-3">
		<div class="flex items-center gap-3">
			{#if site.github}
				<a
					href={site.github}
					target="_blank"
					rel="noreferrer"
					class="transition hover:text-fg"
					aria-label="GitHub"
				>
					<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.27-1.21-1.61-1.21-1.61-.99-.68.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.42-.28-4.96-1.21-4.96-5.38 0-1.19.42-2.16 1.13-2.92-.11-.28-.49-1.39.11-2.89 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.5.22 2.61.11 2.89.71.76 1.13 1.73 1.13 2.92 0 4.18-2.55 5.1-4.98 5.37.39.34.74 1 .74 2.03v3.01c0 .29.18.63.74.52A11 11 0 0 0 12 1.27"
						/>
					</svg>
				</a>
			{/if}
			{#each site.social ?? [] as link (link.href)}
				<a
					href={link.href}
					target="_blank"
					rel="noreferrer"
					class="transition hover:text-fg"
					aria-label={link.label ?? link.icon}
				>
					<DynamicIcon name={link.icon} size={17} />
				</a>
			{/each}
		</div>

		{#if site.footer?.links?.length}
			<nav class="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Footer">
				{#each site.footer.links as link (link.href)}
					<a href={link.href} class="transition hover:text-fg">{link.title}</a>
				{/each}
			</nav>
		{/if}
	</div>

	{#if site.footer?.note}
		<p>{site.footer.note}</p>
	{:else}
		<p>
			Powered by
			<a href="https://axerity.com" class="font-semibold text-fg-muted transition hover:text-fg">
				Axerity
			</a>
		</p>
	{/if}
</footer>
