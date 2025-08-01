import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';

export const load: PageServerLoad = (async (event: RequestEvent) => {
    // todo: would this be required?
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    // query public projects
    const caller = createCaller({ event: event as CtxRequestEvent });
    const projects = await caller.project.getAllPublic();

    return {
        user: event.locals!,
        projects
    };
}) satisfies PageServerLoad;
