import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { registerFormSchema } from './schema';

export const load = (async (event: RequestEvent) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(registerFormSchema)),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        // the post method from the form
        // 1. get form data & validation \w zod
        const form = await superValidate(event, zod(registerFormSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // 2. call the api for the auth logic
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.user.register({
            name: form.data.firstName + " " + form.data.lastName,
            email: form.data.email,
            password: form.data.password,
        });

        if (response.success) {
            return redirect(302, "/");
        }

        // 3. not success, show the error
        let failMessage = "";

        switch (response.reason) {
            default:
                failMessage = "Unknown error.";
                break;
        }

        return fail(400, {
            message: failMessage,
            form
        });
    }
};

