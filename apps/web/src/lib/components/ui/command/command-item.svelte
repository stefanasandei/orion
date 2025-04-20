<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '@/utils/cn';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.ItemProps = $props();
</script>

<CommandPrimitive.Item
	class={cn(
		'aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-base outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 md:text-lg [&_svg]:pointer-events-none [&_svg]:mr-2 [&_svg]:size-4 [&_svg]:shrink-0 md:[&_svg]:size-6',
		className
	)}
	bind:ref
	{...restProps}
/>
