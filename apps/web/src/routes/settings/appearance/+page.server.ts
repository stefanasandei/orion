import type { PageServerLoad } from "./$types.js";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { createCaller } from "@repo/api";
import type { CtxRequestEvent } from "@repo/core";
import { authMiddleware } from "@/utils/auth-middleware.js";

export const load: PageServerLoad = async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    const caller = createCaller({ event: event as CtxRequestEvent });
    const tags = await caller.user.getTags();

    return {
        tags
    };
};
