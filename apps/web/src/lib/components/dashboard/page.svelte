<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';

	interface Props {
		user: User;
		metadata: UserMetadata;
	}

	const { metadata }: Props = $props();
</script>

<p>Hello, {metadata.name}!</p>
