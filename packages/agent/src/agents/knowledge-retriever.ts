import { LanguageModelV1, streamText, tool } from "ai";
import { z } from 'zod';

import { findRelevantContent, searchWeb } from "../utils/rag-tools";
import { Agent, Messages } from "./common";
import { generalModel } from "../llm";

export class KnowledgeRetrieverAgent implements Agent {
    private model: LanguageModelV1;

    private static SYSTEM_PROMPT = `You are a helpful assistant. You have access to the user's knowledge database (information written by them and their PDF document). You also have access to the internet, use it to search for information not related to the user, such as general questions.
    If the user question does not require an external search, you can choose to not use any tool.
    Not all relevant information provided may aid you, if you do not find it useful, just ignore it.`;

    constructor() {
        this.model = generalModel();
    }

    public prepare() { }

    public answer(messages: Messages) {
        const result = streamText({
            model: this.model,

            messages: messages,
            system: KnowledgeRetrieverAgent.SYSTEM_PROMPT,

            maxSteps: 4,
            tools: {
                searchUserKnowledge: tool({
                    description: `get information from the user's knowledge database to answer questions.`,
                    parameters: z.object({
                        query: z.string().describe('the search query'),
                    }),
                    execute: async ({ query }) => findRelevantContent(query),
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
}

export const knowledgeRetrieverAgent = new KnowledgeRetrieverAgent();
