<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import ProfileForm from '@/components/settings/profile-form.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<CategoryShell title="Profile" description="This is how others will see you on the site.">
	<ProfileForm {data} />
</CategoryShell>
