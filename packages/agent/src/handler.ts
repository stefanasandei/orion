import { CoreMessage, Message, streamText } from "ai";

import { createLLM, getContentFromMsg } from "./llm";
import { createRAGAgent } from "./agents/rag";
import { createVectorStore } from "./vector";
import { AIMessage } from "@langchain/core/messages";
import { ollama } from "ollama-ai-provider";

const isProd = process.env["IS_PRODUCTION"] === "true"

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = ollama("smollm2:135m");

    const result = streamText({
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}

// todo: use vercel ai sdk, instead of langchain
export const ragHandler = async (question: string): Promise<Response> => {
    const config = { production: isProd };

    const vectorStore = await createVectorStore(config)
    const llm = createLLM(config);

    const agent = await createRAGAgent(vectorStore, llm);

    const result = await agent.invoke({ question });

    const msg = new AIMessage({
        content: getContentFromMsg(result.answer),
    })

    return new Response(JSON.stringify(msg));
}
