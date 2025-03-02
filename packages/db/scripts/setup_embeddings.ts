// todo: test script, due to the deadline for the MVP

import { db, noteTable } from '@/index';
import { createVectorStore } from '@repo/agent';

import dotenv from 'dotenv'
import { eq } from 'drizzle-orm';
dotenv.config();

const insert = async () => {
    const notes = await db.select({
        pageContent: noteTable.textContent,
        metadata: {
            id: noteTable.id,
            userId: noteTable.userId,
            type: noteTable.type
        }
    }).from(noteTable)
        .where(eq(noteTable.userId, 40));

    const ids = notes.map((n) => n.metadata.id.toString());

    const vectorStore = await createVectorStore(false);

    await vectorStore.addDocuments(notes, { ids });
};

const query = async () => {
    const vectorStore = await createVectorStore(false);

    const similaritySearchResults = await vectorStore.similaritySearch(
        "physics",
        5,
    );

    for (const doc of similaritySearchResults) {
        console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
    }
};
