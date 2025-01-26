// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
			userMetadata: UserMetadata | null;
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

export { };
