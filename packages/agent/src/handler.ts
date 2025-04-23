import { CoreMessage, Message, streamText } from "ai";
import { createLLM } from "./llm";

const isProd = process.env["IS_PRODUCTION"] === "true"

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = createLLM({ production: isProd });

    const result = streamText({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}

export const ragHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]): Promise<Response> => {
    const model = createLLM({ production: isProd });

    const result = streamText({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}
