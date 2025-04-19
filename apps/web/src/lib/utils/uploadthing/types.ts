import type { FileRoute } from "uploadthing/types";

export type OurFileRouter = {
    imageUploader: FileRoute<{
        input: {
            projectId: number;
        };
        output: null;
        errorShape: null;
    }>
}
