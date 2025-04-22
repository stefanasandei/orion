import { CoreMessage, Message, streamText } from "ai";
import { createVectorStore } from "./vector";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RAG_PROMPT } from "./prompts/rag";
import { createLLM } from "./llm";

const isProd = process.env["IS_PRODUCTION"] === "true"

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = createLLM({ production: isProd });

    const result = streamText({
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}

export const ragHandler = async (message: string): Promise<Response> => {
    const model = createLLM({ production: isProd });
    const vectorStore = await createVectorStore({ production: isProd });

    const retrievedDocs = await vectorStore.similaritySearchWithScore(message, 2);
    const context = retrievedDocs
        .filter((doc) => doc[1] > 0.5)
        .join("\n")

    const promptTemplate = ChatPromptTemplate.fromTemplate(RAG_PROMPT);

    const prompt = (await promptTemplate.invoke({
        context: context,
        question: message
    })).toString();

    const result = streamText({
        model: model,
        prompt: prompt,
    });

    return result.toDataStreamResponse();
}
