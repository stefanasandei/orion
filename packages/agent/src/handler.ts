import { CoreMessage, LangChainAdapter, Message } from "ai";
import { LLMChatFactory } from "./llm";

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = LLMChatFactory.create({ production: false });

    const stream = await model.stream(messages);

    return LangChainAdapter.toDataStreamResponse(stream);
}
