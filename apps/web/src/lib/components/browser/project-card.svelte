<script lang="ts">
	import type { Project } from '@repo/db';
	import * as Card from '@/components/ui/card';
	import ProjectInfoPills from '../project/project-info-pills.svelte';
	import { cn } from '../../utils/cn';

	interface ProjectWithMetadata extends Project {
		user: {
			metadata: {
				name: string;
			};
		};
	}

	interface Props {
		large?: boolean;
		project: ProjectWithMetadata;
	}

	const { project, large = false }: Props = $props();

	// it might not be the best code
	// but the deadline is approaching fast
	const name = (() => {
		if (!large) {
			return project.name.length > 30 ? project.name.substring(0, 30) + '...' : project.name;
		}
		return project.name;
	})();

	const description = (() => {
		if (!large) {
			return project.description!.length > 50
				? project.name.substring(0, 50) + '...'
				: project.description;
		}
		return project.description!.length > 250
			? project.name.substring(0, 250) + '...'
			: project.description;
	})();
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
				<Card.Title>{name}</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>
					{description}
				</p>
			</Card.Content>
		</div>
		<Card.Footer>
			<ProjectInfoPills
				{project}
				col={!large}
				notesCount={0}
				authorName={project.user.metadata.name}
			/>
		</Card.Footer>
	</Card.Root>
</a>
