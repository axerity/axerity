<script lang="ts">
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { theme } from '$lib/state/theme.svelte';

	type MermaidApi = typeof import('mermaid').default;
	let mermaid: MermaidApi | null = null;

	async function render(resolved: 'light' | 'dark') {
		if (!browser) return;
		const blocks = Array.from(document.querySelectorAll('pre.mermaid')) as HTMLElement[];
		if (!blocks.length) return;

		if (!mermaid) mermaid = (await import('mermaid')).default;

		for (const block of blocks) {
			if (block.dataset.src === undefined) block.dataset.src = block.textContent ?? '';
			block.removeAttribute('data-processed');
			block.innerHTML = block.dataset.src;
		}

		mermaid.initialize({
			startOnLoad: false,
			securityLevel: 'strict',
			theme: resolved === 'dark' ? 'dark' : 'neutral',
			fontFamily: 'inherit'
		});

		await mermaid.run({ nodes: blocks });
	}

	$effect(() => {
		const resolved = theme.resolved;
		tick().then(() => render(resolved));
	});

	afterNavigate(() => {
		tick().then(() => render(theme.resolved));
	});
</script>
