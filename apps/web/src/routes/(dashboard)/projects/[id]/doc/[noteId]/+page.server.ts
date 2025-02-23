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

    // check if project is owned by user & get its data
    const projectId = parseInt(event.params.id!);
    const noteId = parseInt(event.params.noteId!);

    const caller = createCaller({ event: event as CtxRequestEvent });
    const { project, noteTree } = await caller.project.get({ id: projectId });

    const note = await caller.project.getNote({ noteId });

    if (project === undefined || note === undefined) {
        redirect(302, "/");
    }

    return {
        user: event.locals!,
        activeProject: {
            project,
            noteTree,
        },
        note
    };
}) satisfies PageServerLoad;
