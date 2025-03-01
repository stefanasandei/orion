<script lang="ts">
	import { formatDate } from '../../utils/datetime';
	import { language } from '../../utils/state';
	import { trpc } from '../../utils/trpc/client';
	import { Icons } from '../icons.svelte';
	import { Button } from '../ui/button';
	import { Input } from '@/components/ui/input';
	import Separator from '../ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';
	import type { Note } from '@repo/db';
	import { invalidateAll } from '$app/navigation';
	import { t } from '@/utils/i18n/translations';

	// props
	interface Props {
		notes: Note[];
	}

	const { notes: _notes }: Props = $props();
	const notes = $derived(_notes);

	// state for simple info
	const currDate = $derived(
		language.current != 'en' ? formatDate(new Date(), 'ro-RO') : formatDate()
	);

	// utilities to create a new task
	let addNewTask = $state(false);
	let newTaskName = $state('');

	const createQuickNote = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			toast.success('Task created successfully');
			newTaskName = '';
			addNewTask = false;
			await invalidateAll();
		}
	});

	const deleteNote = trpc().project.deleteNote.createMutation({
		onSuccess: async () => {
			toast.success('Task deleted');
			await invalidateAll();
		}
	});

	const createTask = () => {
		if (!newTaskName.trim()) return;

		$createQuickNote.mutate({
			content: newTaskName,
			type: 'task'
		});
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && newTaskName.trim()) {
			createTask();
		}
	};

	const taskCount = $derived(notes.filter((n) => n.type == 'task').length);
	const feedCount = $derived(notes.filter((n) => n.type == 'newsfeed').length);
</script>

<div
	class="border-muted bg-card hover:bg-card/10 flex flex-col gap-4 rounded-lg border-2 p-3 transition-all md:col-span-1 md:h-full"
>
	<div class="flex flex-col items-start gap-2">
		<p class="text-card-foreground/90">{$t('dashboard.activity.today')}</p>
		<p class="text-muted-foreground font-semibold">{currDate}</p>
	</div>

	<div class="mt-4 flex flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<p class=" text-2xl font-semibold md:text-xl">📌 {$t('dashboard.activity.tasks_title')}</p>
			<Button size="small-icon" onclick={() => (addNewTask = !addNewTask)}>
				{#if !addNewTask}
					<Icons.add />
				{:else}
					<Icons.close />
				{/if}
			</Button>
		</div>
		<Separator />

		{#if addNewTask}
			<div class="my-2 flex w-full flex-row gap-4">
				<Input
					class="h-fit"
					bind:value={newTaskName}
					placeholder={$t('dashboard.activity.new_task_placeholder')}
					onkeydown={handleKeydown}
				/>
				<Button size="sm" onclick={() => createTask()}>{$t('dashboard.activity.add_task')}</Button>
			</div>
		{/if}

		<ul class="w-full list-inside space-y-2 md:text-lg">
			{#each notes as task}
				{#if task.type === 'task'}
					<li class="flex flex-row items-center gap-4">
						<Button
							variant={'outline'}
							size="small-icon"
							onclick={() =>
								$deleteNote.mutate({
									noteId: task.id
								})}><Icons.close /></Button
						>
						<span class="text-xl">{task.name}</span>
					</li>
				{/if}
			{/each}

			{#if taskCount == 0}
				<p class="text-foreground/80 w-full text-center">{$t('dashboard.activity.no_tasks')}</p>
			{/if}
		</ul>
	</div>

	<div class="mt-4 flex flex-col items-start gap-2">
		<p class="text-2xl font-semibold md:text-xl">🗞 {$t('dashboard.activity.newsfeed_title')}</p>
		<Separator />

		<ul class="ml-4 w-full list-inside list-disc space-y-4 md:text-lg">
			{#each notes as task}
				{#if task.type === 'newsfeed'}
					<li class="mr-2 text-left text-xl">{task.name}</li>
				{/if}
			{/each}

			{#if feedCount == 0}
				<p class="text-foreground/80 w-full text-center">{$t('dashboard.activity.no_news')}</p>
			{/if}
		</ul>
	</div>
</div>
