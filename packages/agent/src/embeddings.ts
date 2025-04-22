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

// todo: use vercel ai sdk instead
export const getEmbeddings = async (text: string, production: boolean = false) => {
    const embeddings = EmbeddingsFactory.create({ production });
    return await embeddings.embedQuery(text);
}
