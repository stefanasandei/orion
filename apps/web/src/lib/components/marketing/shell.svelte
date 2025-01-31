<script>
	import Seo from '@/components/seo.svelte';
	import MainNav from '@/components/main-nav.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@repo/tailwind';
	import { t } from '@/utils/i18n/translations';

	const config = {
		siteName: 'Orion',
		navItems: [
			{ title: $t('marketing.home'), href: '/' },
			{ title: $t('marketing.about'), href: '/about' },
			{ title: $t('marketing.contact'), href: '/contact' }
		]
	};
</script>

<Seo title="Home" description="Landing page" />

<header
	class="bg-background ring-ring sticky top-0 z-50 mx-1 rounded-b-3xl ring-2 backdrop-blur-lg md:mx-auto md:w-[65vw]"
>
	<div class="container flex h-20 items-center justify-between py-6">
		<MainNav items={config.navItems} name={config.siteName} />

		<nav class="flex items-center gap-4">
			<a href="/login" class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}>
				{$t('auth.login')}
			</a>
			<a href="/register" class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'px-4')}>
				{$t('auth.register')}
			</a>
		</nav>
	</div>
</header>

<main class="flex-1">
	<slot />
</main>
