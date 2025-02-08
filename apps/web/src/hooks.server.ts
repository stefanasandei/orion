import { deleteSessionTokenCookie, setSessionTokenCookie } from "@repo/auth";

import { validateSessionToken } from "@repo/auth";
import type { Handle } from "@sveltejs/kit";
import { createCaller } from '@repo/api';
import type { CtxRequestEvent } from '@repo/core';

// set user and session objects on the event, this way
// they are accessible in the page load and api requests 
export const handle: Handle = async ({ event, resolve }) => {
    // default state - not logged in
    event.locals.user = null;
    event.locals.session = null;

    const token = event.cookies.get("session") ?? null;
    if (token === null) {
        return resolve(event);
    }

    try {
        const { session, user, userMetadata } = await validateSessionToken(token);
        if (!session || !user || !userMetadata) {
            deleteSessionTokenCookie(event as CtxRequestEvent);
            return resolve(event);
        }

        // we have a logged in valid user!
        setSessionTokenCookie(event as CtxRequestEvent, token, session.expiresAt);
        event.locals.session = session;

        event.locals.user = {
            intern: user,
            metadata: userMetadata,
            workspaces: []
        };

        // get workspace data
        // todo: look into caching this
        const caller = createCaller({ event: event as CtxRequestEvent });
        try {
            const workspaces = await caller.user.getWorkspaces();
            event.locals.user.workspaces = workspaces;
        } catch (error) {
            console.error("Failed to fetch workspaces:", error);
            // if we fail to get workspaces, we should treat the user as logged out
            event.locals.user = null;
            event.locals.session = null;
            deleteSessionTokenCookie(event as CtxRequestEvent);
        }
    } catch (error) {
        console.error("Session validation failed:", error);
        deleteSessionTokenCookie(event as CtxRequestEvent);
    }

    return resolve(event);
};
