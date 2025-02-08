import { Session, User, UserMetadata } from '@repo/db';

export type UserLocals = {
    user: {
        intern: User;
        metadata: UserMetadata;
    } | null;
    session: Session | null;
};

// work around to avoid circular imports
// a replica of RequestEvent from sveltekit
export type CtxRequestEvent = {
    locals: UserLocals,

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
