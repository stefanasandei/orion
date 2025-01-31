<script>
	import { Icons } from '../icons.svelte';
	import ModeToggle from '../mode-toggle.svelte';
	import { t } from '@/utils/i18n/translations';
</script>

<div class="border-border border-grid mt-6 border-t">
	<footer
		class="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0"
	>
		<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
			<Icons.logo />
			<p class="text-center text-sm leading-loose md:text-left">
				{$t('marketing.built_by')}{' '}
				<a
					href={'https://asandei.com'}
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Stefan Asandei
				</a>
				. {$t('marketing.follow_on')}{' '}
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
