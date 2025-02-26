<script lang="ts">
	import type { Project } from '@repo/db';
	import * as Card from '@/components/ui/card';
	import ProjectInfoPills from '../project/project-info-pills.svelte';

	interface Props {
		project: Project & { notesCount: number };
	}

	const { project }: Props = $props();
</script>

<a href={`/browse/project/${project.id}`}>
	<Card.Root
		class="hover:bg-card/30 hover:ring-secondary flex h-72 flex-col justify-between transition-all hover:cursor-pointer hover:ring-1 md:w-80"
	>
		<div>
			<Card.Header>
				<Card.Title>{project.name}</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>{project.description}</p>
			</Card.Content>
		</div>
		<Card.Footer>
			<ProjectInfoPills {project} notesCount={project.notesCount} />
		</Card.Footer>
	</Card.Root>
</a>
