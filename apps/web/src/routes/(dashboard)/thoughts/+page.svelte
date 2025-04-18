<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import { Textarea } from '@/components/ui/textarea';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Icons } from '$base/src/lib/components/icons.svelte';
	import HtmlPreview from '$base/src/lib/components/html-preview.svelte';
	import DeleteNote from '$base/src/lib/components/project/delete-note.svelte';
	import { parse } from 'marked';

	let { data: _data }: { data: { user: UserLocals; notes: Note[] } } = $props();
	const { user, notes: _notes } = $derived(_data);
	const thoughts = $derived(_notes.filter((n) => n.type == 'thought'));

	let newThought = $state('');

	let deleteThought = $state<Note>();
	let deleteDialogOpen = $state(false);

	let cachedHtml = $state<Map<string, string>>(new Map());

	const addNewThought = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.quick_thoughts.success'));
			newThought = '';
			await invalidateAll();
		}
	});

	function renderHtml(content: string) {
		if (cachedHtml.has(content)) {
			return cachedHtml.get(content)!;
		}

		const rendered = parse(content, {
			async: false
		}) as string;

		cachedHtml.set(content, rendered);

		return rendered;
	}

	function handleSubmit() {
		if (!newThought.trim()) return;

		$addNewThought.mutate({
			content: newThought,
			type: 'thought'
		});
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	/*
    todo: edit, search, tags, show only preview click for full
    */
</script>

<DashboardShell pageName={'Thoughts'} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
		<!-- Input area -->
		<div
			class="bg-card hover:ring-ring ring-accent flex flex-col gap-4 rounded-xl p-4 shadow-sm ring-1 ring-inset transition-all hover:ring-2"
		>
			<Textarea
				bind:value={newThought}
				onkeydown={handleKeyDown}
				class="bg-card flex-1 resize-none border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
				placeholder="What's on your mind?"
				rows={3}
			/>
			<div class="flex justify-end">
				<Button onclick={handleSubmit} size="sm">Save Thought</Button>
			</div>
		</div>

		<!-- Thoughts feed -->
		<div class="flex flex-col gap-4">
			{#each thoughts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as thought}
				<Card.Root class="bg-card transition-colors duration-75">
					<div class="flex flex-row justify-between">
						<Card.Content class="space-y-2">
							<HtmlPreview className="text-xl" htmlContent={renderHtml(thought.name)} />
							<!-- <p class="text-foreground whitespace-pre-wrap text-xl">{thought.name}</p> -->
							<p class="text-muted-foreground text-sm">
								{new Date(thought.createdAt).toLocaleString()}
							</p>
						</Card.Content>

						<div class="flex flex-col justify-end gap-2 p-2">
							<Button
								onclick={() => {
									deleteThought = thought;
									deleteDialogOpen = true;
								}}
								size="icon"
								variant={'outline'}
							>
								<Icons.delete />
							</Button>
						</div>
					</div>
				</Card.Root>
			{/each}
		</div>
	</div>
</DashboardShell>

<DeleteNote item={{ id: deleteThought?.id!, name: '' }} bind:open={deleteDialogOpen} />
