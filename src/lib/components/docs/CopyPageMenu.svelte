<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import FileText from '@lucide/svelte/icons/file-text';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { getRawMarkdown } from '$lib/content/raw';

	let open = $state(false);
	let copied = $state(false);

	const slug = $derived(page.url.pathname.slice(base.length).replace(/^\//, ''));

	async function copyPage() {
		const markdown = await getRawMarkdown(slug);
		if (markdown == null) return;
		try {
			await navigator.clipboard.writeText(markdown);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
		open = false;
	}

	function viewMarkdown() {
		window.open(`${page.url.pathname.replace(/\/$/, '')}.md`, '_blank');
		open = false;
	}

	function ask(endpoint: string) {
		const prompt = `Read ${page.url.href} and help me with questions about this page.`;
		window.open(`${endpoint}${encodeURIComponent(prompt)}`, '_blank');
		open = false;
	}
</script>

<div class="relative">
	<div class="flex items-center rounded-md border border-border bg-surface text-sm">
		<button
			type="button"
			onclick={copyPage}
			class="flex items-center gap-2 py-1.5 pr-2 pl-3 text-fg-muted transition hover:text-fg"
		>
			{#if copied}
				<Check size={15} class="text-fg" />
			{:else}
				<Copy size={15} />
			{/if}
			<span>{copied ? 'Copied' : 'Copy page'}</span>
		</button>
		<button
			type="button"
			onclick={() => (open = !open)}
			aria-label="More options"
			aria-expanded={open}
			class="border-l border-border px-1.5 py-1.5 text-fg-subtle transition hover:text-fg"
		>
			<ChevronDown size={15} class="transition-transform {open ? 'rotate-180' : ''}" />
		</button>
	</div>

	{#if open}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default"
			aria-label="Close menu"
			onclick={() => (open = false)}
		></button>
		<div
			class="absolute right-0 z-50 mt-1.5 w-72 overflow-hidden rounded-lg border border-border bg-surface-raised p-1 shadow-lg"
			transition:fade={{ duration: 100 }}
		>
			{#snippet item(
				Icon: typeof Copy,
				title: string,
				subtitle: string,
				onclick: () => void,
				external = false
			)}
				<button
					type="button"
					{onclick}
					class="flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left transition hover:bg-bg-subtle"
				>
					<Icon size={17} class="mt-0.5 shrink-0 text-fg-muted" />
					<span class="min-w-0 flex-1">
						<span class="flex items-center gap-1 text-sm font-medium text-fg">
							{title}
							{#if external}<ExternalLink size={12} class="text-fg-subtle" />{/if}
						</span>
						<span class="block text-xs text-fg-subtle">{subtitle}</span>
					</span>
				</button>
			{/snippet}

			{@render item(Copy, 'Copy page', 'Copy page as Markdown for LLMs', copyPage)}
			{@render item(FileText, 'View as Markdown', 'Open the raw Markdown', viewMarkdown)}
			{@render item(
				ExternalLink,
				'Open in ChatGPT',
				'Ask questions about this page',
				() => ask('https://chatgpt.com/?q='),
				true
			)}
			{@render item(
				ExternalLink,
				'Open in Claude',
				'Ask questions about this page',
				() => ask('https://claude.ai/new?q='),
				true
			)}
		</div>
	{/if}
</div>
