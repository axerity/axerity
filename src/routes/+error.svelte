<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config/site';
	import House from '@lucide/svelte/icons/house';
	import BookOpen from '@lucide/svelte/icons/book-open';

	const status = $derived(page.status);
	const heading = $derived(status === 404 ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		status === 404
			? "Sorry, we couldn't find the page you're looking for. It may have been moved or removed."
			: (page.error?.message ?? 'An unexpected error occurred.')
	);
</script>

<svelte:head>
	<title>{status} · {site.name}</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
	<p
		class="font-mono text-[5rem] leading-none font-bold text-border-strong select-none sm:text-[7rem]"
	>
		{status}
	</p>

	<h1 class="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{heading}</h1>
	<p class="max-w-md text-fg-muted">{message}</p>

	<div class="mt-3 flex flex-wrap items-center justify-center gap-3">
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition hover:opacity-90"
		>
			<BookOpen size={16} />
			Back to docs
		</a>
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
		>
			<House size={16} />
			Home
		</a>
	</div>
</div>
