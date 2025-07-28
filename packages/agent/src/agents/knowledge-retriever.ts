import { LanguageModelV1, streamText, tool } from "ai";
import { z } from 'zod';

import { findRelevantContent, searchWeb } from "../utils/rag-tools";
import { Agent, Messages } from "./common";
import { generalModel } from "../llm";

export class KnowledgeRetrieverAgent implements Agent {
    private model: LanguageModelV1;

    // private static SYSTEM_PROMPT = `You are a helpful assistant. You have access to the user's knowledge database (information written by them and their PDF document). You also have access to the internet, use it to search for information after your knowledge time caught off or if it is not related to the user, such as general questions.
    // If the user question does not require an external search, you can choose to not use any tool.
    // Not all relevant information provided may aid you, if you do not find it useful, just ignore it.`;

    private static SYSTEM_PROMPT = `You are Orion, an AI assistant. You can help users by searching their personal knowledge library, the web, or by directly answering questions.

**Available Tools:**
- 'searchUserKnowledge(query: str)': Use this tool to find information within the user's personal documents, notes, and uploaded PDFs. Prioritize this tool for questions that seem specific to the user's private data or personal context.
- 'searchWeb(query: str)': Use this tool to search the internet for general knowledge, current events, or information that is likely not contained in the user's personal library. Use this when your internal knowledge cutoff applies or when the user's question is not about their personal data.

**Decision Rules:**
1.  **User-Specific Questions:** If the user's question pertains to their personal information, notes, or uploaded documents, first attempt to use the 'searchUserKnowledge' tool.
2.  **General Knowledge/Public Information:** If the question is about general facts, public information, or current events, use the 'searchWeb' tool.
3.  **Direct Answer:** If you can confidently answer the question without needing external information (e.g., simple arithmetic, definitions you already know, or information already provided in the prompt), do not use any tools and provide a direct answer.
4.  **Ambiguity:** If the question is ambiguous or could potentially be in both the user's library and the web, consider trying 'searchUserKnowledge' first if there's any hint of personal relevance, otherwise use 'searchWeb'.
5.  **After Tool Use:** After calling a tool, carefully evaluate the results. Only use the information that is directly relevant to the user's query. Ignore irrelevant or unhelpful results.

Always strive to use the most efficient tool for the user's request.    
`;

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
