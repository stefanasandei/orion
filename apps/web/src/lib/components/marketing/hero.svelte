<script>
	import { Button, buttonVariants } from '@/components/ui/button';
	import { t } from '@/utils/i18n/translations';
	import { ArrowRight } from 'lucide-svelte';
	import Lights from './lights.svelte';
	import { cn } from '../../utils/cn';
</script>

<section class="relative flex min-h-screen flex-col justify-center overflow-hidden">
	<!-- Existing gradient backgrounds -->
	<div class="absolute inset-0">
		<div
			class="from-cozy-blue/10 to-cozy-peach/10 absolute left-0 top-0 h-full w-full bg-gradient-to-br via-transparent"
		></div>
		<div class="bg-tech-purple/5 absolute -left-20 top-1/3 h-64 w-64 rounded-full blur-3xl"></div>
		<div class="bg-accent/5 absolute bottom-1/4 right-0 h-80 w-80 rounded-full blur-3xl"></div>
	</div>

	<!-- Grid background layer -->
	<div class="bg-grid-white/[0.045] absolute inset-0"></div>

	<div class="container relative z-10 mx-auto px-4 md:px-6">
		<div class="flex flex-col items-center space-y-8 text-center">
			<div>
				<a
					href="#faq"
					class="border-ring bg-background text-foreground hover:bg-accent/80 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
				>
					We're still in early development
					<!-- Introducing our agentic workflows -->
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
			</div>

			<div>
				<h1 class="animate-moveUp max-w-3xl text-3xl font-bold tracking-tighter md:text-6xl">
					✨ Learn anything ✨ <br />
					<span class="text-gradient">faster</span> and
					<span class="text-gradient">smarter</span>.
				</h1>
			</div>

			<div>
				<p
					class="animate-moveUp text-muted-foreground max-w-2xl text-balance text-lg md:text-pretty md:text-xl"
				>
					Experience the perfect blend of power and simplicity. Our tools provide the best
					enviorment to learn academic subjects, passions or general knowledge.
				</p>
			</div>

			<div class="animate-moveUp">
				<div class="mt-8 flex flex-col gap-4 sm:flex-row">
					<a href="/register" class={cn('gap-2 px-8 text-lg', buttonVariants({ size: 'lg' }))}>
						Get Started <ArrowRight class="h-5 w-5" />
					</a>
					<a href="#faq" class={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'px-8')}
						>Learn More</a
					>
				</div>
			</div>
		</div>
	</div>

	<div class="animate-appear absolute bottom-0 left-0 z-0 h-full w-full opacity-0">
		<Lights />
	</div>
</section>
