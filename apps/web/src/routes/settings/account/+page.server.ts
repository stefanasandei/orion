import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "@/components/settings/account-schema";
import { zod } from "sveltekit-superforms/adapters";
import type { RequestEvent } from "@sveltejs/kit";
import { authMiddleware } from "@/utils/auth-middleware.js";

export const load: PageServerLoad = async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    return {
        form: await superValidate(zod(formSchema)),
        userMetadata: event.locals.userMetadata,
        user: event.locals.user
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
