<script>
	import { Separator } from '../ui/separator';
	import { t } from '@/utils/i18n/translations';
</script>

<div class="border-muted bg-card flex h-60 flex-col gap-4 rounded-lg border-2 p-3 transition-all">
	<div>
		<p class="mb-2 text-2xl">{$t('dashboard.recent_work.title')}</p>
		<Separator />
	</div>

	<div class="flex h-full w-full items-center justify-center">
		<!-- todo: actual functionality -->
		<p>{$t('dashboard.recent_work.no_documents')}</p>
	</div>
</div>
