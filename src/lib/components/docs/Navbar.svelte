<script lang="ts">
	import { page } from '$app/state';
	import Menu from '@lucide/svelte/icons/menu';
	import Search from '@lucide/svelte/icons/search';
	import type { SiteConfig } from '$lib/types';
	import { activeFor } from '$lib/nav-match';
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import VersionSwitcher from './VersionSwitcher.svelte';
	import { searchState } from '$lib/state/search.svelte';

	let { site, onMenuClick }: { site: SiteConfig; onMenuClick?: () => void } = $props();

	const innerClass = $derived(
		(site.layout ?? 'flat') === 'boxed'
			? 'mx-auto flex h-full max-w-400 items-center gap-4 px-4 sm:px-6'
			: 'flex h-full items-center gap-4 px-4 sm:px-6'
	);

	const activeDropdown = $derived(
		site.dropdowns && site.dropdowns.length
			? (activeFor(page.url.pathname, site.dropdowns) ?? site.dropdowns[0])
			: undefined
	);

	const tabs = $derived(activeDropdown?.tabs ?? site.topNav);
	const activeTab = $derived(activeFor(page.url.pathname, tabs));
</script>

<header
	class="sticky top-0 z-40 h-(--spacing-header) border-b border-border bg-header/80 backdrop-blur-md"
>
	<div class={innerClass}>
		<!-- Mobile sidebar toggle -->
		<button
			type="button"
			onclick={onMenuClick}
			class="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-subtle hover:text-fg lg:hidden"
			aria-label="Open navigation"
		>
			<Menu size={20} />
		</button>

		<a
			href={site.logo?.href ?? '/'}
			class="flex shrink-0 items-center gap-2"
			aria-label={site.logo?.alt ?? site.name}
		>
			{#if site.logo?.light || site.logo?.dark}
				{#if site.logo.light}
					<img
						src={site.logo.light}
						alt={site.logo.alt ?? site.name}
						class="h-6 w-auto dark:hidden"
					/>
				{/if}
				{#if site.logo.dark}
					<img
						src={site.logo.dark}
						alt={site.logo.alt ?? site.name}
						class="hidden h-6 w-auto dark:block"
					/>
				{/if}
			{:else}
				<span class="text-base font-semibold text-fg">{site.name}</span>
			{/if}
		</a>

		{#if site.versions && site.versions.length}
			<VersionSwitcher versions={site.versions} />
		{/if}

		<nav class="hidden items-center gap-1 md:flex" aria-label="Main">
			{#each tabs as tab (tab.href)}
				<a
					href={tab.href}
					target={tab.external ? '_blank' : undefined}
					rel={tab.external ? 'noreferrer' : undefined}
					aria-current={tab === activeTab ? 'page' : undefined}
					class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition
						{tab === activeTab ? 'text-accent' : 'text-fg-muted hover:text-fg'}"
				>
					{#if tab.icon}
						<DynamicIcon name={tab.icon} size={15} />
					{/if}
					{tab.title}
				</a>
			{/each}
		</nav>

		<div class="flex flex-1 items-center justify-end gap-2">
			<!-- Search (full pill on sm+, icon-only on mobile) -->
			<button
				type="button"
				onclick={() => (searchState.open = true)}
				class="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-fg-subtle transition hover:border-border-strong hover:text-fg-muted sm:flex"
				aria-label="Search documentation"
			>
				<Search size={15} />
				<span>Search</span>
				<kbd
					class="ml-2 rounded border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle"
				>
					⌘K
				</kbd>
			</button>
			<button
				type="button"
				onclick={() => (searchState.open = true)}
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition hover:bg-bg-subtle hover:text-fg sm:hidden"
				aria-label="Search documentation"
			>
				<Search size={18} />
			</button>

			{#if site.github}
				<a
					href={site.github}
					target="_blank"
					rel="noreferrer"
					class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition hover:bg-bg-subtle hover:text-fg"
					aria-label="GitHub repository"
				>
					<!-- Lucide dropped brand marks, so the GitHub glyph is inlined. -->
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.27-1.21-1.61-1.21-1.61-.99-.68.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.42-.28-4.96-1.21-4.96-5.38 0-1.19.42-2.16 1.13-2.92-.11-.28-.49-1.39.11-2.89 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.5.22 2.61.11 2.89.71.76 1.13 1.73 1.13 2.92 0 4.18-2.55 5.1-4.98 5.37.39.34.74 1 .74 2.03v3.01c0 .29.18.63.74.52A11 11 0 0 0 12 1.27"
						/>
					</svg>
				</a>
			{/if}

			<ThemeToggle />
		</div>
	</div>
</header>
