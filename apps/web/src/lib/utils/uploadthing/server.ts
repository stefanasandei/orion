import { createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { z } from "zod";
import type { CtxRequestEvent } from "@repo/core";
import { createCaller } from "@repo/api";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            maxFileSize: "64MB",
            maxFileCount: 10,
        },
        pdf: {
            maxFileSize: "64MB",
            maxFileCount: 10,
        }
    })
        .input(z.object({ projectId: z.number() }))
        .middleware(async ({ req, input }) => {
            // 1. get the session token value
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

            // 2. check if it's valid
            const caller = createCaller({ event: req as unknown as CtxRequestEvent });
            const user = await caller.user.verifySession({
                session: sessionCookie
            });

            if (user == null) {
                throw new Error("Unauthorized");
            }

            // 3. return metadata
            const metadata = { userId: user.id, projectId: input.projectId };
            return metadata;
        })
        .onUploadComplete(async ({ metadata, file, req }) => {
            const caller = createCaller({ event: req as unknown as CtxRequestEvent });

            await Promise.all([
                // First create the file note
                caller.project.createFileNote({
                    fileUrl: file.ufsUrl,
                    filename: file.name,
                    projectId: metadata.projectId,
                    userId: metadata.userId
                }),

                // Only track usage after successful file creation
                caller.user.trackUsage({
                    userId: metadata.userId,
                    fileSize: file.size
                })
            ]);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
