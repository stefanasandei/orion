<script lang="ts">
	import { Icons } from '@/components/icons.svelte';
	import MobileNav from '@/components/mobile-nav.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import Logo from '@/components/logo.svelte';

	interface Props {
		name: string;
		items: {
			href: string;
			title: string;
		}[];
	}

	let { name, items }: Props = $props();

	let showMobileMenu = $state(false);

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}
</script>

<div class="flex gap-6 md:gap-10">
	<!-- logo + name (left side) -->
	<div class="hidden md:flex">
		<Logo />
	</div>

	<!-- desktop menu items -->
	<nav class="hidden gap-6 md:flex">
		{#each items as item}
			<a href={item.href} class={buttonVariants({ variant: 'muted', size: 'sm' })}>
				{item.title}
			</a>
		{/each}
	</nav>

	<!-- mobile navigaruion menu -->
	<button class="z-50 flex items-center space-x-2 md:hidden" onclick={toggleMobileMenu}>
		{#if showMobileMenu}
			<Icons.close />
		{:else}
			<span class="text-primary">
				<Icons.logo />
			</span>
		{/if}
		<span class="font-bold">Menu</span>
	</button>

	{#if showMobileMenu}
		<MobileNav {items} {name} />
	{/if}
</div>
