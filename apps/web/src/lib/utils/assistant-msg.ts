import { parse } from "marked";

export const formatMessageContent = (content: string) => {
    // render md to html
    const rendered = parse(content, {
        async: false
    }) as string;

    // will be cleaned in html-preview component
    return rendered;
}
