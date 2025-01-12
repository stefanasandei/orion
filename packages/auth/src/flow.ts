import { CtxRequestEvent } from "@repo/core"
import { db, userMetadataTable, userTable } from "@repo/db";
import { createSession, generateSessionToken, invalidateSession } from "./session";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "./cookie";
import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

export const registerUser = async (input: RegisterInput, event: CtxRequestEvent): Promise<AuthResponse> => {
    // TODO: more validation and error handling; move this to @repo/auth

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
    // TODO: more validation and error handling; move this to @repo/auth

    // 1. validate data - done by zod

    // 2. check user credentials
    const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(input.password)));

    const user = await db.select({ id: userMetadataTable.userId, passwordHash: userMetadataTable.passwordHash })
        .from(userMetadataTable)
        .where(eq(userMetadataTable.email, input.email))

    if (user[0]!.passwordHash != hashedPassword) {
        return { success: false, reason: AuthFailReason.WrongPassword }
    }

    // 3. all good - login user
    const token = generateSessionToken();
    const session = createSession(token, user[0]!.id);
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
}

// use these instead of raw text
// for easier i18n support
// TODO: add more reasons and implement messages
export enum AuthFailReason {
    // for sign up
    EmailDuplicate, // TODO
    BadPassword, // TODO
    UsernameTaken, // TODO

    // for login
    WrongPassword,
    EmailNotFound, // TODO
};

export type AuthResponse = {
    success: boolean;
    reason?: AuthFailReason;
}