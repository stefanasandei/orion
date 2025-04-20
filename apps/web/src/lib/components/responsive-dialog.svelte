<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { Button } from '@/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '@/components/ui/dialog';
	import {
		Drawer,
		DrawerClose,
		DrawerContent,
		DrawerDescription,
		DrawerFooter,
		DrawerHeader,
		DrawerTitle,
		DrawerTrigger
	} from '@/components/ui/drawer';
	import { cn } from '../utils/cn';

	let {
		triggerButton,
		title,
		description,
		class: className,
		children,
		open = $bindable(false),
		hasTrigger = true
	} = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#if isDesktop.current}
	<Dialog bind:open>
		{#if hasTrigger}
			<DialogTrigger class="h-full w-full" asChild>{@render triggerButton()}</DialogTrigger>
		{/if}
		<DialogContent class={className ? className : 'flex h-[70vh] flex-col gap-6 sm:max-w-[425px]'}>
			<!-- <DialogContent class={cn('flex h-[70vh] flex-col gap-6 sm:max-w-[425px]', className)}> -->
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			{@render children?.()}
		</DialogContent>
	</Dialog>
{:else}
	<Drawer bind:open>
		{#if hasTrigger}
			<DrawerTrigger asChild>{@render triggerButton()}</DrawerTrigger>
		{/if}
		<DrawerContent class="h-[80svh]">
			<DrawerHeader class="text-left">
				<DrawerTitle>{title}</DrawerTitle>
				<DrawerDescription>{description}</DrawerDescription>
			</DrawerHeader>
			<div class="h-full px-4">
				{@render children?.()}
			</div>
			<DrawerFooter class="pt-2">
				<DrawerClose asChild>
					<Button variant="outline" class="w-full">Cancel</Button>
				</DrawerClose>
			</DrawerFooter>
		</DrawerContent>
	</Drawer>
{/if}
