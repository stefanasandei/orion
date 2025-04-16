<script lang="ts">
	import FadeIn from './fade-in.svelte';
	import { Code, Database, Cpu, Zap, LineChart, ShieldCheck } from 'lucide-svelte';

	const cards = [
		{
			icon: Code,
			title: 'Modern Architecture',
			description:
				'Built with a microservices architecture using TypeScript, React, and Node.js for maximum flexibility and performance.'
		},
		{
			icon: Database,
			title: 'Intelligent Data Storage',
			description:
				'Multi-model database approach combining SQL and NoSQL solutions for optimized data access patterns.'
		},
		{
			icon: Cpu,
			title: 'AI-Powered Features',
			description:
				'Machine learning algorithms that analyze your data to provide actionable insights and automated workflows.'
		},
		{
			icon: Zap,
			title: 'Lightning Performance',
			description:
				'Global CDN, edge computing, and aggressive caching strategies ensure sub-100ms response times.'
		},
		{
			icon: LineChart,
			title: 'Real-time Analytics',
			description:
				'Live data processing with streaming ETL pipelines for immediate insights and reporting.'
		},
		{
			icon: ShieldCheck,
			title: 'Enterprise Security',
			description:
				'End-to-end encryption, continuous security monitoring, and compliance with global standards.'
		}
	];
</script>

<section
	id="tech-stack"
	class="section-padding from-tech-blue/5 to-tech-purple/5 dark:from-tech-blue/10 dark:to-tech-purple/10 bg-gradient-to-br via-background dark:via-background"
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

		<div class="grid gap-8 md:grid-cols-3">
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

			<div class="relative">
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
			</div>
		</div>
	</div>
</section>
