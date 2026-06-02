<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';
	import SearchIcon from '@lucide/svelte/icons/search';
	import FileText from '@lucide/svelte/icons/file-text';
	import CornerDownLeft from '@lucide/svelte/icons/corner-down-left';
	import { searchState } from '$lib/state/search.svelte';

	interface Doc {
		title: string;
		section: string;
		description: string;
		href: string;
	}

	let term = $state('');
	let results = $state<Doc[]>([]);
	let activeIndex = $state(0);
	let loaded = $state(false);
	let input = $state<HTMLInputElement>();

	type Orama = typeof import('@orama/orama');
	let orama: Orama | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let db: any = null;

	const schema = {
		title: 'string',
		section: 'string',
		description: 'string',
		content: 'string',
		href: 'string'
	} as const;

	async function ensureLoaded() {
		if (!browser || db) return;
		orama = await import('@orama/orama');
		const docs = await (await fetch('/search.json')).json();
		db = orama.create({ schema });
		await orama.insertMultiple(db, docs);
		loaded = true;
	}

	$effect(() => {
		function onKey(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				searchState.toggle();
			} else if (event.key === 'Escape' && searchState.open) {
				searchState.open = false;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (searchState.open) {
			ensureLoaded();
			setTimeout(() => input?.focus(), 0);
		} else {
			term = '';
			results = [];
			activeIndex = 0;
		}
	});

	$effect(() => {
		const query = term.trim();
		if (!query || !loaded || !db || !orama) {
			results = [];
			return;
		}
		Promise.resolve(
			orama.search(db, {
				term: query,
				properties: ['title', 'description', 'content', 'section'],
				boost: { title: 4, description: 2 },
				tolerance: 1,
				limit: 8
			})
		).then((response) => {
			results = response.hits.map((hit: { document: Doc }) => hit.document);
			activeIndex = 0;
		});
	});

	function go(href: string) {
		searchState.open = false;
		goto(href);
	}

	function onInputKey(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = Math.min(activeIndex + 1, results.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		} else if (event.key === 'Enter' && results[activeIndex]) {
			event.preventDefault();
			go(results[activeIndex].href);
		}
	}
</script>

{#if searchState.open}
	<div class="fixed inset-0 z-60 flex items-start justify-center px-4 pt-[12vh]">
		<button
			type="button"
			class="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
			aria-label="Close search"
			onclick={() => (searchState.open = false)}
			transition:fade={{ duration: 120 }}
		></button>

		<div
			class="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
			transition:scale={{ duration: 130, start: 0.97 }}
		>
			<div class="flex items-center gap-3 border-b border-border px-4">
				<SearchIcon size={18} class="shrink-0 text-fg-subtle" />
				<input
					bind:this={input}
					bind:value={term}
					onkeydown={onInputKey}
					type="text"
					placeholder="Search documentation…"
					class="w-full border-0 bg-transparent py-3.5 text-sm text-fg shadow-none outline-none placeholder:text-fg-subtle focus:border-0 focus:ring-0 focus:outline-none"
				/>
				<kbd
					class="rounded border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle"
				>
					Esc
				</kbd>
			</div>

			<div class="max-h-[60vh] overflow-y-auto p-2">
				{#if term.trim() && results.length === 0}
					<p class="px-3 py-8 text-center text-sm text-fg-subtle">
						No results for “{term.trim()}”.
					</p>
				{:else if !term.trim()}
					<p class="px-3 py-8 text-center text-sm text-fg-subtle">
						Start typing to search the docs.
					</p>
				{:else}
					<ul class="flex flex-col gap-0.5">
						{#each results as result, index (result.href)}
							<li>
								<button
									type="button"
									onmouseenter={() => (activeIndex = index)}
									onclick={() => go(result.href)}
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition
										{activeIndex === index ? 'bg-accent/10' : ''}"
								>
									<FileText size={16} class="shrink-0 text-fg-subtle" />
									<span class="min-w-0 flex-1">
										<span class="block truncate text-sm font-medium text-fg">{result.title}</span>
										<span class="block truncate text-xs text-fg-subtle">
											{result.section}{result.description ? ` · ${result.description}` : ''}
										</span>
									</span>
									{#if activeIndex === index}
										<CornerDownLeft size={14} class="shrink-0 text-fg-subtle" />
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div
				class="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-fg-subtle"
			>
				<span><kbd class="font-mono">↑↓</kbd> navigate</span>
				<span><kbd class="font-mono">↵</kbd> select</span>
				<span class="ml-auto">Search by Orama</span>
			</div>
		</div>
	</div>
{/if}
