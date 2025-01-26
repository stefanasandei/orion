import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { AuthFailReason } from '@repo/auth';
import { setMessage, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginFormSchema } from './schema';
import { RECAPTCHA_SECRET_KEY } from '$env/static/private';

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

        console.log(form.data);

        // check recaptcha
        const recaptchaResonse = form.data["g-recaptcha-response"];
        if (recaptchaResonse != undefined) {
            const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResonse}`
            });

            const data = await response.json();

            if (!data.success) {
                setMessage(form, { failMessage: "Recaptcha failed.", reason: AuthFailReason.RateLimited });

                return fail(400, {
                    form,
                    message: "Recaptcha failed."
                });
            }
        }

        // 2. call the api for the auth logic
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.user.login({
            email: form.data.email,
            password: form.data.password,
            rememberMe: form.data.rememberMe
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
            case AuthFailReason.EmailNotFound:
                failMessage = "Wrong email or password.";
                break;
            case AuthFailReason.RateLimited:
                failMessage = "Too many failed attempts.";
                break;
            default:
                failMessage = "Unknown error.";
                break;
        }

        setMessage(form, { failMessage, reason: response.reason });

        return fail(400, {
            form,
            message: failMessage
        });
    }
};

