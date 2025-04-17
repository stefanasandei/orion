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
			class="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-cozy-blue/10 via-transparent to-cozy-peach/10"
		></div>
		<div class="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-tech-purple/5 blur-3xl"></div>
		<div class="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl"></div>
	</div>

	<!-- Grid background layer -->
	<div class="absolute inset-0 bg-grid-white/[0.045]"></div>

	<div class="container relative z-10 mx-auto px-4 md:px-6">
		<div class="flex flex-col items-center space-y-8 text-center">
			<div>
				<a
					href="#faq"
					class="inline-flex items-center gap-2 rounded-full border border-ring bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
				>
					We're still in early development
					<!-- Introducing our agentic workflows -->
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
			</div>

			<div>
				<h1 class="max-w-3xl animate-moveUp text-4xl font-bold tracking-tighter md:text-6xl">
					✨ Learn anything ✨ <br />
					<span class="text-gradient">faster</span> and
					<span class="text-gradient">smarter</span>.
				</h1>
			</div>

			<div>
				<p class="max-w-2xl animate-moveUp text-pretty text-lg text-muted-foreground md:text-xl">
					Experience the perfect blend of power and simplicity. Our tools provide the best
					enviorment to learn academic subjects, passions or general knowledge.
				</p>
			</div>

			<div class="animate-moveUp">
				<div class="mt-8 flex flex-col gap-4 sm:flex-row">
					<Button size="lg" class="gap-2 px-8">
						Get Started <ArrowRight class="h-5 w-5" />
					</Button>
					<a href="#faq" class={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'px-8')}
						>Learn More</a
					>
				</div>
			</div>
		</div>
	</div>

	<div class="absolute bottom-0 left-0 z-0 h-full w-full animate-appear opacity-0">
		<Lights />
	</div>
</section>
