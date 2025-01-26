// auth flow for traditional email & password login
// see ./oauth for utility classes to use for oauth

import { CtxRequestEvent } from "@repo/core"
import { db, userMetadataTable, userTable } from "@repo/db";
import { createSession, generateSessionToken, invalidateSession } from "./session";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "./cookie";
import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export const registerUser = async (input: RegisterInput, event: CtxRequestEvent): Promise<AuthResponse> => {
    // 1. validate data - done by zod

    // 2. insert user (and his metadata) in the database
    const newUser = await db.insert(userTable)
        .values({})
        .returning({ id: userTable.id });

    const hashedPassword = sha256(new TextEncoder().encode(input.password));

    await db.insert(userMetadataTable).values({
        name: input.name,
        email: input.email,
        passwordHash: encodeHexLowerCase(hashedPassword),
        userId: newUser[0]!.id
    });

    // 3. create the session and set the cookie
    const token = generateSessionToken();
    const session = createSession(token, newUser[0]!.id);
    setSessionTokenCookie(event, token, (await session).expiresAt);

    return { success: true };
}

export const loginUser = async (input: LoginInput, event: CtxRequestEvent): Promise<AuthResponse> => {
    // 1. validate data - done by zod

    // 2. check user credentials
    const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(input.password)));

    const userQuery = await db.select({
        id: userMetadataTable.userId,
        passwordHash: userMetadataTable.passwordHash,
        rememberMe: userMetadataTable.rememberMe
    })
        .from(userMetadataTable)
        .where(eq(userMetadataTable.email, input.email))

    if (userQuery.length === 0) {
        return {
            success: false,
            reason: AuthFailReason.EmailNotFound
        }
    }

    const user = userQuery[0]!;

    if (user.passwordHash != hashedPassword) {
        return { success: false, reason: AuthFailReason.WrongPassword }
    }

    // 3. store if the user wants to stay logged in
    const rememberMe = input.rememberMe ? 1 : 0;
    if (user.rememberMe != rememberMe) {
        await db.update(userMetadataTable)
            .set({ rememberMe: rememberMe })
            .where(eq(userMetadataTable.userId, user.id));
    }

    // 4. all good - login user
    const token = generateSessionToken();
    const session = createSession(token, user.id);
    setSessionTokenCookie(event, token, (await session).expiresAt);

    return { success: true };
};

export const logoutUser = async (event: CtxRequestEvent): Promise<AuthResponse> => {
    // delete the session and its cookie
    invalidateSession(event.locals.session.id);
    deleteSessionTokenCookie(event);

    return { success: true };
};

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
    rememberMe: boolean;
}

// use these instead of raw text
// for easier i18n support
export enum AuthFailReason {
    // for sign up
    EmailDuplicate, // TODO
    BadPassword, // TODO
    UsernameTaken, // TODO

    // for login
    WrongPassword,
    EmailNotFound,
    RateLimited
};

export type AuthResponse = {
    success: boolean;
    reason?: AuthFailReason;
}