<script lang="ts">
	import type { Comment } from '@repo/db';
	import * as Avatar from '../ui/avatar';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		comment: Comment & { user: { metadata: { name: string } } };
	}

	const { comment }: Props = $props();

	const shortUsername = comment.user.metadata.name
		.split(' ')
		.map((name) => name[0])
		.join('');
</script>

<div class="flex flex-row items-center gap-4">
	<Avatar.Root class="size-12 rounded-md">
		<Avatar.Fallback class="size-12 rounded-md">{shortUsername}</Avatar.Fallback>
	</Avatar.Root>

	<div class="flex flex-col justify-between">
		<p class="text-muted-foreground/80">
			{$t('project.comment.posted_by')}
			<a
				href={`${PUBLIC_WEBSITE_URL}/profile/${comment.user.metadata.name}`}
				class="hover:cursor-pointer hover:underline">{comment.user.metadata.name}</a
			>
		</p>
		<p>{comment.content}</p>
	</div>
</div>
