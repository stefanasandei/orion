import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';

export const load: PageServerLoad = (async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    const caller = createCaller({ event: event as CtxRequestEvent });
    const data = await caller.user.getPublicProfile({ name: event.params.name! });

    if (!data) {
        redirect(302, "/");
    }

    return {
        locals: event.locals,
        user: {
            metadata: data.metadata,
            projects: data.projects
        }
    };
}) satisfies PageServerLoad;
