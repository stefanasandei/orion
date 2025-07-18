import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';

export const load: PageServerLoad = (async (event: RequestEvent) => {
    // general auth check
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    const user = event.locals.user;

    // query projects, used in the profile
    const caller = createCaller({ event: event as CtxRequestEvent });
    const profile = await caller.user.getPublicProfile({ name: user?.metadata.name });

    return {
        locals: event.locals!,
        user: {
            ...user,
            projects: profile!.projects
        }
    };
}) satisfies PageServerLoad;
