<script>
	import Seo from '@/components/seo.svelte';
	import MainNav from '@/components/main-nav.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@repo/tailwind';

	const config = {
		siteName: 'Orion',
		navItems: [
			{ title: 'Home', href: '/' },
			{ title: 'About', href: '/about' },
			{ title: 'Contact', href: '/contact' }
		]
	};
</script>

<Seo title="Home" description="Landing page" />

<header class="bg-muted z-40 mx-1 rounded-b-3xl md:mx-auto md:w-[65vw]">
	<div class="container flex h-20 items-center justify-between py-6">
		<MainNav items={config.navItems} name={config.siteName} />

		<nav>
			<a href="/login" class={cn(buttonVariants({ variant: 'muted', size: 'sm' }), 'px-4')}>
				Login
			</a>
			<a href="/register" class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'px-4')}>
				Get Started
			</a>
		</nav>
	</div>
</header>

<main class="flex-1">
	<slot />
</main>
