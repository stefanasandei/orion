import { CoreMessage, Message, streamText, tool } from "ai";
import { createLLM } from "./llm";
import { z } from 'zod';
import { findRelevantContent } from "./rag";

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

export const ragHandler = async (messages: CoreMessage[] | Omit<Message, "id">[], noteId: number): Promise<Response> => {
    const model = createLLM({ production: isProd });

    const result = streamText({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: model,
        messages: messages,
        system: `You are a helpful assistant. You have access to a PDF document.
        Only respond to questions using information from tool calls.
        if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
        tools: {
            getInformation: tool({
                description: `get information from the PDF document to answer questions.`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({ question }) => findRelevantContent(question, noteId),
            })
        }
    });

    return result.toDataStreamResponse();
}
