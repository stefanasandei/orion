<script lang="ts">
	import type { Note } from '@repo/db';
	import ResponsiveDialog from '../responsive-dialog.svelte';
	import * as Card from '@/components/ui/card';
	import { Button } from '../ui/button';
	import { trpc } from '../../utils/trpc/client';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { cn } from '../../utils/cn';

	interface Props {
		thought: {
			id: number;
			name: string;
			createdAt: Date;
		};
		squared?: boolean;
	}

	const { thought, squared = false }: Props = $props();

	const deleteNote = trpc().project.deleteNote.createMutation({
		onSuccess: async () => {
			toast('Thought deleted!');
			await invalidateAll();
		}
	});
</script>

<ResponsiveDialog class="" title={thought.createdAt.toDateString()} description="">
	{#snippet triggerButton()}
		<Card.Root
			class={cn(
				'ring-secondary/70 hover:bg-muted/65 mt-2 flex shrink-0 snap-start flex-col justify-between gap-6 ring-2 transition-all duration-75',
				squared ? 'size-64' : 'h-full w-64'
			)}
		>
			<Card.Header>
				<Card.Title class="hidden text-left md:block">{thought.name.substring(0, 50)}</Card.Title>
				<Card.Description class="text-left md:hidden"
					>{thought.name.substring(0, 50)}</Card.Description
				>
			</Card.Header>

			<Card.Footer>
				<p>{thought.createdAt.toDateString()}</p>
			</Card.Footer>
		</Card.Root>
	{/snippet}

	<div class="flex h-full flex-col justify-between">
		<p>{thought.name}</p>

		<Button
			variant={'destructive'}
			onclick={() =>
				$deleteNote.mutate({
					noteId: thought.id
				})}>Delete</Button
		>
	</div>
</ResponsiveDialog>
