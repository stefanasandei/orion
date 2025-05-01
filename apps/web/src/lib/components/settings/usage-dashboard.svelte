<script lang="ts">
	import type { Usage } from '@repo/db';
	import * as Card from '$lib/components/ui/card';
	import { formatBytes } from '$lib/utils/format';
	import { t } from '@/utils/i18n/translations';

	const { usage }: { usage: Usage[] } = $props();

	// Calculate totals and group by date
	const usageByDate = $derived(
		usage.reduce(
			(acc, curr) => {
				const date = new Date(curr.createdAt).toLocaleDateString();
				if (!acc[date]) {
					acc[date] = {
						promptTokens: 0,
						completionTokens: 0,
						fileSize: 0,
						date: curr.createdAt
					};
				}
				acc[date].promptTokens += curr.promptTokens;
				acc[date].completionTokens += curr.completionTokens;
				acc[date].fileSize += curr.fileSize;
				return acc;
			},
			{} as Record<
				string,
				{ promptTokens: number; completionTokens: number; fileSize: number; date: Date }
			>
		)
	);

	const sortedUsage = $derived(
		Object.values(usageByDate).sort((a, b) => b.date.getTime() - a.date.getTime())
	);
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each sortedUsage as day}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-lg">{new Date(day.date).toLocaleDateString()}</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<p class="text-muted-foreground text-sm font-medium">{$t('settings.input_tokens')}</p>
						<p class="text-2xl font-bold">{day.promptTokens.toLocaleString()}</p>
					</div>
					<div class="space-y-2">
						<p class="text-muted-foreground text-sm font-medium">{$t('settings.output_tokens')}</p>
						<p class="text-2xl font-bold">{day.completionTokens.toLocaleString()}</p>
					</div>
				</div>
				<div class="space-y-2">
					<p class="text-muted-foreground text-sm font-medium">{$t('settings.file_size')}</p>
					<p class="text-2xl font-bold">{formatBytes(day.fileSize)}</p>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
