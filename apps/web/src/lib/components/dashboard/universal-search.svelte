<script lang="ts">
	import {
		BrainCircuit,
		Calendar,
		File,
		Home,
		MessageCircle,
		Notebook,
		NotepadText,
		Search,
		Settings,
		Sparkle,
		Sparkles
	} from 'lucide-svelte';
	import { MenuButton } from '../ui/sidebar';
	import * as Command from '$lib/components/ui/command/index.js';

	let open = $state(true);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}

		if (e.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<MenuButton onclick={() => (open = true)}>
	<Search />
	<span>Search</span>
</MenuButton>

<Command.Dialog class="w-full" bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List class="h-full max-h-max w-full">
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Search results">
			<Command.Item>
				<Notebook />
				<span>Project result</span>
			</Command.Item>
			<Command.Item>
				<NotepadText />
				<span>Note result</span>
			</Command.Item>
			<Command.Item>
				<File />
				<span>File result</span>
			</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Pages - quick navigation">
			<Command.Item>
				<BrainCircuit />
				<span>Library</span>
				<Command.Shortcut>⌘ L</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<Home />
				<span>Dashboard</span>
				<Command.Shortcut>⌘ D</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<Settings />
				<span>Settings</span>
				<Command.Shortcut>⌘ S</Command.Shortcut>
			</Command.Item>
			<Command.Item>
				<Sparkles />
				<span>Chat</span>
				<Command.Shortcut>⌘ A</Command.Shortcut>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
