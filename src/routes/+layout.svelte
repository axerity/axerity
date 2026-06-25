<script lang="ts">
	import '@fontsource-variable/geist/index.css';
	import '@fontsource-variable/geist-mono/index.css';
	import '@shikijs/twoslash/style-rich.css';
	import './layout.css';
	import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
	import geistMonoLatin from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url';
	import { base } from '$app/paths';
	import Analytics from '$lib/components/docs/Analytics.svelte';

	let { data, children } = $props();

	const site = $derived(data.site);
	const favicon = $derived(site.favicon ?? `${base}/favicon.svg`);
	const faviconType = $derived(
		favicon.endsWith('.svg')
			? 'image/svg+xml'
			: favicon.endsWith('.png')
				? 'image/png'
				: favicon.endsWith('.ico')
					? 'image/x-icon'
					: undefined
	);
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={geistLatin} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={geistMonoLatin} crossorigin="anonymous" />
	<link rel="icon" href={favicon} type={faviconType} />
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
