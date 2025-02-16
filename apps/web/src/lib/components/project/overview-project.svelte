<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '@/components/ui/badge';
	import { Icons } from '../icons.svelte';
	import OverviewHeader from './overview-header.svelte';

	interface Props {
		project: Project & { notes: Note[] };
	}

	const { project }: Props = $props();
</script>

<OverviewHeader {project} />

<div class="mt-7 md:mx-auto md:max-w-5xl">
	<p>documents will go here</p>
</div>
