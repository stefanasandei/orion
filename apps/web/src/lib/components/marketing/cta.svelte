<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { Button, buttonVariants } from '../ui/button';
	import { cn } from '../../utils/cn';
</script>

<section class="section-padding bg-gradient-to-br from-tech-purple/5 via-transparent to-accent/5">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">
				Ready to
				<span class="text-gradient-cool">Accelerate</span>
				your Learning Experience?
			</h2>
			<p class="mb-8 text-lg text-muted-foreground">
				Do the work you love, but faster and more efficiently. Your content will be automatically
				organized, indexed and ingested into our Agentic Knowledge System. Remove the friction.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a href="/register" class={cn('gap-2 px-8 text-lg', buttonVariants({ size: 'lg' }))}>
					Get Started <ArrowRight class="h-5 w-5" />
				</a>
				<Button size="lg" variant="outline" disabled={true} class="px-8 text-lg"
					>Self Host Guide</Button
				>
			</div>
			<p class="mt-6 text-sm text-muted-foreground">No credit card required.</p>
		</div>
	</div>
</section>
