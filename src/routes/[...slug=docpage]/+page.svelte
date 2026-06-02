<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { DocsLayout } from '$lib';
	import Markdown from '$lib/markdown/Markdown.svelte';
	import { pathInVersion } from '$lib/content';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const site = $derived(data.site);
	const fm = $derived(data.frontmatter);
	const wide = $derived(fm.layout === 'api');

	const editUrl = $derived(site.editLink ? `${site.editLink}/${data.sourcePath}` : undefined);

	const pageTitle = $derived(fm.title ? `${fm.title} · ${site.name}` : site.name);
	const pageDescription = $derived(fm.description ?? site.description ?? '');
	const canonical = $derived(site.url ? site.url + page.url.pathname : undefined);
	const ogImagePath = $derived(
		site.og?.enabled
			? `${base}/og/${data.sourcePath.replace(/\.md$/, '')}.png`
			: site.ogImage
				? `${base}${site.ogImage}`
				: undefined
	);
	const ogImage = $derived(ogImagePath && (site.url ? site.url + ogImagePath : ogImagePath));
</script>

<svelte:head>
	<title>{pageTitle}</title>
	{#if pageDescription}
		<meta name="description" content={pageDescription} />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fm.title ?? site.name} />
	{#if pageDescription}
		<meta property="og:description" content={pageDescription} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fm.title ?? site.name} />
	{#if pageDescription}
		<meta name="twitter:description" content={pageDescription} />
	{/if}
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
</svelte:head>

<DocsLayout
	{site}
	sidebar={data.nav.sidebar}
	flatPages={data.nav.flatPages}
	{wide}
	{editUrl}
	updated={fm.updated}
	resolveVersion={(pathname, versionPath) => pathInVersion(site, pathname, versionPath)}
>
	<Markdown nodes={data.doc} />
</DocsLayout>
