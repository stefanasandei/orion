<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { Icons } from '$base/src/lib/components/icons.svelte';
	import HtmlPreview from '$base/src/lib/components/html-preview.svelte';
	import DeleteNote from '$base/src/lib/components/project/delete-note.svelte';
	import { parse } from 'marked';

	let { data: _data }: { data: { user: UserLocals; thought: Note } } = $props();
	const { user, thought } = $derived(_data);

	let cachedHtml = $state<Map<string, string>>(new Map());

	let deleteDialogOpen = $state(false);

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
</script>

<DashboardShell pageName={'Thoughts'} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
		<Card.Root class="bg-card transition-colors duration-75">
			<Card.Content class="flex flex-col justify-between space-y-2 pb-2">
				<button
					onclick={() => goto(`/thoughts/${thought.id}`)}
					class="group relative w-full flex-1 cursor-pointer overflow-hidden"
				>
					<div class="w-full overflow-x-auto">
						<div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-full">
							<HtmlPreview className="text-xl" htmlContent={renderHtml(thought.name)} />
						</div>
					</div>
				</button>

				<div class="flex flex-row items-end justify-between">
					<p class="text-muted-foreground text-sm">
						{new Date(thought.createdAt).toLocaleString()}
					</p>

					<div class="flex flex-col justify-end gap-2">
						<Button
							onclick={() => {
								deleteDialogOpen = true;
							}}
							size="icon"
							variant="outline"
						>
							<Icons.delete />
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</DashboardShell>

<DeleteNote
	item={{ id: thought.id!, name: '' }}
	onSuccess={async () => await goto('/thoughts')}
	bind:open={deleteDialogOpen}
/>
