import { generateSvelteHelpers } from "@uploadthing/svelte";
import type { OurFileRouter } from "./types";

export const { createUploader, createUploadThing } = generateSvelteHelpers<OurFileRouter>();
