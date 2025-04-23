import { db, embeddingsTable } from "@repo/db";
import { CohereClient } from "cohere-ai";
import { EmbedByTypeResponseEmbeddings } from "cohere-ai/api/types";
import { eq } from "drizzle-orm";

class EmbeddingsManager {
    private cohere: CohereClient;

    private static EMBEDDINGS_MODEL = 'embed-v4.0';

    constructor() {
        this.cohere = new CohereClient({
            token: process.env["COHERE_API_KEY"]
        });
    }

    public async upsert(text: string, noteId: number) {
        // 1. does the text already have embeddings? delete them
        await db.delete(embeddingsTable)
            .where(eq(embeddingsTable.noteId, noteId));

        // 2. split the document into batches of chunks
        // each batch has at most 96 chunks
        const batches = this.chunk(text);

        for (const batch of batches) {
            try {
                // 3. get embeddings from cohere
                const response = await this.cohere.embed({
                    texts: batch,
                    model: EmbeddingsManager.EMBEDDINGS_MODEL,
                    inputType: 'search_document',
                    embeddingTypes: ['float'],
                });

                const embeddingsResponse = response.embeddings as EmbedByTypeResponseEmbeddings;
                if (embeddingsResponse == undefined)
                    throw "Failed to generate embeddings.";

                const embeddings = embeddingsResponse.float!
                    .map((embedding, index) => ({
                        noteId: noteId,
                        embedding,
                        content: batch[index]!
                    }));

                // 4. insert the embedding into the database
                await db.insert(embeddingsTable)
                    .values(embeddings);
            } catch (error) {
                console.error('Embedding error:', error);
            }
        }
    }

    public async insertImage(_imageURL: string, _noteId: number) {
        // TODO
    }

    // this is juicy btw :)
    public async insertPDF(_pdfURL: string, _noteId: number) {
        // TODO
    }

    public async delete(noteId: number) {
        await db
            .delete(embeddingsTable)
            .where(eq(embeddingsTable.id, noteId));
    }

    // ------------ private methods ------------

    private static batchArray<T>(arr: T[], batchSize: number): T[][] {
        const batches: T[][] = [];
        for (let i = 0; i < arr.length; i += batchSize) {
            batches.push(arr.slice(i, i + batchSize));
        }
        return batches;
    }

    private chunk(text: string, maxTokens: number = 512): string[][] {
        const words = text.split(' ');
        const chunks: string[] = [];
        let currentChunk: string[] = [];

        for (const word of words) {
            currentChunk.push(word);
            if (currentChunk.join(' ').length >= maxTokens) {
                chunks.push(currentChunk.join(' '));
                currentChunk = [];
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
        }

        return EmbeddingsManager.batchArray(chunks, 96);
    }
}

export const embeddingsManager = new EmbeddingsManager();
