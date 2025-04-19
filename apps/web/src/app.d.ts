// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				intern: User;
				metadata: UserMetadata;
				workspaces: (Workspace & { projects: (Project & { notes: (Note & { tags: Tag[] })[] })[] })[];
			} | null;
			session: Session | null;
		}
	}

	interface Window {
		grecaptcha: {
			render: (element: string | HTMLElement, options: unknown) => number;
			getResponse: (widget: number) => string;
			reset: (widget: number) => void;
		};
	}
}

declare module "pdfjs-dist/build/pdf.worker.mjs";

export { };
