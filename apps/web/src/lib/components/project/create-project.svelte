<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Icons } from '@/components/icons.svelte';
	import ResponsiveDialog from '@/components/responsive-dialog.svelte';
</script>

<ResponsiveDialog
	title="Example Dialog"
	description="This is an example usage of the ResponsiveDialog component."
>
	{#snippet triggerButton()}
		<Button size="small-icon" variant="ghost"><Icons.add /></Button>
	{/snippet}

	<p>hello</p>
</ResponsiveDialog>
