<script>
	import Seo from '@/components/seo.svelte';
	import MainNav from '@/components/main-nav.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@repo/tailwind';
	import { t } from '@/utils/i18n/translations';
	import Footer from './footer.svelte';
	import '../../../landing.css';

	const config = {
		siteName: 'Orion',
		navItems: [
			// { title: $t('marketing.home'), href: '/' },
			{ title: $t('marketing.about'), href: '/about' },
			{ title: $t('marketing.contact'), href: '/contact' }
		]
	};
</script>

<Seo title="Home" description="Landing page" />

<div class="flex min-h-screen flex-col overflow-x-hidden bg-[#030712] text-[#f9fafb]">
	<NavigationBar />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>

{#snippet NavigationBar()}
	<header
		class="fixed inset-x-0 top-0 z-50 mx-5 rounded-b-3xl bg-background/75 ring-2 ring-ring backdrop-blur-lg md:mx-auto md:w-[80vw]"
	>
		<div class="container flex h-14 items-center justify-between py-6">
			<MainNav items={config.navItems} name={config.siteName} />

			<nav class="flex items-center gap-4">
				<a href="/login" class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'px-4')}>
					{$t('auth.login')}
				</a>
				<a href="/register" class={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'px-4')}>
					{$t('auth.register')}
				</a>
			</nav>
		</div>
	</header>
{/snippet}
