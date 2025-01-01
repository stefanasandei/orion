import { deleteSessionTokenCookie, setSessionTokenCookie } from "@repo/auth";

import { validateSessionToken } from "@repo/auth";
import type { CtxRequestEvent } from "@repo/core";
import type { Handle } from "@sveltejs/kit";

// set user and session objects on the event, this way
// they are accessible in the page load and api requests 
export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session") ?? null;
    if (token === null) {
        // not logged in
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    if (session !== null) {
        setSessionTokenCookie(event as CtxRequestEvent, token, session.expiresAt);
    } else {
        // invalid session
        deleteSessionTokenCookie(event as CtxRequestEvent);
    }

    // we have a logged in valid user!
    event.locals.session = session;
    event.locals.user = user;
    return resolve(event);
};
