import { authMiddleware } from "@/utils/auth-middleware.js";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const redirectUrl = authMiddleware(event);
    if (redirectUrl !== undefined) {
        redirect(302, redirectUrl);
    }

    return {
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
};
