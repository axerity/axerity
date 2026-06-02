<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import type { NavLink, NavSection, SiteConfig } from '$lib/types';
	import Banner from './Banner.svelte';
	import Mermaid from './Mermaid.svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import PageNav from './PageNav.svelte';
	import PageMeta from './PageMeta.svelte';
	import Footer from './Footer.svelte';
	import CopyPageMenu from './CopyPageMenu.svelte';
	import SearchDialog from './SearchDialog.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import SidebarFooterLinks from './SidebarFooterLinks.svelte';

	let {
		site,
		sidebar,
		flatPages = [],
		wide = false,
		editUrl,
		updated,
		resolveVersion,
		children
	}: {
		site: SiteConfig;
		sidebar: NavSection[];
		flatPages?: NavLink[];
		wide?: boolean;
		editUrl?: string;
		updated?: string;
		resolveVersion?: (pathname: string, versionPath: string) => string;
		children: Snippet;
	} = $props();

	// 'boxed' centers the whole shell in a max-width container; 'flat' (default)
	// is full-bleed with the sidebar flush against the left edge.
	const containerClass = $derived(
		(site.layout ?? 'flat') === 'boxed'
			? 'mx-auto flex w-full max-w-400 px-0 sm:px-6'
			: 'flex w-full px-0 sm:px-6'
	);

	const sidebarVariants = {
		flush:
			'sticky top-(--spacing-header) h-[calc(100vh-var(--spacing-header))] border-r border-border bg-sidebar px-4',
		card: 'sticky top-[calc(var(--spacing-header)_+_1rem)] my-4 mr-3 h-[calc(100vh_-_var(--spacing-header)_-_2rem)] overflow-hidden rounded-xl border border-border bg-sidebar px-3',
		floating:
			'sticky top-[calc(var(--spacing-header)_+_0.75rem)] my-3 mr-2 h-[calc(100vh_-_var(--spacing-header)_-_1.5rem)] overflow-hidden rounded-2xl border border-border bg-sidebar px-3 shadow-sm'
	} as const;

	const asideClass = $derived(
		`hidden w-sidebar shrink-0 flex-col lg:flex ${sidebarVariants[site.sidebar?.variant ?? 'flush']}`
	);

	let mobileOpen = $state(false);

	// Close the mobile drawer after navigating to a new page.
	afterNavigate(() => {
		mobileOpen = false;
	});

	// Delegated copy-to-clipboard for code blocks. One listener handles every
	// block (including those rendered after client-side navigation), since the
	// buttons are static markup from the Shiki highlighter.
	$effect(() => {
		async function onClick(event: MouseEvent) {
			const target = event.target;
			if (!(target instanceof Element)) return;
			const button = target.closest('.copy-button');
			if (!button) return;

			// Lines are separate elements (the "\n" text nodes are stripped), so
			// rejoin them with newlines for a faithful copy.
			const pre = button.closest('.code-block')?.querySelector('pre');
			const lines = pre?.querySelectorAll('.line');
			const code =
				lines && lines.length
					? Array.from(lines)
							.map((line) => line.textContent)
							.join('\n')
					: (pre?.textContent ?? '');
			try {
				await navigator.clipboard.writeText(code);
				button.setAttribute('data-copied', 'true');
				setTimeout(() => button.removeAttribute('data-copied'), 1500);
			} catch {
				// Clipboard unavailable (e.g. insecure context) — fail quietly.
			}
		}

		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	});
</script>

<div class="min-h-screen bg-bg">
	{#if site.banner}
		<Banner banner={site.banner} />
	{/if}
	<Navbar {site} {resolveVersion} onMenuClick={() => (mobileOpen = true)} />
	<SearchDialog />
	<Mermaid />

	<div class={containerClass}>
		<!-- Sidebar (desktop) -->
		<aside class={asideClass}>
			<div class="min-h-0 flex-1 overflow-y-auto py-8 scrollbar-none [&::-webkit-scrollbar]:hidden">
				<Sidebar sections={sidebar} dropdowns={site.dropdowns} defaultOpen={site.sidebar?.defaultOpen} />
			</div>
			{#if site.sidebarLinks && site.sidebarLinks.length}
				<div class="shrink-0 pb-6">
					<SidebarFooterLinks links={site.sidebarLinks} />
				</div>
			{/if}
		</aside>

		<!-- Content -->
		<main
			class="flex min-h-[calc(100vh-var(--spacing-header))] min-w-0 flex-1 flex-col px-4 py-8 sm:px-8 lg:px-12"
		>
			<div class="mx-auto w-full {wide ? 'max-w-7xl' : 'max-w-content'}">
				<div class="mb-3 flex items-center gap-3 {wide ? 'lg:max-w-[calc(100%-30.5rem)]' : ''}">
					<Breadcrumbs {sidebar} />
					<div class="ml-auto shrink-0">
						<CopyPageMenu />
					</div>
				</div>
			</div>
			<article
				id="doc-content"
				class="doc-content mx-auto w-full {wide ? 'doc-api max-w-7xl' : 'max-w-content'}"
			>
				{@render children()}
			</article>

			<!-- Prev/next + footer are pushed to the bottom of the viewport on short
			     pages (mt-auto on the first block). On API (wide) pages they stay
			     aligned to the content column, not under the code rail. -->
			<div class="mx-auto mt-auto w-full {wide ? 'max-w-7xl' : 'max-w-content'}">
				<div class={wide ? 'lg:max-w-[calc(100%-30.5rem)]' : ''}>
					<PageMeta {editUrl} {updated} />
					<PageNav pages={flatPages} />
				</div>
			</div>

			<div class="mx-auto w-full {wide ? 'max-w-7xl' : 'max-w-content'}">
				<div class={wide ? 'lg:max-w-[calc(100%-30.5rem)]' : ''}>
					<Footer {site} />
				</div>
			</div>
		</main>

		<!-- Table of contents (hidden in wide/API mode, which has no room for it) -->
		{#if !wide}
			<aside
				class="sticky top-(--spacing-header) hidden h-[calc(100vh-var(--spacing-header))] w-toc shrink-0 overflow-y-auto py-8 pl-4 xl:block"
			>
				<TableOfContents />
			</aside>
		{/if}
	</div>
</div>

<!-- Mobile sidebar drawer -->
{#if mobileOpen}
	<div class="fixed inset-0 z-50 lg:hidden">
		<button
			type="button"
			class="absolute inset-0 bg-black/40 backdrop-blur-sm"
			aria-label="Close navigation"
			onclick={() => (mobileOpen = false)}
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="absolute top-0 left-0 flex h-full w-72 max-w-[85%] flex-col border-r border-border bg-sidebar"
			transition:fly={{ x: -300, duration: 200 }}
		>
			<div class="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
				<Sidebar sections={sidebar} dropdowns={site.dropdowns} defaultOpen={site.sidebar?.defaultOpen} />
			</div>
			{#if site.sidebarLinks && site.sidebarLinks.length}
				<div class="shrink-0 px-6 pb-6">
					<SidebarFooterLinks links={site.sidebarLinks} />
				</div>
			{/if}
		</div>
	</div>
{/if}
