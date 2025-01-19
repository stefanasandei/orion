import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { AuthFailReason } from '@repo/auth';
import { setMessage, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginFormSchema } from './schema';

export const load = (async (event: RequestEvent) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(loginFormSchema)),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        // 1. get form data & validation
        const form = await superValidate(event, zod(loginFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        // 2. call the api for the auth logic
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.user.login({
            email: form.data.email,
            password: form.data.password
        });

        // if it's alright, send the user to the homepage
        // cookie & session logic is handled by the api
        if (response.success) {
            return redirect(302, "/");
        }

        // 3. if there was an error, let the user know
        let failMessage = "";
        switch (response.reason) {
            case AuthFailReason.WrongPassword:
                failMessage = "Wrong password.";
                break;
            default:
                failMessage = "Unknown error.";
                break;
        }

        setMessage(form, failMessage);

        return fail(400, {
            form,
            message: failMessage
        });
    }
};

