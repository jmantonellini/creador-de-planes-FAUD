<script lang="ts">
	import type { Subject } from '$lib/types';

	export let subject: Subject;
	export let disabled: boolean;
	export let reason: string | undefined;
	export let onToggle: () => void;
	export let yearPlan: number | undefined;
</script>

<button
	onclick={onToggle}
	{disabled}
	class="w-full font-bold p-2 rounded text-gray-700 text-sm border-2 text-left hover:opacity-75 shadow-lg shadow-black/20"
	class:bg-red-200={disabled}
	class:border-red-500={disabled}
	class:bg-green-200={subject.status === 'approved'}
	class:border-green-500={subject.status === 'approved'}
	class:bg-yellow-200={subject.status === 'regular'}
	class:border-yellow-500={subject.status === 'regular'}
	class:bg-blue-200={subject.status === 'normal'}
	class:border-blue-500={subject.status === 'normal'}
>
	{yearPlan === 1989 && subject.oldName ? subject.oldName : subject.name}
	<span class="block text-xs text-red-900">
		{#if disabled && reason}
			<span class="block text-xs text-red-900">❗️ {reason}</span>
		{/if}
	</span>
</button>
