<script>
	import { Icons } from '@/components/icons.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils/cn';
</script>

<div class="relative flex min-h-screen">
	<!-- background rounded rectangles -->
	<section class="absolute inset-0 bottom-0 mt-4 hidden h-[90vh] grid-cols-12 md:grid">
		<div class="bg-muted col-span-2 mx-3 rounded-3xl ring-2 ring-gray-200"></div>
		<div class="bg-muted col-span-8 mx-2 rounded-3xl ring-2 ring-gray-200"></div>
		<div class="bg-muted col-span-2 mx-3 rounded-3xl ring-2 ring-gray-200"></div>
	</section>

	<main class="flex-1">
		<!-- landing hero section -->
		<section class="relative z-10 h-[92vh] space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
			<div class="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
				<a
					href={'#'}
					class="ring-primary flex flex-row items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium ring-2"
					target="_blank"
				>
					<span>Read latest updatest</span>
					<span class="inline"><Icons.arrowRight /></span>
				</a>
				<h1 class="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
					✨ Learn anything ✨ <br /> faster and smarter.
				</h1>
				<p class="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
					Experience the perfect blend of power and simplicity. Our tools provide the best
					enviorment to learn academic subjects, passions or general knowledge.
				</p>
				<div class="space-x-4">
					<a href="/register" class={cn(buttonVariants({ size: 'lg' }))}> Get Started </a>
					<a
						href={'#'}
						target="_blank"
						rel="noreferrer"
						class={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
					>
						GitHub
					</a>
				</div>
			</div>
		</section>
	</main>
</div>
