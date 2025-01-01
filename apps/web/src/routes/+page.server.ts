import { trpcServer } from "$lib/trpc/server";

export const load = async (event) => {
    return {
        hello: await trpcServer.hello.msg.ssr(event),
        user: event.locals.user
    };
};