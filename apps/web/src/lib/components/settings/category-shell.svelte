<script lang="ts">
	import { Separator } from '@/components/ui/separator';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children: Snippet;
	}

	const { title, description, children } = $props();
</script>

<div class="mx-auto w-full space-y-6 md:max-w-[60%]">
	<div>
		<h3 class="mb-3 text-4xl font-medium">{title}</h3>
		<p class="text-muted-foreground text-md">{description}</p>
	</div>
	<Separator />
	{@render children?.()}
</div>
