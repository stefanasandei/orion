import { error, redirect, type RequestEvent } from '@sveltejs/kit';
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

    const tagId = parseInt(event.params.id ?? "");
    if (Number.isNaN(tagId) || tagId == undefined) {
        error(404, {
            message: 'Not found'
        });
    }

    // const caller = createCaller({ event: event as CtxRequestEvent });
    // const tag = await caller.project.getNote({ noteId: tagId });

    // if (tag?.userId != event.locals.session.userId) {
    //     error(404, {
    //         message: 'Not found'
    //     });
    // }

    return {
        user: event.locals!,
        tagId
    };
}) satisfies PageServerLoad;
