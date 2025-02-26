<script lang="ts">
	import type { Project } from '@repo/db';
	import * as Card from '@/components/ui/card';
	import ProjectInfoPills from '../project/project-info-pills.svelte';
	import { cn } from '../../utils/cn';

	interface Props {
		large?: boolean;
		project: Project & { notesCount: number; user: { metadata: { name: string } } };
	}

	const { project, large = false }: Props = $props();
</script>

<a href={`/browse/project/${project.id}`}>
	<Card.Root
		class={cn(
			'hover:bg-card/30 hover:ring-secondary flex h-72 flex-col justify-between transition-all hover:cursor-pointer hover:ring-2',
			large ? 'w-full' : 'md:w-80'
		)}
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
			<ProjectInfoPills
				{project}
				col={true}
				notesCount={project.notesCount}
				authorName={project.user.metadata.name}
			/>
		</Card.Footer>
	</Card.Root>
</a>
