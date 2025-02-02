<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Select from '@/components/ui/select';
	import { language, languageOptions, type LanguageOptions } from '@/utils/state';
	import { cn } from '@/utils/cn';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const longLanguages = {
		en: 'English',
		ro: 'Română'
	};
</script>

<Select.Root
	type="single"
	onValueChange={(val) => {
		language.current = val as LanguageOptions;
		invalidateAll();
	}}
>
	<Select.Trigger class={cn('ring-secondary/30 ring-1', className ?? '')}
		>{longLanguages[language.current]}</Select.Trigger
	>
	<Select.Content>
		{#each languageOptions as opt}
			<Select.Item value={opt}>{longLanguages[opt]}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
