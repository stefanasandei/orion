import { Embeddings } from "@langchain/core/embeddings";
import { OllamaEmbeddings } from "@langchain/ollama";
// import { MistralAIEmbeddings } from "@langchain/mistralai";

export interface EmbeddingsConfig {
    production: boolean;
}

export class EmbeddingsFactory {
    static create(_config: EmbeddingsConfig): Embeddings {
        // if (config.production && false) {
        //     return new MistralAIEmbeddings({
        //         model: "mistral-embed"
        //     });
        // }
        return new OllamaEmbeddings({
            model: "nomic-embed-text:latest"
        });
    }
}

// TODO(agent): use vercel ai sdk instead
export const getEmbeddings = async (text: string, production: boolean = false) => {
    const embeddings = EmbeddingsFactory.create({ production });
    return await embeddings.embedQuery(text);
}

/*
1. implement debug things to delete all embeddings and regenerate all embeddings

2. split each text content into *chunks*, *hash* them (and link them to the resource id)
if the hash changes, redo the embeddings
*/
