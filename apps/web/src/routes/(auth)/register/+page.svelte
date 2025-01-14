<script lang="ts">
	import Seo from '@/components/seo.svelte';
	import RegisterForm from '@/components/auth/register-form.svelte';
	import Logo from '@/components/logo.svelte';

	// todo: actual sign up form
	// import type { ActionData } from './$types';
	// import { enhance } from '$app/forms';

	// export let form: ActionData;
</script>

<Seo title="Register" description="Create a new user account." />

<!-- <h1>register</h1>
<form method="post" use:enhance>
	<input placeholder="name" name="name" type="text" required value={form?.name ?? ''} /> <br />
	<input placeholder="email" name="email" type="email" required value={form?.email ?? ''} /> <br />
	<input placeholder="password" name="password" type="password" required /><br />
	<button>submit</button>
	<p>{form?.message ?? ''}</p>
</form> -->

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<Logo />

		<RegisterForm />

		<div
			class="text-muted-foreground [&_a]:hover:text-primary text-balance text-center text-xs [&_a]:underline [&_a]:underline-offset-4"
		>
			By clicking continue, you agree to our <a href="/">Terms of Service</a>{' '}
			and <a href="/">Privacy Policy</a>.
		</div>
	</div>
</div>
