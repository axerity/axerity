<script lang="ts">
	import DynamicIcon from '$lib/components/DynamicIcon.svelte';

	let {
		icon,
		size = 16,
		color,
		class: className = ''
	}: { icon: string; size?: number; color?: string; class?: string } = $props();
</script>

<span
	class="inline-icon inline-flex align-middle {className}"
	style={color ? `color: ${color};` : undefined}
>
	<DynamicIcon name={icon} {size} />
</span>
