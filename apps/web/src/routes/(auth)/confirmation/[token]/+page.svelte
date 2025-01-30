<script lang="ts">
	import { buttonVariants } from '$base/src/lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.success}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="text-foreground text-3xl font-bold">Email Confirmed</h1>
			<p class="text-foreground my-4">
				Your email has been confirmed! You can now enjoy higher rate limits.
			</p>
			<a href="/" class={buttonVariants()}>Homepage</a>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="text-foreground text-3xl font-bold">Email Confirmation Failed</h1>
			<p class="text-foreground my-4">The email confirmation link is invalid or has expired.</p>
			<a href="/" class={buttonVariants()}>Homepage</a>
		</div>
	</div>
{/if}
