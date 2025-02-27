<script lang="ts">
	import type { Note } from '@repo/db';
	import ResponsiveDialog from '../responsive-dialog.svelte';
	import * as Card from '@/components/ui/card';
	import { Button } from '../ui/button';
	import { trpc } from '../../utils/trpc/client';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	interface Props {
		thought: Note;
	}

	const { thought }: Props = $props();

	const deleteNote = trpc().project.deleteNote.createMutation({
		onSuccess: async () => {
			toast('Thought deleted!');
			await invalidateAll();
		}
	});
</script>

<ResponsiveDialog title={thought.createdAt.toDateString()} description="">
	{#snippet triggerButton()}
		<Card.Root class="flex h-full w-64 shrink-0 snap-start flex-col justify-between gap-6">
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
