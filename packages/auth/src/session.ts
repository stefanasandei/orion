import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { type User, type Session, db, sessionTable, userTable, userMetadataTable, UserMetadata } from "@repo/db";
import { eq } from "drizzle-orm";

const SECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const SESSION_DAY_EXPIRATIONS = SECONDS_IN_DAY * 4; // 4 days

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + SESSION_DAY_EXPIRATIONS),
        twoFactorVerified: false,
    };

    await db.insert(sessionTable).values(session);
    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    // 1. is the session in our db?
    const result = await db
        .select({ user: userTable, session: sessionTable, userMetadata: userMetadataTable })
        .from(sessionTable)
        .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
        .innerJoin(userMetadataTable, eq(userMetadataTable.userId, userTable.id))
        .where(eq(sessionTable.id, sessionId));
    if (result.length < 1 || result == undefined) {
        return { session: null, user: null, userMetadata: null };
    }

    const { user, session, userMetadata } = result[0]!;

    // 2. did it expire?
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
        return { session: null, user: null, userMetadata: null };
    }

    // 3. is it close to expire? let's extend it if the user wants that
    if ((userMetadata.rememberMe) && Date.now() >= session.expiresAt.getTime() - SESSION_DAY_EXPIRATIONS / 2) {
        // less than 2 days
        session.expiresAt = new Date(Date.now() + SECONDS_IN_DAY * 30);
        await db.update(sessionTable)
            .set({ expiresAt: session.expiresAt })
            .where(eq(sessionTable.id, sessionId));
    }

    return { session, user, userMetadata };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
    | { session: Session; user: User; userMetadata: UserMetadata }
    | { session: null; user: null; userMetadata: null };
