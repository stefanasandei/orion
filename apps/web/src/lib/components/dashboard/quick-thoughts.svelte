<script lang="ts">
	import type { Note } from '@repo/db';
	import { Input } from '../ui/input';
	import { Separator } from '../ui/separator';
	import { trpc } from '../../utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '../ui/button';
	import ThoughtCard from './thought-card.svelte';

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
	class="border-muted bg-card flex h-80 w-full flex-col gap-4 overflow-hidden rounded-lg border-2 p-3 transition-all"
>
	<div>
		<div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
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

	<div
		class="mx-auto flex h-full max-w-xs touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-3 pb-4 md:-mx-3 md:w-full lg:max-w-full"
	>
		{#each thoughts as thought}
			<div class="flex h-full w-64 shrink-0 snap-start flex-col justify-between gap-6 pl-3">
				<ThoughtCard {thought} />
			</div>
		{/each}
	</div>
</div>
