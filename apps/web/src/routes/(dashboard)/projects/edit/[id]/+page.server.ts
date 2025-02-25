import { redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import { authMiddleware } from "@/utils/auth-middleware.js";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { projectFormSchema } from './schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async (event: RequestEvent) => {
    // general auth check
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    // check if project is owned by user & get its data
    const projectId = parseInt(event.params.id!);

    const caller = createCaller({ event: event as CtxRequestEvent });
    const project = await caller.project.get({ id: projectId });

    if (project === undefined) {
        redirect(302, "/");
    }

    return {
        user: event.locals!,
        project,
        form: await superValidate(zod(projectFormSchema)),
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(projectFormSchema));
        if (!form.valid || form.data.projectId == 0) {
            return fail(400, {
                form,
            });
        }

        // call the api with the profile updates
        const caller = createCaller({ event: event as CtxRequestEvent });
        const response = await caller.project.update({
            id: form.data.projectId,
            name: form.data.name,
            description: form.data.description,
            isPublic: form.data.isPublic,
        });

        return response;
    },
};
