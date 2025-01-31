<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { Separator } from '@/components/ui/separator';
	import type { User, UserMetadata } from '@repo/db';
	import type { Snippet } from 'svelte';
	import Seo from '../seo.svelte';
	import { page } from '$app/state';

	interface Props {
		pageName: string;
		user: User;
		metadata: UserMetadata;
		children: Snippet;
	}

	const { pageName, metadata, user, children }: Props = $props();

	const pathname = $derived(page.url.pathname);
</script>

<Seo title={pageName} description="" />

<Sidebar.Provider class="overflow-hidden">
	<AppSidebar user={{ name: metadata.name, email: metadata.email }} {pathname} />
	<Sidebar.Inset>
		<header
			class="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:hidden"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<p>{pageName}</p>
			</div>
		</header>
		<div class="bg-background h-full overflow-hidden rounded-md p-2 md:m-2">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
