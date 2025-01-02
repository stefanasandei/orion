import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event: RequestEvent) => {
    if (event.locals.session !== null) {
        return redirect(301, "/");
    }

    return {};
}) satisfies PageServerLoad;
