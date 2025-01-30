import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "@/components/settings/account-schema";
import { zod } from "sveltekit-superforms/adapters";
import type { RequestEvent } from "@sveltejs/kit";
import { createCaller } from "@repo/api";
import type { CtxRequestEvent } from "@repo/core";

export const load: PageServerLoad = async (event: RequestEvent) => {
    if (event.locals.session === null || event.locals.user === null) {
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(formSchema)),
        userMetadata: event.locals.userMetadata
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // call the api with the profile updates
        // const caller = createCaller({ event: event as CtxRequestEvent });
        // const response = await caller.user.updateProfile({
        //     form: form.data
        // });

        return true;
    },
};
