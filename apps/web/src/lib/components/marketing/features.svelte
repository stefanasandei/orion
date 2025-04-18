<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import {
		BrainCircuit,
		Check,
		Clock,
		Computer,
		Library,
		Notebook,
		Shield,
		Star,
		Users,
		Zap
	} from 'lucide-svelte';

	const features = [
		// TODO: redo pictures once the platform is done (dark mode btw)
		{
			id: 1,
			title: 'Projects',
			description: 'Organize your content',
			icon: Notebook,
			fullDescription:
				'You can create projects to organize your content. Each workspace has multiple projects, where you can write notes, upload documents and more.',
			imageSrc: '/images/editor.png'
		},
		{
			id: 2,
			title: 'Knowledge System',
			description: 'Build a second brain',
			icon: BrainCircuit,
			fullDescription:
				'The content you write will be indexed into your personal Knowledge System. You can query it, chat with it and use it to improve your workflows.',
			imageSrc: '/images/chat.png'
		},
		{
			id: 3,
			title: 'Developer friendly',
			description: 'Built for power users',
			icon: Computer,
			fullDescription:
				'We are developers too. We know how to build tools that are powerful and easy to use. You can use our API, CLI and more to integrate with your workflows.',
			imageSrc: '/images/project.png'
		},
		{
			id: 4,
			title: 'Community',
			description: 'Share and find interesting work',
			icon: Library,
			fullDescription:
				'You can choose to make your projects public. This way, you can share your work with the community and find interesting projects to follow.',
			imageSrc: '/images/browser.png'
		}
	];

	let activeFeatureIndex = $state(0);
	let progress = $state(0);

	let progressInterval = $state<NodeJS.Timeout>();
	let featureInterval = $state<NodeJS.Timeout>();

	const interval: number = 15000;

	onMount(() => {
		progressInterval = setInterval(() => {
			progress = (progress + 1) % 101;
		}, 150);

		featureInterval = setInterval(() => {
			activeFeatureIndex = (activeFeatureIndex + 1) % features.length;
			progress = 0;
		}, interval);
	});

	onDestroy(() => {
		clearInterval(progressInterval);
		clearInterval(featureInterval);
	});

	const selectFeature = (index: number) => {
		if (activeFeatureIndex == index) return;

		activeFeatureIndex = index;
		progress = 0;
	};
</script>

<section id="features" class="relative overflow-hidden py-20">
	<div
		class="absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-purple-500/5 opacity-20 blur-3xl"
	></div>
	<div
		class="bg-accent/5 absolute bottom-40 left-0 -z-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
	></div>

	<div class="container mx-auto flex flex-col px-4 md:px-6">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold md:text-4xl">Features That Feel Like Home</h2>
			<p class="text-muted-foreground mx-auto max-w-2xl text-lg">
				Our cozy platform provides all the tools you need in a comfortable, intuitive environment
			</p>
		</div>

		<div class="center mb-16 flex flex-col items-stretch justify-center gap-4 md:flex-row">
			{#each features as feature, index}
				<button
					class="border-muted bg-card relative w-full cursor-pointer overflow-hidden rounded-lg border p-5 text-left shadow-lg transition-all duration-300 hover:shadow-xl"
					onclick={() => selectFeature(index)}
				>
					<div class="flex items-start gap-4">
						<div class="bg-muted flex-shrink-0 rounded-md p-2.5">
							{#if feature.icon}
								<feature.icon class="size-4" />
							{/if}
						</div>
						<div>
							<h3 class="font-semibold">{feature.title}</h3>
							<p class="text-muted-foreground mt-1 text-sm">{feature.description}</p>
						</div>
					</div>

					{#if index === activeFeatureIndex}
						<div
							class="bg-primary absolute bottom-0 left-0 h-1 transition-all duration-75"
							style="width: {progress}%"
						></div>
					{/if}
				</button>
			{/each}
		</div>

		{#if features.length > 0}
			<div class="grid items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div in:fly={{ y: 20, duration: 300 }} out:fade>
					<h3 class="mb-4 text-2xl font-bold">{features[activeFeatureIndex].title}</h3>
					<p class="mb-6 text-lg">{features[activeFeatureIndex].fullDescription}</p>
					<ul class="space-y-3">
						<li class="flex items-start gap-2">
							<div class="bg-primary/10 mt-1 flex-shrink-0 rounded-full p-1">
								<Check class="text-primary h-3 w-3" />
							</div>
							<span class="text-muted-foreground">Simple and intuitive interface</span>
						</li>
						<li class="flex items-start gap-2">
							<div class="bg-primary/10 mt-1 flex-shrink-0 rounded-full p-1">
								<Check class="text-primary h-3 w-3" />
							</div>
							<span class="text-muted-foreground">Seamless integration with your workflow</span>
						</li>
						<li class="flex items-start gap-2">
							<div class="bg-primary/10 mt-1 flex-shrink-0 rounded-full p-1">
								<Check class="text-primary h-3 w-3" />
							</div>
							<span class="text-muted-foreground">Customizable to fit your specific needs</span>
						</li>
					</ul>
				</div>

				<div in:fly={{ y: 20, duration: 300 }} out:fade class="lg:col-span-2">
					<div class="border-ring overflow-hidden rounded-xl border-2 shadow-md">
						<img
							src={features[activeFeatureIndex].imageSrc}
							alt={features[activeFeatureIndex].title}
							class="h-auto w-full object-cover"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Add any additional styles here */
</style>
