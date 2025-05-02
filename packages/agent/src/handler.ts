import { CoreMessage, Message, streamText, tool } from "ai";
import { generalModel } from "./llm";
import { z } from 'zod';
import { findRelevantContent, searchWeb } from "./rag-tools";

export const ragHandler = async (messages: CoreMessage[] | Omit<Message, "id">[], noteId?: number): Promise<Response> => {
    if (noteId !== undefined) {
        // respond using ONLY pdf info
        return pdfHandler(messages, noteId);
    }

    const model = generalModel();

    // query user knowledge base + the internet
    const result = streamText({
        model: model,

        messages: messages,
        system: `You are a helpful assistant. You have access to the user's knowledge database (information written by them and their PDF document). You also have access to the internet, use it to search for information not related to the user, such as general questions.
        If the user question does not require an external search, you can choose to not use any tool.
        Not all relevant information provided may aid you, if you do not find it useful, just ignore it.`,

        maxSteps: 4,
        tools: {
            searchUserKnowledge: tool({
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
    const model = generalModel();

    const result = streamText({
        model: model,

        messages: messages,
        system: `You are a helpful assistant. You have access to a PDF document.
        Only respond to questions using information from tool calls.
        if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,

        maxSteps: 2,
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

// basic method, kept for debug
export const chatHandler = async (messages: CoreMessage[] | Omit<Message, "id">[]) => {
    const model = generalModel();

    // check credits
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env["OPENROUTER_API_KEY"]!}`,
        },
    });
    const openrouterCreditInfo = await response.json();
    console.log(openrouterCreditInfo);


    const result = streamText({
        model: model,
        messages: messages,
    });

    return result.toDataStreamResponse();
}
