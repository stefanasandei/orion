<script>
	import Lights from './lights.svelte';
</script>

<span class="block h-[420px] w-full overflow-hidden rounded-xl bg-black">
	<div class="bg-grid-white/[0.03] relative h-full w-full px-4">
		<div
			class="animate-moveUp relative z-[1] flex h-full w-full flex-col items-start justify-center sm:items-center"
		>
			<div class="relative w-full">
				<div
					class="absolute -top-12 left-0 aspect-square overflow-hidden rounded-lg border border-green-900 bg-gradient-to-br from-green-950/40 to-blue-950/40 p-1 backdrop-blur-md sm:left-1/2 sm:-translate-x-1/2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-cloud"
						><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg
					>
				</div>
			</div>
			<div
				class="bg-gradient-to-br from-white/60 via-neutral-300 to-black/[0.6] bg-clip-text text-start text-4xl font-bold text-transparent sm:text-center sm:text-5xl"
			>
				Good Hero Equals Trust.
			</div>
			<div class="mt-3 text-start text-white/[0.7] sm:text-center">
				Trusted by Trusted Companies and Trusted People
			</div>
			<div class="mt-5 flex w-full justify-center gap-4 text-white max-sm:flex-col sm:gap-10">
				<button
					class="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-green-900 bg-gradient-to-br from-green-950 to-blue-950 sm:h-8 sm:w-36"
				>
					<span>Our Work</span>
					<span class="transition-all group-hover:translate-x-0.5">&rarr;</span>
				</button>
				<button class="flex h-8 items-center justify-center underline">
					<span>contact us</span>
				</button>
			</div>
		</div>
		<div class="animate-appear absolute bottom-0 left-0 z-0 h-full w-full opacity-0">
			<Lights />
		</div>
	</div>
</span>
