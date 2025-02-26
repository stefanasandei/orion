<script lang="ts">
	import { type PageData } from './$types';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import ProfileSection from '$base/src/lib/components/settings/profile-section.svelte';

	export let data: PageData;
</script>

<DashboardShell pageName={`${data.user.metadata.name}'s Profile`} user={data.locals}>
	<ProfileSection user={data.user} />
</DashboardShell>
