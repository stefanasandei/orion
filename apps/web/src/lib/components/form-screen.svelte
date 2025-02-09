<script lang="ts">
	import LangPicker from '@/components/lang-picker.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		userEmail: string;
	}

	const { children, userEmail } = $props();
</script>

<div class="flex min-h-svh flex-col">
	<div class="flex flex-1 items-center justify-center p-6 md:p-10">
		{@render children?.()}
	</div>

	<div class="flex flex-row justify-between">
		<div class="flex justify-start p-4">
			<section
				class="bg-background ring-secondary/30 flex items-center justify-center rounded-md px-3 py-2 text-sm ring-1"
			>
				<p>{userEmail}</p>
			</section>
		</div>

		<div class="flex justify-end p-4">
			<LangPicker class="w-[180px]" />
		</div>
	</div>
</div>
