<script lang="ts">
	import type { Project } from '@repo/db';
	import { Clock, Book, User } from 'lucide-svelte';
	import { t } from '@/utils/i18n/translations';
	import { cn } from '../../utils/cn';

	interface Props {
		project: Project;
		authorName?: string;
		notesCount?: number;
		col?: boolean;
	}

	const { project, notesCount, authorName, col = false }: Props = $props();

	const createdAtDate = $derived(
		(() => {
			const day = project.createdAt.getDate();
			const month = project.createdAt.toLocaleString('default', { month: 'long' });
			const year = project.createdAt.getFullYear();

			// quicker than researching some library
			return `${day} ${month} ${year}`;
		})()
	);
</script>

<div class={cn('text-foreground/80 mt-2 flex flex-col gap-2', col ? '' : 'md:flex-row md:gap-6')}>
	<div class="flex flex-row items-center gap-1">
		<Clock class="size-5" />
		<p>{$t('project.overview.created')} {createdAtDate}</p>
	</div>

	{#if notesCount !== undefined}
		<div class="flex flex-row items-center gap-1">
			<Book class="size-5" />
			<p>
				{`${notesCount} ${$t(
					notesCount === 1 ? 'project.overview.document' : 'project.overview.documents'
				)}`}
			</p>
		</div>
	{/if}

	{#if authorName != undefined}
		<div class="flex flex-row items-center gap-1">
			<User class="size-5" />
			<p>{authorName}</p>
		</div>
	{/if}
</div>
