import { generateState, OAuth2Tokens } from "arctic";
import { GitHub } from "arctic";

export class GithubOAuthProvider {
    github: GitHub;

    // to be initialized server-side 
    constructor(GITHUB_CLIENT_ID: string, GITHUB_CLIENT_SECRET: string) {
        this.github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null);
    }

    getAuthorizationUrl(): { state: string, url: string } {
        const state = generateState();
        const url = this.github.createAuthorizationURL(state, ["read:user", "user:email"]);

        return {
            url: url.toString(), state
        };
    }

    async getUserFromAuthorizationCode(code: string): Promise<{ id: number, name: string, email: string } | undefined> {
        // 1. get the bearer token from github
        let tokens: OAuth2Tokens;
        try {
            tokens = await this.github.validateAuthorizationCode(code);
        } catch {
            return undefined;
        }

        // 2. get user metadata using the github api
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`
            }
        });

        const githubUser = await userResponse.json() as { id: string, login: string };
        const githubUserId = parseInt(githubUser.id);
        const githubName = githubUser.login;

        const userEmailResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`
            }
        });
        const userEmail = await userEmailResponse.json() as { primary: boolean; email: string }[];
        const actualEmail = userEmail.find(e => e.primary)?.email;

        return { id: githubUserId, name: githubName, email: actualEmail ?? userEmail[0]!.email };
    }
}
