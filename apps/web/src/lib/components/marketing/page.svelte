<script>
	import { Icons } from '@/components/icons.svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils/cn';
	import { t } from '@/utils/i18n/translations';
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="relative flex min-h-screen flex-col justify-center overflow-hidden">
	<div class="absolute inset-0">
		<div
			class="from-cozy-blue/10 to-cozy-peach/10 absolute left-0 top-0 h-full w-full bg-gradient-to-br via-transparent"
		></div>
		<div class="bg-tech-purple/5 absolute -left-20 top-1/3 h-64 w-64 rounded-full blur-3xl"></div>
		<div class="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl"></div>
	</div>

	<div class="container relative z-10 mx-auto px-4 md:px-6">
		<div class="flex flex-col items-center space-y-8 text-center">
			<div>
				<a
					href="#"
					class="inline-flex items-center gap-2 rounded-full border border-ring bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
				>
					Introducing our tech SaaS platform
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
			</div>

			<div>
				<h1 class="max-w-3xl text-4xl font-bold tracking-tighter md:text-6xl">
					Make your workflow <span class="text-gradient">comfortable</span> and
					<span class="text-gradient">productive</span>
				</h1>
			</div>

			<div>
				<p class="max-w-2xl text-lg text-muted-foreground md:text-xl">
					We've created a warm, inviting platform that makes your work feel like home. Increase
					productivity without sacrificing comfort.
				</p>
			</div>

			<div>
				<div class="mt-8 flex flex-col gap-4 sm:flex-row">
					<Button size="lg" class="gap-2 px-8">
						Get Started <ArrowRight class="h-5 w-5" />
					</Button>
					<Button size="lg" variant="outline" class="px-8">Learn More</Button>
				</div>
			</div>
		</div>
	</div>
</section>
