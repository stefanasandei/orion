<script>
	import { Icons } from '../icons.svelte';
	import ModeToggle from '../mode-toggle.svelte';
</script>

<div class="border-border border-grid mt-6 border-t">
	<footer
		class="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0"
	>
		<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
			<Icons.logo />
			<p class="text-center text-sm leading-loose md:text-left">
				Built by{' '}
				<a
					href={'https://asandei.com'}
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Stefan Asandei
				</a>
				. Follow the jounery on{' '}
				<a
					href={'https://x.com/stefan_asandei'}
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Twitter
				</a>
				.
			</p>
		</div>
		<ModeToggle />
	</footer>
</div>
