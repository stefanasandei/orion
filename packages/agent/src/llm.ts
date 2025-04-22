// import { ChatOpenAI } from "@langchain/openai";
// import { ChatMistralAI } from "@langchain/mistralai";

import { AIMessage } from "@langchain/core/messages";
import { ollama } from "ollama-ai-provider";

export interface LLMChatConfig {
    production: boolean;
}


export const createLLM = (config: LLMChatConfig = { production: false }) => {
    if (config.production == false) {
        return ollama("smollm2:135m")
    }

    // return mistral 3.1 / openrouter
    return ollama("smollm2:135m")

    // return new ChatOpenAI({
    //     model: "google/gemini-2.0-flash-exp:free",
    //     configuration: {
    //         baseURL: "https://openrouter.ai/api/v1",
    //         apiKey: process.env["OPENROUTER_API_KEY"],
    //     }
    // });
}

// workaround for langgraph
export const getContentFromMsg = (msg: unknown) => {
    const aimsg = msg as AIMessage;
    return aimsg.content.toString();
}
