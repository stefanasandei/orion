import { Session, User, UserMetadata, Workspace, Project, Note, Tag } from '@repo/db';

export type UserLocals = {
    user: {
        intern: User;
        metadata: UserMetadata;
        workspaces: (Workspace & { projects: (Project & { notes: (Note & { tags: Tag[] })[] })[] })[];
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
