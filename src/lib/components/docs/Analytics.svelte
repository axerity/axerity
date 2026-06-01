<script lang="ts">
	import { browser } from '$app/environment';
	import type { SiteConfig } from '$lib/types';

	let { site }: { site: SiteConfig } = $props();

	$effect(() => {
		if (!browser || !site.analytics) return;
		const added: HTMLScriptElement[] = [];

		if (site.analytics.plausible) {
			const script = document.createElement('script');
			script.defer = true;
			script.setAttribute('data-domain', site.analytics.plausible);
			script.src = 'https://plausible.io/js/script.js';
			document.head.appendChild(script);
			added.push(script);
		}

		if (site.analytics.googleAnalytics) {
			const id = site.analytics.googleAnalytics;
			const loader = document.createElement('script');
			loader.async = true;
			loader.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
			document.head.appendChild(loader);
			added.push(loader);

			const inline = document.createElement('script');
			inline.textContent =
				`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
				`gtag('js',new Date());gtag('config','${id}');`;
			document.head.appendChild(inline);
			added.push(inline);
		}

		return () => {
			for (const script of added) script.remove();
		};
	});
</script>
