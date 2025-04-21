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

    const projectId = parseInt(event.params.id!);
    const caller = createCaller({ event: event as CtxRequestEvent });

    const [project, tags] = await Promise.all([
        caller.project.get({ id: projectId }),
        caller.user.getTags()
    ]);

    if (project === undefined || project.project === undefined) {
        redirect(302, "/");
    }

    // only the author can edit the project
    if (project.project.userId !== event.locals!.session.userId) {
        redirect(302, "/");
    }

    return {
        user: event.locals!,
        project,
        tags,
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

        console.log(form.data.tags)

        // call the api with project updates and publicity update in parallel
        const caller = createCaller({ event: event as CtxRequestEvent });
        const [projectResponse, publicityResponse] = await Promise.all([
            caller.project.update({
                id: form.data.projectId,
                name: form.data.name,
                description: form.data.description,
                tags: form.data.tags
            }),

            // this is separate, because it requires different logic
            // regarding the project metadata handling
            caller.project.updatePublicity({
                id: form.data.projectId,
                isPublic: form.data.isPublic
            })
        ]);

        if (!publicityResponse) {
            return fail(400, {
                form,
            });
        }

        return projectResponse;
    },
};
