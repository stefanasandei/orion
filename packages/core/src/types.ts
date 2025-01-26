import { Session, User } from '@repo/db';

// work around to avoid circular imports
// a replica of RequestEvent from sveltekit
export type CtxRequestEvent = {
    locals: {
        user: User,
        session: Session
    },

    getClientAddress: () => string,

    cookies: {
        set: (name: string, value: string, opts: {
            httpOnly?: boolean,
            sameSite?: string,
            maxAge?: number,
            expires?: Date,
            path?: string
        }) => void;
    }
}
