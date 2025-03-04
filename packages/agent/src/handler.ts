import { CoreMessage, LangChainAdapter, Message } from "ai";

import { createLLM, getContentFromMsg, LLMChatFactory } from "./llm";
import { createRAGAgent } from "./agents/rag";
import { createVectorStore } from "./vector";
import { AIMessage } from "@langchain/core/messages";

const isProd = process.env["IS_PRODUCTION"] === "true"

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = LLMChatFactory.create({ production: isProd });

    const stream = await model.stream(messages);

    return LangChainAdapter.toDataStreamResponse(stream);
}

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
