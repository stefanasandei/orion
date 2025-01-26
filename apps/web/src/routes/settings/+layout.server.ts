import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event: RequestEvent) => {
    if (event.locals.session === null || event.locals.user === null) {
        return redirect(302, "/");
    }

    return {
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
}) satisfies PageServerLoad;
