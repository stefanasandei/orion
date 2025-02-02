<script lang="ts">
	import Seo from '@/components/seo.svelte';
	import RegisterForm from '@/components/auth/register-form.svelte';
	import Logo from '@/components/logo.svelte';
	import { registerFormSchema, type RegisterFormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LangPicker from '@/components/lang-picker.svelte';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: { form: SuperValidated<Infer<RegisterFormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerFormSchema)
	});
</script>

<Seo title="Register" description="Create a new user account." />

<div class="bg-background flex min-h-svh flex-col">
	<div class="flex flex-1 items-center justify-center p-6 md:p-10">
		<div class="flex w-full max-w-sm flex-col gap-6">
			<Logo />

			<RegisterForm {form} />

			<div class="text-foreground text-balance text-center text-xs">
				{$t('auth.tos_disclaimer_p1')}{' '}
				<a class="hover:text-primary underline underline-offset-4" href="/tos">{$t('auth.tos')}</a
				>{' '}
				{$t('common.and')}{' '}
				<a class="hover:text-primary underline underline-offset-4" href="/privacy-policy">
					{$t('auth.privacy_policy')}
				</a>.
			</div>
		</div>
	</div>

	<div class="flex justify-end p-4">
		<LangPicker class="w-[180px]" />
	</div>
</div>
