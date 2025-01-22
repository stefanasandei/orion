import { redirect } from "@sveltejs/kit";
import { githubOAuth } from "@/utils/oauth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
    const authorizationUrl = githubOAuth.getAuthorizationUrl();

    event.cookies.set("github_oauth_state", authorizationUrl.state, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: authorizationUrl.url
        }
    });
}