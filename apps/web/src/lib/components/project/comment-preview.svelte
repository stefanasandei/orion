<script lang="ts">
	import type { Comment } from '@repo/db';
	import * as Avatar from '../ui/avatar';

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
		<Avatar.Fallback class="size-12 rounded-md">{'SA'}</Avatar.Fallback>
	</Avatar.Root>

	<div class="flex flex-col justify-between">
		<p class="text-muted-foreground/80">posted by {comment.user.metadata.name}</p>
		<p>{comment.content}</p>
	</div>
</div>
