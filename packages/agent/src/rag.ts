import { cosineDistance, sql, gt, desc, and, eq } from "drizzle-orm";
import { embeddingsManager } from "./embeddings"
import { db, embeddingsTable } from "@repo/db";

export const findRelevantContent = async (userQuery: string, noteId?: number) => {
    // 1. get search query
    const userQueryEmbedded = await embeddingsManager.generateSearchQuery(userQuery);

    // 2. find similar content, using cosine similarity 
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddingsTable.embedding,
        userQueryEmbedded,
    )})`;

    const requireNote = noteId ? eq(embeddingsTable.noteId, noteId) : sql`true`;

    const similarContent = await db
        .select({ name: embeddingsTable.content, similarity })
        .from(embeddingsTable)
        .where(
            // embeddings with a cos similarity > 0.0 and from that respective note (pdf)
            and(gt(similarity, 0.0), requireNote)
        )
        .orderBy(t => desc(t.similarity))
        .limit(2);

    console.log(similarContent);
    return similarContent;
}
