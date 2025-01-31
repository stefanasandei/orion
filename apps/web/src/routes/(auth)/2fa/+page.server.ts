import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event.request, zod(formSchema));

        if (!form.valid) {
            return { form };
        }
        const caller = createCaller({ event: event as CtxRequestEvent });
        const success = await caller.user.verifyTOTPCode({
            code: form.data.pin
        });

        if (success) {
            throw redirect(303, '/');
        }

        return { form };
    }
};