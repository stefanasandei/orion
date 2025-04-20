<script lang="ts">
	import { cn } from '../utils/cn';

	interface Props {
		className?: string;
	}

	const { className }: Props = $props();
</script>

<div class={cn('bg-background h-full w-full', className ?? '')}>
	<div class="flex h-full w-full items-center justify-center">
		<div
			class="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"
		></div>
	</div>
</div>
