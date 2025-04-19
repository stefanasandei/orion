import { type OurFileRouter } from "@/utils/uploadthing/server";

import { generateSvelteHelpers } from "@uploadthing/svelte";

export const { createUploader, createUploadThing } =
    generateSvelteHelpers<OurFileRouter>();
