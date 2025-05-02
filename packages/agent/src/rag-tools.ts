import { cosineDistance, sql, gt, desc, and, eq } from "drizzle-orm";
import { embeddingsManager } from "./embeddings"
import { db, embeddingsTable } from "@repo/db";
import Exa from 'exa-js';

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

export const searchWeb = async (query: string) => {
    const EXA_API_KEY = process.env["EXA_API_KEY"];
    if (EXA_API_KEY === undefined) return [];

    const exa = new Exa(EXA_API_KEY);

    const results = await exa.searchAndContents(
        query,
        { text: true, type: 'keyword', numResults: 2 }
    );

    console.log(results);
    return results;
}