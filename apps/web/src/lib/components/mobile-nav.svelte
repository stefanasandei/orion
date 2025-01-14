<script lang="ts">
	import { cn } from '@repo/tailwind';
	import { Icons } from '@/components/icons.svelte';

	interface Props {
		name: string;
		items: {
			disabled?: boolean;
			href: string;
			title: string;
		}[];
	}

	let { name, items }: Props = $props();
</script>

<div
	class={cn(
		'animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden'
	)}
>
	<div class="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md p-4 shadow-md">
		<a href="/" class="flex items-center space-x-2">
			<span class="text-primary">
				<Icons.logo />
			</span>
			<span class="font-bold">{name}</span>
		</a>
		<nav class="grid grid-flow-row auto-rows-max text-sm">
			{#each items as item}
				<a
					href={item.disabled ? '#' : item.href}
					class={cn(
						'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
						item.disabled && 'cursor-not-allowed opacity-60'
					)}
				>
					{item.title}
				</a>
			{/each}
		</nav>
	</div>
</div>
