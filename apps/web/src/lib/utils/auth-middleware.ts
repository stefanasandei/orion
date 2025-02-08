import { redirect, type RequestEvent } from "@sveltejs/kit";

export const authMiddleware = (event: RequestEvent): string | undefined => {
    if (event.locals.session === null || event.locals.user === null) {
        return "/";
    }

    if (event.locals.user.metadata.twoFactorEnabled && !event.locals.session.twoFactorVerified) {
        return "/2fa";
    }

    return undefined;
}
