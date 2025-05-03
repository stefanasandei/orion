import { CoreMessage, Message } from "ai";

export type Messages = CoreMessage[] | Omit<Message, "id">[];

export interface Agent<
    PrepareArgs = void,
    AnswerArgs = void
> {
    // process and save to the database any data needed 
    // examples: pdf metadata generation, chapter embeddings, etc.
    prepare: (args: PrepareArgs) => void;

    // the actual work, answering user messages
    answer: (messages: Messages, args: AnswerArgs) => Response;
};
