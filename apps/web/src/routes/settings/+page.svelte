<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import ProfileForm from '@/components/settings/profile-form.svelte';
	import type { PageData } from './$types.js';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: PageData } = $props();
</script>

<CategoryShell title={$t('settings.profile')} description={$t('settings.profile_desc')}>
	<ProfileForm {data} />
</CategoryShell>
