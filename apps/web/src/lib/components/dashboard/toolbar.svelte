<script lang="ts">
	import { buttonVariants } from '../ui/button';
	import { Bell, EllipsisVertical } from 'lucide-svelte';
	import Search from './search.svelte';
</script>

<div class="bg-muted/50 flex flex-row items-center justify-between rounded-lg p-2">
	<Search />

	<div class="flex flex-row gap-4">
		<a href="/notifications" class={buttonVariants({ variant: 'outline', size: 'icon' })}>
			<Bell />
		</a>
		<a href="/settings" class={buttonVariants({ variant: 'outline', size: 'icon' })}>
			<EllipsisVertical />
		</a>
	</div>
</div>
