import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { AuthFailReason } from '@repo/auth';

export const load = (async (event: RequestEvent) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        return redirect(302, "/");
    }

    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        // the post method from the form
        // 1. get credentials
        const formData = await event.request.formData();
        const email = formData.get("email");
        const password = formData.get("password");

        // 2. validation
        if (typeof email !== "string" || typeof password !== "string") {
            return fail(400, {
                message: "Invalid or missing fields",
                email: ""
            });
        }

        // 3. call the api for the auth logic
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.user.login({
            email: email,
            password: password
        });

        if (response.success) {
            return redirect(302, "/");
        }

        // 4. not success, show the error
        let failMessage = "";

        switch (response.reason) {
            case AuthFailReason.BadPassword:
                // TODO: use i18n
                failMessage = "Wrong password.";
                break;
            default:
                failMessage = "Unknown error.";
                break;
        }

        return fail(400, {
            message: failMessage,
            email: email
        });
    }
};

