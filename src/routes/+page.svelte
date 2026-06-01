<script lang="ts">
	import ThemeToggle from '$lib/components/docs/ThemeToggle.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	const GITHUB = 'https://github.com/axerity/axerity';
</script>

<svelte:head>
	<title>Axerity · An open source documentation site generator</title>
	<meta
		name="description"
		content="Axerity is an open source documentation site generator. Write Markdown, get a fast static site. Built with Svelte."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg">
	<header class="flex h-(--spacing-header) items-center gap-4 px-4 sm:px-8">
		<a href="/" class="flex items-center gap-2" aria-label="Axerity">
			<img src="/favicon-light.svg" alt="Axerity" class="h-6 w-auto dark:hidden" />
			<img src="/favicon-dark.svg" alt="Axerity" class="hidden h-6 w-auto dark:block" />
			<span class="text-base font-semibold text-fg">Axerity</span>
		</a>
		<div class="ml-auto flex items-center gap-2">
			<a
				href="/docs"
				class="rounded-lg px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:text-fg"
			>
				Docs
			</a>
			<a
				href={GITHUB}
				target="_blank"
				rel="noreferrer"
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition hover:bg-bg-subtle hover:text-fg"
				aria-label="GitHub"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.27-1.21-1.61-1.21-1.61-.99-.68.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.42-.28-4.96-1.21-4.96-5.38 0-1.19.42-2.16 1.13-2.92-.11-.28-.49-1.39.11-2.89 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.5.22 2.61.11 2.89.71.76 1.13 1.73 1.13 2.92 0 4.18-2.55 5.1-4.98 5.37.39.34.74 1 .74 2.03v3.01c0 .29.18.63.74.52A11 11 0 0 0 12 1.27"
					/>
				</svg>
			</a>
			<ThemeToggle />
		</div>
	</header>

	<main class="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-20">
		<h1 class="text-4xl font-bold tracking-tight text-fg sm:text-5xl">
			Documentation that writes itself
		</h1>
		<p class="mt-5 text-lg leading-relaxed text-fg-muted">
			Axerity is an open source documentation site generator. You write Markdown in plain files and
			get navigation, search, theming, and dark mode out of the box.
		</p>
		<p class="mt-4 text-lg leading-relaxed text-fg-muted">
			It exists because good docs should be easy to write and pleasant to read. Bring your words,
			and Axerity handles the rest. Built with Svelte.
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a
				href="/docs"
				class="inline-flex items-center gap-1.5 rounded-lg bg-fg px-4 py-2.5 text-sm font-semibold text-surface transition hover:opacity-90"
			>
				Read the docs
				<ArrowRight size={16} />
			</a>
			<a
				href={GITHUB}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-border-strong"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.27-1.21-1.61-1.21-1.61-.99-.68.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.42-.28-4.96-1.21-4.96-5.38 0-1.19.42-2.16 1.13-2.92-.11-.28-.49-1.39.11-2.89 0 0 .92-.3 3.02 1.12a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.5.22 2.61.11 2.89.71.76 1.13 1.73 1.13 2.92 0 4.18-2.55 5.1-4.98 5.37.39.34.74 1 .74 2.03v3.01c0 .29.18.63.74.52A11 11 0 0 0 12 1.27"
					/>
				</svg>
				Star on GitHub
			</a>
		</div>
	</main>

	<footer
		class="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-3 border-t border-border px-6 py-6 text-sm text-fg-subtle sm:flex-row sm:items-center"
	>
		<span>Axerity is open source under the MIT license.</span>
		<div class="flex items-center gap-4">
			<a href="/docs" class="transition hover:text-fg">Docs</a>
			<a href={GITHUB} target="_blank" rel="noreferrer" class="transition hover:text-fg">GitHub</a>
		</div>
	</footer>
</div>
