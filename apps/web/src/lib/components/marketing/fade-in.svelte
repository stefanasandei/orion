<script>
	import { fade } from 'svelte/transition';
	export let delay = 0;
	export let className = '';
</script>

<div in:fade={{ delay: delay * 1000, duration: 600 }} class={className}>
	<slot />
</div>
