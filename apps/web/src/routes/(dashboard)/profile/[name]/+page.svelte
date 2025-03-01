<script lang="ts">
	import { type PageData } from './$types';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import ProfileSection from '$base/src/lib/components/settings/profile-section.svelte';
	import { t } from '@/utils/i18n/translations';

	export let data: PageData;
</script>

<DashboardShell
	pageName={$t('dashboard.profile.user_profile', { default: data.user.metadata.name })}
	user={data.locals}
>
	<ProfileSection user={data.user} />
</DashboardShell>
