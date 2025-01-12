<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Seo from '@/components/seo.svelte';

	export let form: ActionData;
</script>

<Seo title="Login" description="Login" />

<h1>login</h1>
<form method="post" use:enhance>
	<input placeholder="email" name="email" type="email" required value={form?.email ?? ''} /> <br />
	<input placeholder="password" name="password" type="password" required /><br />
	<button>submit</button>
	<p>{form?.message ?? ''}</p>
</form>
