<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import ProfileSection from '$base/src/lib/components/settings/profile-section.svelte';
	import type { Project, User, UserMetadata } from '@repo/db';
	import type { UserLocals } from '@repo/core';

	let {
		data
	}: {
		data: {
			locals: UserLocals;
			user: {
				intern: User;
				metadata: UserMetadata;
				projects: Project[];
			};
		};
	} = $props();
	const { user, locals } = data!;
</script>

<DashboardShell pageName={'Profile'} user={locals}>
	<ProfileSection {user} />
</DashboardShell>
