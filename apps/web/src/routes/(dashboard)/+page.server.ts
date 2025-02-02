import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        if (event.locals.userMetadata.twoFactorEnabled && !event.locals.session.twoFactorVerified) {
            return redirect(302, "/2fa");
        }
    }

    return {
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
};
