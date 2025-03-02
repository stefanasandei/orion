import { PineconeStore } from "@langchain/pinecone";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { EmbeddingsFactory } from "./embeddings";

const index = process.env["PINECONE_INDEX"]!;
if (index == undefined) {
    console.error("env not loaded");
}

export const createVectorStore = async ({ production }: { production: boolean } = { production: false }) => {
    const pinecone = new PineconeClient();
    const pineconeIndex = pinecone.Index(index);

    const vectorStore = await PineconeStore.fromExistingIndex(EmbeddingsFactory.create({ production }), {
        pineconeIndex,
        maxConcurrency: 5,
    });

    return vectorStore;
}
