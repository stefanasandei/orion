<script lang="ts">
	import { Badge } from '../ui/badge';

	interface Props {
		id: number;
		name: string;
	}

	const { id, name }: Props = $props();
</script>

<a href={`/tag/${id}`} class="cursor-pointer">
	<Badge variant={'secondary'}>{name}</Badge>
</a>
