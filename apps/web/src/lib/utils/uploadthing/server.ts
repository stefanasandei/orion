import { createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
// import { validateSessionToken } from "@repo/auth";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .input(z.object({ projectId: z.number() }))
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req, input }) => {
            const cookieHeader = req.headers.get("cookie");
            if (!cookieHeader) {
                throw new Error("Unauthorized");
            }

            const sessionCookie = cookieHeader.split(';')
                .find(c => c.trim().startsWith("session="))
                ?.split('=')[1];

            if (!sessionCookie) {
                throw new Error("Unauthorized");
            }

            // TODO: this has to be on the server
            // const { session, user } = await validateSessionToken(sessionCookie);
            // if (!session || !user) {
            //     throw new Error("Unauthorized");
            // }

            const metadata = { userId: 0, projectId: input.projectId };
            return metadata;
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // todo: link file url as a new note (type file) to the user's project
            // create trpc roue
            const urfsUrl = file.ufsUrl;
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
