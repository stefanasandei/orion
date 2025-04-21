<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import EditProjectForm from '@/components/project/edit-project-form.svelte';
	import { type PageData } from './$types';

	const { data }: { data: PageData } = $props();
	const { user, form, tags } = data;

	// makes navigating to another slug route reactive
	const project = $derived(data.project);
</script>

<DashboardShell pageName={$t('project.page_names.project')} {user}>
	<EditProjectForm {form} {project} {tags} />
</DashboardShell>
