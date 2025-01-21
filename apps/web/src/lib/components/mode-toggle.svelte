<script lang="ts">
	import { Button } from '@/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '@/components/ui/dropdown-menu';
	import { Icons } from '@/components/icons.svelte';
	import { preferences } from '@/utils/stores';

	function setTheme(theme: 'light' | 'dark') {
		preferences.update((prefs) => ({ ...prefs, theme }));
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		<Button variant="ghost" size="sm" class="h-8 w-8 px-0">
			<Icons.sun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Icons.moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span class="sr-only">Toggle theme</span>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end" class="border-border">
		<DropdownMenuItem onclick={() => setTheme('light')}>
			<Icons.sun class="mr-2 h-4 w-4" />
			<span>Light</span>
		</DropdownMenuItem>
		<DropdownMenuItem onclick={() => setTheme('dark')}>
			<Icons.moon class="mr-2 h-4 w-4" />
			<span>Dark</span>
		</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
