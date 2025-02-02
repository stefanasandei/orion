<script lang="ts">
	import Seo from '@/components/seo.svelte';
	import LoginForm from '@/components/auth/login-form.svelte';
	import Logo from '@/components/logo.svelte';
	import { loginFormSchema, type LoginFormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LangPicker from '@/components/lang-picker.svelte';

	let { data }: { data: { form: SuperValidated<Infer<LoginFormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginFormSchema)
	});
</script>

<Seo title="Login" description="Login to your account" />

<div class="bg-background flex min-h-svh flex-col">
	<div class="flex flex-1 items-center justify-center p-6 md:p-10">
		<div class="flex w-full max-w-sm flex-col gap-6">
			<Logo />
			<LoginForm {form} />
		</div>
	</div>

	<div class="flex justify-end p-4">
		<LangPicker class="w-[180px]" />
	</div>
</div>
