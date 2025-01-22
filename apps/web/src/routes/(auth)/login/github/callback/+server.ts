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

    // is it a new user? => create the user
    const userQuery = await db.select({ id: userTable.id, githubId: userTable.githubId })
        .from(userTable).where(eq(userTable.githubId, githubUser.id));

    let userId: number;
    if (userQuery.length == 0) {
        // no user with that github account found

        // ok but what if he signed up using email & password
        // and now wants to link his github account?
        // 1. check if there is a user where email == github email
        const userEmailQuery = await db.select({ email: userMetadataTable.email, userId: userMetadataTable.userId })
            .from(userMetadataTable).where(eq(userMetadataTable.email, githubUser.email));

        if (userEmailQuery.length > 0) {
            // 2. set the github id to the existing user
            await db.update(userTable).set({ githubId: githubUser.id })
                .where(eq(userTable.id, userEmailQuery[0]!.userId));

            userId = userEmailQuery[0]!.userId;
        } else {
            // no user found, create a new one
            const newUser = await db.insert(userTable)
                .values({ githubId: githubUser.id })
                .returning({ id: userTable.id });

            await db.insert(userMetadataTable).values({
                name: githubUser.name,
                email: githubUser.email,
                passwordHash: "",
                userId: newUser[0]!.id
            });

            userId = newUser[0]!.id;
        }
    } else {
        // existing user
        userId = userQuery[0]!.id;
    }

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