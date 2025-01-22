import type { RequestEvent } from "@sveltejs/kit";
import { githubOAuth } from "@/utils/oauth";
import { db, userMetadataTable, userTable } from "@repo/db";
import { eq } from "drizzle-orm";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@repo/auth";
import type { CtxRequestEvent } from "@repo/core";

export async function GET(event: RequestEvent): Promise<Response> {
    // validate that we were redirected here in a valid way
    const code = event.url.searchParams.get("code");
    const state = event.url.searchParams.get("state");
    const storedState = event.cookies.get("github_oauth_state") ?? null;

    if (code === null || state === null || storedState === null || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    // get the github user id
    const githubUser = await githubOAuth.getUserFromAuthorizationCode(code);
    if (githubUser === undefined) {
        return new Response(null, {
            status: 400
        });
    }

    // either create a new user or link the github user to an existing one
    const userId = await githubOAuth.handleUserLoginOrLink(githubUser);

    // afterwards just create the session
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, userId);
    setSessionTokenCookie(event as CtxRequestEvent, sessionToken, session.expiresAt);

    // everything worked, send the logged in user to the homepage
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
}