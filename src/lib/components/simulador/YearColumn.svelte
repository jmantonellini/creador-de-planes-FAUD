<script lang="ts">
	import type { Subject } from '$lib/types';
	import SubjectCard from './SubjectCard.svelte';

	let {
		year,
		subjects,
		allSubjects,
		yearPlan,
		onToggleStatus,
		onTogglePlan,
		onApproveYear,
		isDisabled
	}: {
		year: number;
		subjects: Subject[];
		allSubjects: Subject[];
		yearPlan: number | undefined;
		onToggleStatus: (year: number, id: number) => void;
		onTogglePlan: (year: number) => void;
		onApproveYear: (year: number) => void;
		isDisabled: (
			subject: Subject,
			allSubjects: Subject[]
		) => { disabled: boolean; reason?: string };
	} = $props();
</script>

<div class="space-y-4 bg-gray-400/20">
	<h2 class="font-bold py-2 border-t-2 border-b-2 text-white bg-[#224567] text-center text-lg">
		{year}º Año
	</h2>

	<div class="flex items-center justify-between px-4">
		<button
			onclick={() => onTogglePlan(year)}
			class="px-3 py-1 rounded text-sm border-2 hover:opacity-75 font-bold shadow-lg shadow-black/20"
			class:text-purple-700={yearPlan === 1989}
			class:bg-purple-50={yearPlan === 1989}
			class:border-purple-500={yearPlan === 1989}
			class:bg-blue-50={yearPlan === 2025}
			class:border-blue-500={yearPlan === 2025}
			class:text-blue-700={yearPlan === 2025}
		>
			Plan {yearPlan ?? 2025}
		</button>
		<button
			class="border-2 border-green-600 rounded text-emerald-800 p-1 text-sm font-semibold hover:bg-green-50 shadow-lg shadow-black/20"
			onclick={() => onApproveYear(year)}
		>
			✅ <span class="sm:inline md:hidden lg:inline">Aprobar Año</span>
		</button>
	</div>

	<div class="flex flex-col items-center px-4 pb-4 space-y-4">
		{#each subjects as subject (subject.id)}
			{@const { disabled, reason } = isDisabled(subject, allSubjects)}

			<SubjectCard
				{subject}
				{disabled}
				{reason}
				onToggle={() => onToggleStatus(year, subject.id)}
				{yearPlan}
			/>
		{/each}
	</div>
</div>
