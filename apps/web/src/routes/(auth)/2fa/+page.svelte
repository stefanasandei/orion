<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as InputOTP from '@/components/ui/input-otp';
	import * as Form from '@/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (!f.valid) {
				toast.error($t('common.generic_form_error'));
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="bg-background">
	<main class="container flex min-h-screen flex-col">
		<form method="POST" use:enhance class="flex min-h-screen flex-col" id="otpForm">
			<div class="pt-10">
				<div class="text-center">
					<h1 class="text-3xl font-semibold tracking-tight">{$t('auth.2fa_Long')}</h1>
					<p class="text-muted-foreground mt-3 text-center text-sm">
						{$t('auth.2fa_desc')}
					</p>
				</div>
			</div>

			<div class="flex flex-1 items-center justify-center">
				<div class="w-full max-w-md space-y-6">
					<Form.Field {form} name="pin">
						<Form.Control>
							{#snippet children({ props })}
								<InputOTP.Root
									{...props}
									maxlength={6}
									bind:value={$formData.pin}
									class="flex justify-center gap-2"
								>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells.slice(0, 3) as cell}
												<InputOTP.Slot {cell} />
											{/each}
										</InputOTP.Group>
										<InputOTP.Separator>-</InputOTP.Separator>
										<InputOTP.Group>
											{#each cells.slice(3, 6) as cell}
												<InputOTP.Slot {cell} />
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-center" />
					</Form.Field>
				</div>
			</div>

			<div class="mx-auto w-full max-w-md p-6">
				<Form.Button class="w-full" type="submit">{$t('auth.2fa_code')}</Form.Button>
			</div>
		</form>
	</main>
</div>
