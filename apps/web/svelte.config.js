import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

import dotenv from 'dotenv';
dotenv.config();
if (process.env['GITHUB_CLIENT_ID'] != undefined) {
	console.log('env loaded');
} else {
	console.error('failed to load env');
}

const jiti = createJiti(fileURLToPath(import.meta.url));
// await jiti.import('./src/lib/utils/env.ts');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({}),
		alias: {
			$base: '.',
			'@/*': './src/lib/*'
		}
	}
};

export default config;
