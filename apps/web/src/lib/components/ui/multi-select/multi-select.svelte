<script lang="ts">
	import MultiSelect from 'svelte-multiselect';

	interface Props {
		selected: any[];
		options: any[];
		placeholder?: string;
		name?: string;
	}

	let { options, placeholder, name, selected = $bindable() }: Props = $props();

	const multiSelectClasses = {
		outerDivClass:
			'relative w-full px-0 border-0 items-center [&>svg:nth-child(2)]:hidden [&>button:nth-child(4)]:hidden',
		inputClass:
			'flex h-9 items-center w-full rounded-md ring-1 ring-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		ulSelectedClass: 'flex flex-wrap gap-1 mt-1',
		liSelectedClass:
			'inline-flex items-center gap-2 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
		ulOptionsClass:
			'absolute z-50 min-w-[8rem] items-center overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md mt-1 max-h-60 overflow-y-auto',
		liOptionClass:
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		liActiveOptionClass: 'bg-accent text-accent-foreground',
		liUserMsgClass:
			'relative flex cursor-default items-center select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-muted-foreground italic',
		liActiveUserMsgClass: 'bg-accent text-accent-foreground',
		maxSelectMsgClass: 'text-xs text-muted-foreground mt-1 items-center'
	};
</script>

<MultiSelect
	bind:selected
	{options}
	selectedOptionsDraggable={false}
	{...multiSelectClasses}
	{placeholder}
/>
