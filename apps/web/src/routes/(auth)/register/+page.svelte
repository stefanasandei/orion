<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Seo from '@/components/seo.svelte';

	export let form: ActionData;
</script>

<Seo title="Register" description="Create a new user account." />

<h1>register</h1>
<form method="post" use:enhance>
	<input placeholder="name" name="name" type="text" required value={form?.name ?? ''} /> <br />
	<input placeholder="email" name="email" type="email" required value={form?.email ?? ''} /> <br />
	<input placeholder="password" name="password" type="password" required /><br />
	<button>submit</button>
	<p>{form?.message ?? ''}</p>
</form>
