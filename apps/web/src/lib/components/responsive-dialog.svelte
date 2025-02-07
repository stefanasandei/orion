<script>
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

	const { triggerButton, title, description, children } = $props();

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#if isDesktop.current}
	<Dialog bind:open>
		<DialogTrigger asChild>{@render triggerButton()}</DialogTrigger>
		<DialogContent class="flex h-[70vh] flex-col gap-6 sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			{@render children?.()}
		</DialogContent>
	</Dialog>
{:else}
	<Drawer bind:open>
		<DrawerTrigger asChild>{@render triggerButton()}</DrawerTrigger>
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
					<Button variant="outline">Cancel</Button>
				</DrawerClose>
			</DrawerFooter>
		</DrawerContent>
	</Drawer>
{/if}
