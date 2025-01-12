<script lang="ts">
	import { cn } from '@repo/tailwind';
	import { page } from '$app/state';
	import { Icons } from '@/components/icons.svelte';
	import MobileNav from '@/components/mobile-nav.svelte';

	interface Props {
		name: string;
		items: {
			disabled?: boolean;
			href: string;
			title: string;
		}[];
	}

	let { name, items }: Props = $props();

	let showMobileMenu = $state(false);
</script>

<div class="flex gap-6 md:gap-10">
	<!-- logo + name (left side) -->
	<a href="/" class="hidden items-center space-x-2 md:flex">
		<Icons.logo />
		<span class="hidden font-bold sm:inline-block">
			{name}
		</span>
	</a>

	<!-- desktop menu items -->
	<nav class="hidden gap-6 md:flex">
		{#each items as item}
			<a
				href={item.disabled ? '#' : item.href}
				class={cn(
					'hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm',
					item.href.startsWith(`/${page.route}`) ? 'text-foreground' : 'text-foreground/60',
					item.disabled && 'cursor-not-allowed opacity-80'
				)}
			>
				{item.title}
			</a>
		{/each}
	</nav>

	<!-- mobile navigaruion menu -->
	<button
		class="flex items-center space-x-2 md:hidden"
		onclick={() => (showMobileMenu = !showMobileMenu)}
	>
		{#if showMobileMenu}
			<Icons.close />
		{:else}
			<Icons.logo />
		{/if}
		<span class="font-bold">Menu</span>
	</button>

	{#if showMobileMenu}
		<MobileNav {items} {name} />
	{/if}
</div>
