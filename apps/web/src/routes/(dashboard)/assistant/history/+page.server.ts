import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";
import type { CtxRequestEvent } from '@repo/core';
import { createCaller } from '@repo/api';

export const load: PageServerLoad = (async (event: RequestEvent) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    const caller = createCaller({ event: event as CtxRequestEvent });
    const conversations = await caller.user.getConversations();

    return {
        user: event.locals!,
        conversations
    };
}) satisfies PageServerLoad;
