<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import ProfileSection from '$base/src/lib/components/settings/profile-section.svelte';
	import type { PageData } from './$types';
	import { t } from '@/utils/i18n/translations';

	export let data: PageData;
</script>

<DashboardShell pageName={$t('dashboard.profile.title')} user={data.locals}>
	<ProfileSection
		isOwn={true}
		user={{
			metadata: data.user.metadata,
			projects: data.user.projects
		}}
	/>
</DashboardShell>
