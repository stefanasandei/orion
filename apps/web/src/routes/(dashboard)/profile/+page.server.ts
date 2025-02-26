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
    // getAllPublic
    const caller = createCaller({ event: event as CtxRequestEvent });
    const projects = await caller.project.getAllPublic();

    return {
        locals: event.locals!,
        user: {
            ...user,
            projects
        }
    };
}) satisfies PageServerLoad;
