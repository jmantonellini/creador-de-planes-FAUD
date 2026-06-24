<script lang="ts">
	import type { Subject } from '$lib/types';

	let {
		subject,
		disabled,
		reason,
		onclick
	}: {
		subject: Subject;
		disabled: boolean;
		reason: string | undefined;
		onclick: () => void;
	} = $props();

	// Determinar color según estado
	let bgColor = $derived(
		disabled
			? 'bg-red-100 border-red-400 hover:bg-red-200'
			: subject.status === 'regular'
				? 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200'
				: subject.status === 'approved'
					? 'bg-green-100 border-green-400 hover:bg-green-200'
					: 'bg-blue-100 border-blue-400 hover:bg-blue-200'
	);
</script>

<button
	class="w-full text-left p-1 overflow-hidden rounded-md border-2 {bgColor} transition-all text-[10px] disabled:opacity-60 z-10 tooltip-botom"
	data-tip={reason}
	class:cursor-pointer={!disabled}
	class:tooltip={disabled && reason}
	{onclick}
	{disabled}
>
	<div class="font-medium text-gray-700">{subject.name}</div>
</button>
