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

<!-- <AlertDialog.Root>
	<AlertDialog.Trigger>
		<Button size="small-icon" variant="ghost"><Icons.add /></Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root> -->
