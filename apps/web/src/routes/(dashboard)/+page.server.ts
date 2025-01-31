import { authMiddleware } from "@/utils/auth-middleware.js";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    return {
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
};
