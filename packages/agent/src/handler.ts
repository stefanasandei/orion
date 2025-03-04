import { CoreMessage, LangChainAdapter, Message } from "ai";

import { createLLM, LLMChatFactory } from "./llm";
import { createRAGAgent } from "./agents/rag";
import { createVectorStore } from "./vector";

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = LLMChatFactory.create({ production: false });

    const stream = await model.stream(messages);

    return LangChainAdapter.toDataStreamResponse(stream);
}

export const ragHandler = async (question: string) => {
    const config = { production: false };

    const vectorStore = await createVectorStore(config)
    const llm = createLLM(config);

    const agent = await createRAGAgent(vectorStore, llm);

    const stream = await agent.stream({ question });
    return LangChainAdapter.toDataStreamResponse(stream);
}
