import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { authMiddleware } from "@/utils/auth-middleware.js";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = (async (event: RequestEvent) => {
    // general auth check
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    const noteId = parseInt(event.params.id ?? "");
    if (Number.isNaN(noteId) || noteId == undefined) {
        error(404, {
            message: 'Not found'
        });
    }

    const caller = createCaller({ event: event as CtxRequestEvent });
    const thought = await caller.project.getNote({ noteId: noteId });

    if (thought?.userId != event.locals.session.userId) {
        error(404, {
            message: 'Not found'
        });
    }

    return {
        user: event.locals!,
        thought,
        form: await superValidate({ thought: thought!.name }, zod(formSchema)),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const noteId = parseInt(event.params.id ?? "");
        if (Number.isNaN(noteId) || noteId == undefined) {
            error(404, {
                message: 'Not found'
            });
        }

        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const caller = createCaller({ event: event as CtxRequestEvent });
        await caller.project.updateQuickNote({ noteId: noteId, content: form.data.thought });

        return {
            form,
        };
    },
};
