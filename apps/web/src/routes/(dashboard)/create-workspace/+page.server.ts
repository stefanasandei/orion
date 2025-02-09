import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";

export const load: PageServerLoad = (async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    return {
        user: event.locals,
    };
}) satisfies PageServerLoad;
