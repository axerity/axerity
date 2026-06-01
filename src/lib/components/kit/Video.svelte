<script lang="ts">
	let { src, title = 'Video', poster }: { src: string; title?: string; poster?: string } = $props();

	const FILE_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

	function parseUrl(input: string): URL | null {
		try {
			return new URL(input);
		} catch {
			return null;
		}
	}

	function youtubeId(input: string): string | null {
		if (/^[\w-]{11}$/.test(input)) return input;
		const url = parseUrl(input);
		if (!url) return null;
		if (url.hostname.includes('youtu.be')) return url.pathname.slice(1) || null;
		const v = url.searchParams.get('v');
		if (v) return v;
		const parts = url.pathname.split('/');
		const embedIndex = parts.indexOf('embed');
		if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];
		return null;
	}

	function vimeoId(input: string): string | null {
		const url = parseUrl(input);
		if (!url || !url.hostname.includes('vimeo')) return null;
		const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
		return match ? match[1] : null;
	}

	const resolved = $derived.by(() => {
		if (FILE_RE.test(src)) return { kind: 'file' as const, url: src };

		const yt = youtubeId(src);
		if (yt) return { kind: 'embed' as const, url: `https://www.youtube-nocookie.com/embed/${yt}` };

		const vimeo = vimeoId(src);
		if (vimeo) return { kind: 'embed' as const, url: `https://player.vimeo.com/video/${vimeo}` };

		return { kind: 'embed' as const, url: src };
	});
</script>

<div
	class="video my-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-black"
>
	{#if resolved.kind === 'file'}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video src={resolved.url} {poster} {title} class="h-full w-full" controls playsinline></video>
	{:else}
		<iframe
			{title}
			src={resolved.url}
			class="h-full w-full"
			loading="lazy"
			referrerpolicy="strict-origin-when-cross-origin"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		></iframe>
	{/if}
</div>
