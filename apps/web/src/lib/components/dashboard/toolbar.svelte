<script lang="ts">
	import { Input } from '../ui/input';
	import { buttonVariants } from '../ui/button';
	import { Bell, EllipsisVertical } from 'lucide-svelte';
</script>

<div class="mx-2 flex flex-row items-center justify-between">
	<Input placeholder="Search from your work" class="max-w-fit md:max-w-md" />

	<div class="flex flex-row gap-4">
		<a href="/notifications" class={buttonVariants({ variant: 'secondary', size: 'icon' })}>
			<Bell />
		</a>
		<a href="/settings" class={buttonVariants({ variant: 'secondary', size: 'icon' })}>
			<EllipsisVertical />
		</a>
	</div>
</div>
