<script lang="ts">
	import { getContext, onDestroy, untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import { API, type ApiContext } from './api-context';

	let { title = 'Response', children }: { title?: string; children: Snippet } = $props();

	const api = getContext<ApiContext>(API);
	const id = untrack(() => api.registerExample({ title, kind: 'response', snippet: children }));
	onDestroy(() => api.unregisterExample(id));
</script>
