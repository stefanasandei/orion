<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import PDFChat from '@/components/assistant/pdf-chat.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/state';

	let {
		data: _data
	}: {
		data: {
			user: UserLocals;
			thought: Note;
		};
	} = $props();
	const { user, thought } = $derived(_data);

	const prompt = page.url.searchParams.get('prompt');
	const userInput = writable(prompt ?? '');
</script>

<DashboardShell className="h-full flex" pageName={'Edit Thought'} {user}>
	<div class="flex h-full w-full flex-1 flex-col">
		<PDFChat {userInput} userId={user.session?.userId!} {thought} />
	</div>
</DashboardShell>
