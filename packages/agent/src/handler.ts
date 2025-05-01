import { CoreMessage, Message, streamText, tool } from "ai";
import { createLLM } from "./llm";
import { z } from 'zod';
import { findRelevantContent, searchWeb } from "./rag";

const isProd = process.env["IS_PRODUCTION"] === "true"
const useLocalStreaming = isProd ? false : true;

export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = createLLM({ production: isProd, localStreaming: useLocalStreaming });

    const result = streamText({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}

export const ragHandler = async (messages: CoreMessage[] | Omit<Message, "id">[], noteId?: number): Promise<Response> => {
    if (useLocalStreaming) {
        return chatHandler(messages);
    }

    if (noteId !== undefined) {
        // respond using ONLY pdf info
        return pdfHandler(messages, noteId);
    }

    const model = createLLM({ production: isProd, localStreaming: false });

    // query user knowledge base + the internet
    const result = streamText({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: model,
        messages: messages,
        system: `You are a helpful assistant. 
        You have access to the user's knowledge database (information written by them and their PDF document). 
        You also have access to the internet, use it to search for information not related to the user, such as general questions or questions involving news or latest advancements in a field. 
        Not all relevant information provided may aid you, if you do not find it useful, just ignore it.`,

        tools: {
            fetchUserKnowledge: tool({
                description: `get information from the user's knowledge database to answer questions.`,
                parameters: z.object({
                    query: z.string().describe('the search query'),
                }),
                execute: async ({ query }) => findRelevantContent(query, noteId),
            }),

            searchWeb: tool({
                description: `get information by searching the web`,
                parameters: z.object({
                    query: z.string().describe('the search query'),
                }),
                execute: async ({ query }) => searchWeb(query),
            })
        }
    });

    return result.toDataStreamResponse();
}

export const pdfHandler = async (messages: CoreMessage[] | Omit<Message, "id">[], noteId: number): Promise<Response> => {
    const model = createLLM({ production: isProd, localStreaming: false });

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