import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOllama } from "@langchain/ollama";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage } from "@langchain/core/messages";

export interface LLMChatConfig {
    production: boolean;
}

export class LLMChatFactory {
    static create(config: LLMChatConfig): BaseChatModel {
        if (config.production) {
            return new ChatMistralAI({
                // model: "mistral-small-latest",
                model: "open-mistral-nemo"
            });
        }
        return new ChatOllama({
            model: "llama3.2:3b",
            streaming: true
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
