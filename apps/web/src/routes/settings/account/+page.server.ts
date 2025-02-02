import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { RequestEvent } from "@sveltejs/kit";
import { authMiddleware } from "@/utils/auth-middleware.js";

export const load: PageServerLoad = async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    return {
        userMetadata: event.locals.userMetadata,
        user: event.locals.user
    };
};
