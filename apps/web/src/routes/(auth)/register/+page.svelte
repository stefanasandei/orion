<script lang="ts">
	import Seo from '@/components/seo.svelte';
	import RegisterForm from '@/components/auth/register-form.svelte';
	import Logo from '@/components/logo.svelte';

	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<Seo title="Register" description="Create a new user account." />

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<Logo />

		<RegisterForm {form} />

		<div
			class="text-muted-foreground [&_a]:hover:text-primary text-balance text-center text-xs [&_a]:underline [&_a]:underline-offset-4"
		>
			By clicking continue, you agree to our <a href="/">Terms of Service</a>{' '}
			and <a href="/">Privacy Policy</a>.
		</div>
	</div>
</div>
