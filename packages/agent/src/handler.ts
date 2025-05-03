import { conversationalAgent } from "./agents/conversational";
import { pdfAgent } from "./agents/pdf";
import { knowledgeRetrieverAgent } from "./agents/knowledge-retriever";
import { Messages } from "./agents/common";

export const ragHandler = async (messages: Messages, noteId?: number): Promise<Response> => {
    if (noteId !== undefined) {
        // respond using ONLY pdf info
        return pdfAgent.answer(messages, { noteId });
    }

    return knowledgeRetrieverAgent.answer(messages);
}

export const chatHandler = async (messages: Messages) => {
    // check credits
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env["OPENROUTER_API_KEY"]!}`,
        },
    });
    const openrouterCreditInfo = await response.json();
    console.log(openrouterCreditInfo);

    return conversationalAgent.answer(messages);
}
