import { BaseChatModel } from "@langchain/core/language_models/chat_models";
// import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

// import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage } from "@langchain/core/messages";

export interface LLMChatConfig {
    production: boolean;
}

export class LLMChatFactory {
    static create(_config: LLMChatConfig): BaseChatModel {
        // for debug

        // if (config.production) {
        //     return new ChatMistralAI({
        //         // model: "mistral-small-latest",
        //         model: "open-mistral-nemo"
        //     });
        // }

        // return new ChatOllama({
        //     model: "smollm2:135m",
        //     streaming: true
        // });

        return new ChatOpenAI({
            model: "google/gemini-2.0-flash-exp:free",
            configuration: {
                baseURL: "https://openrouter.ai/api/v1",
                apiKey: process.env["OPENROUTER_API_KEY"],
            }
        });
    }
}

export const createLLM = (config: LLMChatConfig = { production: false }) => {
    return LLMChatFactory.create(config);
}

// workaround for langgraph
export const getContentFromMsg = (msg: unknown) => {
    const aimsg = msg as AIMessage;
    return aimsg.content.toString();
}
