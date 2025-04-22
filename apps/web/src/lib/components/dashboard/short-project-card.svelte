<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import type { Project } from '@repo/db';
	import Tag from './tag.svelte';

	const { project }: { project: Project & { tags: { tagId: number; tag: { name: string } }[] } } =
		$props();
</script>

<a href={`/projects/${project.id}`}>
	<Card.Root class="bg-card hover:bg-muted/50 transition-colors duration-75">
		<Card.Content class="flex flex-col gap-4 p-4">
			<div class="flex flex-row items-start justify-between">
				<div class="space-y-2">
					<h3 class="text-xl font-semibold tracking-tight">{project.name}</h3>
					{#if project.description}
						<p class="text-muted-foreground line-clamp-2 text-sm">{project.description}</p>
					{/if}
				</div>
				<Badge variant="default">Project</Badge>
			</div>

			<div class="flex items-center gap-2">
				<div class="flex flex-wrap gap-1">
					{#each project.tags as tag}
						<Tag name={tag.tag.name} id={tag.tagId} />
					{/each}
				</div>

				<span class="text-muted-foreground ml-auto text-sm">
					{new Date(project.createdAt).toLocaleDateString()}
				</span>
			</div>
		</Card.Content>
	</Card.Root>
</a>
