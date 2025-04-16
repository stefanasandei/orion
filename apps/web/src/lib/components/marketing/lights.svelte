<script lang="ts">
	import { cn } from '@/utils/cn';

	type Direction = 'top' | 'bottom';

	// Export the 'direction' property
	export let direction: Direction = 'bottom';

	let className: any = '';

	export { className as class };

	// Reactive variables to adjust gradient and position based on direction
	$: gradientDirection = direction === 'top' ? '0deg' : '180deg';
	$: positionClass = direction === 'top' ? 'top-[-200px]' : 'bottom-[-200px]';
</script>

<div class={cn('h-full w-full overflow-hidden', className)}>
	<div
		style={`background: conic-gradient(from ${gradientDirection} at 50% 50%, hsl(var(--primary)) 0deg, hsl(var(--primary)) 180deg, hsl(var(--primary)) 1turn); filter: blur(75px); opacity: 20%;`}
		class={`relative h-full w-full ${positionClass}`}
	></div>
</div>
