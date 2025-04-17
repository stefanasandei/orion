<script lang="ts">
	import { Button } from '../ui/button';
	import FadeIn from './fade-in.svelte';
	import { Code, Database, Cpu, Zap, LineChart, ShieldCheck, Sparkles } from 'lucide-svelte';

	const cards = [
		{
			icon: Code,
			title: 'Modern Architecture',
			description:
				'Built with a microservices architecture using TypeScript, SvelteKit and tRPC for maximum flexibility and performance. Deploy using Docker Compose.'
		},
		{
			icon: Database,
			title: 'Intelligent Data Storage',
			description:
				'Multi-model database approach combining relational (PostgreSQL), vector (Pinecone) and caching (Redis) solutions for optimized data access patterns.'
		},
		{
			icon: Sparkles,
			title: 'Agentic tools',
			description:
				'Our interface is natually integrated with agentic tools to improve your workflows. Benefit from AI, without the struggle.'
		},
		{
			icon: Zap,
			title: 'Lightning Performance',
			description:
				'Optimized queries, edge computing, and aggressive caching strategies ensure optimal response times.'
		}
	];
</script>

<section
	id="tech-stack"
	class="section-padding bg-gradient-to-br from-tech-blue/5 via-background to-tech-purple/5 dark:from-tech-blue/10 dark:via-background dark:to-tech-purple/10"
>
	<div class="container mx-auto px-4 md:px-6">
		<div>
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold md:text-4xl">Powered by Advanced Technology</h2>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Our platform is built on a foundation of cutting-edge technologies to deliver unmatched
					performance
				</p>
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<div class="grid gap-6 sm:grid-cols-2 md:col-span-2">
				{#each cards as feature, index}
					<FadeIn delay={index * 0.1}>
						<div class="card-shadow h-full rounded-xl border border-border bg-card p-6">
							<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
								<feature.icon class="size-6" />
							</div>
							<h3 class="mb-2 text-lg font-semibold">{feature.title}</h3>
							<p class="text-muted-foreground">{feature.description}</p>
						</div>
					</FadeIn>
				{/each}
			</div>

			<!-- <div class="relative">
				<div class="relative flex h-full flex-col items-center justify-center p-8 text-center">
					<div class="mb-4 rounded-full bg-primary/20 px-3 py-1 font-mono text-xs text-primary">
						System Architecture
					</div>
					<div class="mb-6">
						<pre
							class="inline-block rounded-lg border border-border bg-card p-4 text-left font-mono text-xs shadow-sm">
                  <code class="text-foreground/90"
								>{`
import { createApp } from 'core';

const app = createApp({
  ai: true,
  security: 'enterprise',
  scaling: 'auto',
  realtime: true
});

app.deploy();`}</code
							>
                </pre>
					</div>
					<p class="text-sm text-muted-foreground">
						Our modular architecture allows for rapid development and seamless scaling
					</p>
				</div>
			</div> -->
		</div>
	</div>
</section>
