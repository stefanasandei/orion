<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { Icons } from '$base/src/lib/components/icons.svelte';
	import HtmlPreview from '$base/src/lib/components/html-preview.svelte';
	import DeleteNote from '$base/src/lib/components/project/delete-note.svelte';
	import { parse } from 'marked';
	import { Pen, Clock, CalendarDays } from 'lucide-svelte';
	import { Badge } from '$base/src/lib/components/ui/badge';
	import Tag from '$base/src/lib/components/dashboard/tag.svelte';

	let {
		data: _data
	}: {
		data: {
			user: UserLocals;
			thought: Note & { tags: { id: number; name: string }[] };
		};
	} = $props();
	const { user, thought } = $derived(_data);

	let cachedHtml = $state<Map<string, string>>(new Map());
	let deleteDialogOpen = $state(false);

	function renderHtml(content: string) {
		if (cachedHtml.has(content)) {
			return cachedHtml.get(content)!;
		}
		const rendered = parse(content, { async: false }) as string;
		cachedHtml.set(content, rendered);
		return rendered;
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(date);
	};
</script>

<DashboardShell pageName={'Thoughts'} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
		<div class="flex flex-col gap-4">
			<Card.Root class="border-none bg-transparent shadow-none">
				<Card.Header class="px-0">
					<div class="flex flex-col gap-4">
						<div class="flex items-start justify-between">
							<div class="space-y-1 pl-2">
								<div class="flex items-center gap-1 text-xl font-bold tracking-tight">
									<CalendarDays class="size-6" />
									<span>Created {formatDate(new Date(thought.createdAt))}</span>
								</div>
							</div>
							<div class="flex gap-2">
								<a
									href={`/thoughts/${thought.id}/edit`}
									class={buttonVariants({ variant: 'outline', class: 'gap-2' })}
								>
									<Pen class="size-4" />
									<span>Edit</span>
								</a>
								<Button
									onclick={() => {
										deleteDialogOpen = true;
									}}
									variant="destructive"
									class="gap-2"
								>
									<Icons.delete class="size-4" />
									<span>Delete</span>
								</Button>
							</div>
						</div>
					</div>
				</Card.Header>
			</Card.Root>

			<Card.Root class="bg-card/50 overflow-hidden transition-colors duration-75">
				<Card.Content class="prose prose-slate dark:prose-invert max-w-none p-6">
					<HtmlPreview className="text-2xl" htmlContent={renderHtml(thought.name)} />
				</Card.Content>
			</Card.Root>

			<div class={'flex flex-row items-center gap-1'}>
				{#each thought.tags as tag}
					<Tag name={tag.name} id={tag.id} />
				{/each}
			</div>
		</div>
	</div>
</DashboardShell>

<DeleteNote
	item={{ id: thought.id!, name: '' }}
	onSuccess={async () => await goto('/thoughts')}
	bind:open={deleteDialogOpen}
/>
