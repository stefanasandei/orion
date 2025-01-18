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
        // 1. get user data
        const formData = await event.request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        // 2. validation
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return fail(400, {
                message: "Invalid or missing fields",
                email: "",
                name: ""
            });
        }

        // 3. call the api for the auth logic
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.user.register({
            name: name,
            email: email,
            password: password
        });

        if (response.success) {
            return redirect(302, "/");
        }

        // 4. not success, show the error
        let failMessage = "";

        switch (response.reason) {
            default:
                failMessage = "Unknown error.";
                break;
        }

        return fail(400, {
            message: failMessage,
            name: name,
            email: email
        });
    }
};

