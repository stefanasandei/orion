import { generateState, OAuth2Tokens, GitHub } from "arctic";
import { db, userMetadataTable, userTable } from "@repo/db";
import { eq } from "drizzle-orm";

interface CommonOAuthUser {
    id: number;
    name: string;
    email: string;
}

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

    async getUserFromAuthorizationCode(code: string): Promise<CommonOAuthUser | undefined> {
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

    async handleUserLoginOrLink(commonUser: CommonOAuthUser): Promise<number> {
        // is it a new user? => create the user
        const userQuery = await db.select({ id: userTable.id, githubId: userTable.githubId })
            .from(userTable).where(eq(userTable.githubId, commonUser.id));

        let userId: number;
        if (userQuery.length == 0) {
            // no user with that github account found

            // ok but what if he signed up using email & password
            // and now wants to link his github account?
            // 1. check if there is a user where email == github email
            const userEmailQuery = await db.select({ email: userMetadataTable.email, userId: userMetadataTable.userId })
                .from(userMetadataTable).where(eq(userMetadataTable.email, commonUser.email));

            if (userEmailQuery.length > 0) {
                // 2. set the github id to the existing user
                await db.update(userTable).set({ githubId: commonUser.id })
                    .where(eq(userTable.id, userEmailQuery[0]!.userId));

                userId = userEmailQuery[0]!.userId;
            } else {
                // no user found, create a new one
                const newUser = await db.insert(userTable)
                    .values({ githubId: commonUser.id })
                    .returning({ id: userTable.id });

                await db.insert(userMetadataTable).values({
                    name: commonUser.name,
                    email: commonUser.email,
                    passwordHash: "",
                    userId: newUser[0]!.id
                });

                userId = newUser[0]!.id;
            }
        } else {
            // existing user
            userId = userQuery[0]!.id;
        }

        return userId;
    }
}
