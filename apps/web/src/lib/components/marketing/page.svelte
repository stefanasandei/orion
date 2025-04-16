<script>
	import { Icons } from '@/components/icons.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils/cn';
	import { t } from '@/utils/i18n/translations';
</script>

<div class="relative flex min-h-screen">
	<!-- background rounded rectangles -->
	<section class="absolute inset-0 bottom-0 mt-4 hidden h-[90vh] grid-cols-12 md:grid">
		<div class="col-span-2 mx-3 rounded-3xl bg-background ring-2 ring-ring"></div>
		<div class="col-span-8 mx-2 rounded-3xl bg-background ring-2 ring-ring"></div>
		<div class="col-span-2 mx-3 rounded-3xl bg-background ring-2 ring-ring"></div>
	</section>

	<main class="flex-1">
		<!-- landing hero section -->
		<section class="relative z-10 h-[92vh] space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
			<div class="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
				<a
					href={'#'}
					class="flex flex-row items-center gap-2 rounded-full bg-background px-4 py-1.5 text-sm font-medium text-foreground ring-2 ring-primary transition-all hover:bg-background/40"
					target="_blank"
				>
					<span>{$t('marketing.updates')}</span>
					<span class="inline"><Icons.arrowRight /></span>
				</a>
				<h1 class="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
					✨ {$t('marketing.slogan_short_p1')} ✨ <br />
					{$t('marketing.slogan_short_p2')}.
				</h1>
				<p class="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
					{$t('marketing.slogan_long')}
				</p>
				<div class="space-x-4">
					<a href="/register" class={cn(buttonVariants({ size: 'lg' }))}
						>{$t('marketing.get_started')}</a
					>
					<a
						href={'#'}
						target="_blank"
						rel="noreferrer"
						class={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
					>
						GitHub
					</a>
				</div>
			</div>
		</section>
	</main>
</div>
