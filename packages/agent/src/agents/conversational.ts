import { LanguageModelV1, streamText } from "ai";

import { Agent, Messages } from "./common";
import { generalModel } from "../llm";

export class ConversationalAgent implements Agent {
    private model: LanguageModelV1;

    constructor() {
        this.model = generalModel();
    }

    public prepare() { }

    public answer(messages: Messages) {
        const result = streamText({
            model: this.model,
            messages: messages,
        });

        return result.toDataStreamResponse();
    }
}

export const conversationalAgent = new ConversationalAgent();
