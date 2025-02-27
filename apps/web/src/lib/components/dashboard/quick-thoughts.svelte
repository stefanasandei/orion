<script lang="ts">
	import type { Note } from '@repo/db';
	import { Input } from '../ui/input';
	import { Separator } from '../ui/separator';
	import { trpc } from '../../utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '../ui/button';

	interface Props {
		thoughts: Note[];
	}

	const { thoughts }: Props = $props();

	let newThought = $state('');

	const addNewThought = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			newThought = '';
			toast.success('Thought added! 😊');
			await invalidateAll();
		}
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && newThought.trim().length > 0) {
			$addNewThought.mutate({
				content: newThought,
				type: 'thought'
			});
		}
	};
</script>

<div
	class="border-muted bg-card hover:bg-card/10 flex h-80 flex-col gap-4 rounded-lg border-2 p-3 transition-all"
>
	<div>
		<div class="mb-2 flex flex-row justify-between gap-2">
			<p class="text-2xl">Quick thoughts</p>

			<div class="flex flex-row gap-2">
				<Input
					class="w-fit"
					placeholder="write something..."
					bind:value={newThought}
					onkeydown={handleKeydown}
				/>
				<Button
					onclick={() => {
						if (newThought.trim().length > 0) {
							$addNewThought.mutate({
								content: newThought,
								type: 'thought'
							});
						}
					}}>Add</Button
				>
			</div>
		</div>
		<Separator />
	</div>

	<div class="flex h-full gap-4 overflow-x-auto pb-4">
		{#each thoughts as thought}
			<!-- TODO -->
			<div
				class="bg-muted flex h-full w-52 shrink-0 snap-start items-center justify-center rounded-lg"
			>
				<p>{thought.name}</p>
			</div>
		{/each}
	</div>
</div>
