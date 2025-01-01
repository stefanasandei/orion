import { CtxRequestEvent } from '@repo/core';

export function setSessionTokenCookie(event: CtxRequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
}

export function deleteSessionTokenCookie(event: CtxRequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}