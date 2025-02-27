<script lang="ts">
	import { formatDate } from '../../utils/datetime';
	import { language } from '../../utils/state';
	import { Icons } from '../icons.svelte';
	import { Button } from '../ui/button';
	import Separator from '../ui/separator/separator.svelte';

	const currDate = $derived(
		language.current != 'en' ? formatDate(new Date(), 'ro-RO') : formatDate()
	);
</script>

<div
	class="border-muted hover:bord bg-card hover:bg-card/30 flex flex-col gap-4 rounded-lg border-2 p-3 transition-all md:col-span-1 md:h-full"
>
	<div class="flex flex-col items-start gap-2">
		<p class="text-card-foreground/90">Today it's</p>
		<p class="text-primary-foreground">{currDate}</p>
	</div>

	<div class="mt-4 flex flex-col items-start gap-2">
		<div class="flex w-full flex-row items-center justify-between">
			<p class="text-2xl font-semibold md:text-xl">📌 Tasks for today</p>
			<Button size="small-icon"><Icons.add /></Button>
		</div>
		<Separator />

		<ul class="ml-4 list-inside list-disc md:text-lg">
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
		</ul>
	</div>

	<div class="mt-4 flex flex-col items-start gap-2">
		<p class="text-2xl font-semibold md:text-xl">🗞 Newsfeed</p>
		<Separator />

		<ul class="ml-4 list-inside list-disc md:text-lg">
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
			<li>do some work</li>
		</ul>
	</div>
</div>
