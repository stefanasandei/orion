import { LanguageModelV1, streamText, tool } from "ai";
import { z } from 'zod';

import { findRelevantContent } from "../utils/rag-tools";
import { Agent, Messages } from "./common";
import { generalModel } from "../llm";

type PDFAnswer = { noteId: number };

export class PDFAgent implements Agent<void, PDFAnswer> {
    private model: LanguageModelV1;

    private static SYSTEM_PROMPT = `You are a helpful assistant. You have access to a PDF document.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`;

    constructor() {
        this.model = generalModel();
    }

    public prepare() { }

    public answer(messages: Messages, args: PDFAnswer) {
        const result = streamText({
            model: this.model,

            messages: messages,
            system: PDFAgent.SYSTEM_PROMPT,

            maxSteps: 2,
            tools: {
                getInformation: tool({
                    description: `get information from the PDF document to answer questions.`,
                    parameters: z.object({
                        question: z.string().describe('the users question'),
                    }),
                    execute: async ({ question }) => findRelevantContent(question, args.noteId),
                })
            }
        });

        return result.toDataStreamResponse();
    }
}

export const pdfAgent = new PDFAgent();
