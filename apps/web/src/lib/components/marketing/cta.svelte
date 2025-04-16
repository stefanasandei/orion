<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { Button } from '../ui/button';
</script>

<section class="section-padding from-tech-purple/5 bg-gradient-to-br via-transparent to-accent/5">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">
				Ready to Make Your Workflow More Comfortable?
			</h2>
			<p class="mb-8 text-lg text-muted-foreground">
				Join thousands of teams who have transformed their work experience with our cozy platform.
				Start your free trial today and feel the difference.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button size="lg" class="gap-2 px-8 text-lg">
					Start Free Trial <ArrowRight class="h-5 w-5" />
				</Button>
				<Button size="lg" variant="outline" class="px-8 text-lg">Self Host Guide</Button>
			</div>
			<p class="mt-6 text-sm text-muted-foreground">No credit card required. 14-day free trial.</p>
		</div>
	</div>
</section>
