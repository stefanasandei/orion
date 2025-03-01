import { createCaller } from "@repo/api";
import type { CtxRequestEvent } from "@repo/core";
import type { Note } from "@repo/db";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        if (event.locals.user.metadata.twoFactorEnabled && !event.locals.session.twoFactorVerified) {
            return redirect(302, "/2fa");
        }
    }

    if (event.locals.session != undefined) {
        // get non-workspace content (such as thoughts and tasks)
        const caller = createCaller({ event: event as CtxRequestEvent });
        const notes = await caller.user.getQuickNotes();

        return {
            user: event.locals!,
            notes
        };
    }

    return {
        user: event.locals!,
    };
};
