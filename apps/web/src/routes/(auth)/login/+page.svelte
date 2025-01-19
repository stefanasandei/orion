<script lang="ts">
	import Seo from '@/components/seo.svelte';
	import LoginForm from '@/components/auth/login-form.svelte';
	import Logo from '@/components/logo.svelte';
	import { loginFormSchema, type LoginFormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: { form: SuperValidated<Infer<LoginFormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginFormSchema)
	});
</script>

<Seo title="Login" description="Login to your account" />

<div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<Logo />
		<LoginForm {form} />
	</div>
</div>
