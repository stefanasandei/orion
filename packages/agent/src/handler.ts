import { ChatOllama } from "@langchain/ollama";
import { CoreMessage, LangChainAdapter, Message } from "ai";

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = new ChatOllama({
        model: "llama3.2:3b"
    });

    const stream = await model.stream(messages);

    return LangChainAdapter.toDataStreamResponse(stream);
}
