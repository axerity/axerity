<script lang="ts">
	import { browser } from '$app/environment';
	import X from '@lucide/svelte/icons/x';
	import type { Banner } from '$lib/types';

	let { banner }: { banner: Banner } = $props();

	const storageKey = $derived(`axerity-banner:${banner.id ?? banner.text}`);
	let dismissed = $state(false);

	$effect(() => {
		if (browser && banner.dismissible) {
			dismissed = localStorage.getItem(storageKey) === '1';
		}
	});

	function dismiss() {
		dismissed = true;
		if (browser) localStorage.setItem(storageKey, '1');
	}
</script>

{#if !dismissed}
	<div
		data-banner-key={storageKey}
		class="banner relative flex items-center justify-center gap-2 bg-fg px-10 py-2 text-center text-sm font-medium text-surface"
	>
		{#if banner.href}
			<a href={banner.href} class="hover:underline">{banner.text}</a>
		{:else}
			<span>{banner.text}</span>
		{/if}
		{#if banner.dismissible}
			<button
				type="button"
				onclick={dismiss}
				aria-label="Dismiss announcement"
				class="absolute right-3 inline-flex h-6 w-6 items-center justify-center rounded-md text-surface/70 transition hover:bg-surface/15 hover:text-surface"
			>
				<X size={15} />
			</button>
		{/if}
	</div>
{/if}
