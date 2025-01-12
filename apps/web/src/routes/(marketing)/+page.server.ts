import { trpcServer } from "@/utils/trpc/server";

export const load = async (event) => {
    return {
        hello: await trpcServer.hello.msg.ssr(event),
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
};