<script lang="ts">
	import '@fontsource-variable/geist/index.css';
	import '@fontsource-variable/geist-mono/index.css';
	import '@shikijs/twoslash/style-rich.css';
	import './layout.css';
	import { base } from '$app/paths';
	import Analytics from '$lib/components/docs/Analytics.svelte';

	let { data, children } = $props();

	const site = $derived(data.site);
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.svg" type="image/svg+xml" />
	{#if site.url}
		<link
			rel="alternate"
			type="application/rss+xml"
			title="{site.name} changelog"
			href="{site.url}{base}/rss.xml"
		/>
	{/if}
</svelte:head>
<Analytics {site} />
{@render children()}
