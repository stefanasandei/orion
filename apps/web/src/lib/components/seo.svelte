<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';

	interface Props {
		title: string;
		description: string;
		image?: string;
	}

	const domain = dev ? 'example.com' : 'orion.asandei.com';

	let { title, description, image }: Props = $props();
</script>

<svelte:head>
	<title>{title} | Orion</title>
	<meta name="description" content={description} />
	<meta property="og_site_name" content="Orion" />
	<meta property="og:url" content="https://{domain}{page.url.pathname.toString()}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={domain} />
	<meta property="twitter:url" content="https://{domain}{page.url.pathname.toString()}" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
