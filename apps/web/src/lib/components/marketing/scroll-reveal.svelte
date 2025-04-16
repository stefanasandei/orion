<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { tick } from 'svelte';

	let delay = $state(0);
	let offset = $state(0.2);
	let direction = $state<'up' | 'down' | 'left' | 'right'>('up');
	let className = $state('');

	let visible = $state(false);
	let element = $state<HTMLDivElement>();

	const getFlyParams = () => {
		const base = { delay: delay * 1000, duration: 600, opacity: 0 };

		switch (direction) {
			case 'up':
				return { ...base, y: 50 };
			case 'down':
				return { ...base, y: -50 };
			case 'left':
				return { ...base, x: 50 };
			case 'right':
				return { ...base, x: -50 };
			default:
				return { ...base, y: 50 };
		}
	};

	onMount(async () => {
		await tick();
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: offset }
		);

		if (element) observer.observe(element);
	});
</script>

<div bind:this={element} class={className}>
	{#if visible}
		<div in:fly={getFlyParams()}>
			<slot />
		</div>
	{/if}
</div>
