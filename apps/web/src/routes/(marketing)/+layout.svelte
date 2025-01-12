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

<div>
	<header class="bg-background container z-40">
		<div class="flex h-20 items-center justify-between py-6">
			<MainNav items={config.navItems} name={config.siteName} />
			<nav>
				<a href="/login" class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}>
					Login
				</a>
			</nav>
		</div>
	</header>

	<main class="flex-1"><slot /></main>
</div>
