import { env } from "$env/dynamic/private";
import { ourFileRouter } from "@/utils/uploadthing/server";

import { createRouteHandler } from "uploadthing/server";

const handlers = createRouteHandler({
    router: ourFileRouter,
    config: {
        token: env.UPLOADTHING_TOKEN,
    },
});

export { handlers as GET, handlers as POST };
