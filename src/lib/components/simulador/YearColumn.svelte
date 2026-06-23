<script lang="ts">
	import type { Subject } from '$lib/types';
	import SubjectCard from './SubjectCard.svelte';

	let {
		year,
		subjects,
		allSubjects,
		onToggle,
		isDisabled,
		onApproveYear
	}: {
		year: number;
		subjects: Subject[];
		allSubjects: Subject[];
		onToggle: (year: number, id: number) => void;
		isDisabled: (
			subject: Subject,
			allSubjects: Subject[]
		) => { disabled: boolean; reason?: string };
		onApproveYear: () => void;
	} = $props();

	// Separar materias por semestre
	const anuales = $derived(subjects.filter((s) => !s.semester));
	const semestre1 = $derived(subjects.filter((s) => s.semester === 1));
	const semestre2 = $derived(subjects.filter((s) => s.semester === 2));

	$inspect(anuales).with(() => console.log('ANUALES', anuales));
	$inspect(semestre1).with(() => console.log('SEM 1', semestre1));
	$inspect(semestre2).with(() => console.log('SEM 2', semestre2));

	// Determinar el número máximo de filas
	const maxRows = $derived(Math.max(semestre1.length, semestre2.length));
</script>

<div class="card bg-base-100 shadow-md">
	<div class="card-header p-4 border-b border-base-200">
		<div class="flex items-center justify-between">
			<h3 class="card-title text-lg">
				<span class="text-xs whitespace-nowrap badge badge-soft">{year}º Año</span>
			</h3>
			<button class="btn btn-primary btn-outline btn-sm" onclick={onApproveYear}>
				✅ Aprobar Año
			</button>
		</div>
	</div>

	<div class="card-body p-4">
		<table class="table border-spacing-2 table-sm">
			<thead>
				<tr>
					<th class="w-1/2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
						1er Semestre
					</th>
					<th class="w-1/2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
						2do Semestre
					</th>
				</tr>
			</thead>
			<tbody>
				{#if subjects.length === 0}
					<tr>
						<td colspan="2" class="text-center text-gray-400 py-4">Sin materias</td>
					</tr>
				{/if}

				<!-- Materias por semestre -->
				{#each Array(maxRows), index (index)}
					<tr>
						<td class="p-1 align-top">
							{#if index < semestre1.length}
								{@const subject = semestre1[index]}
								{@const { disabled, reason } = isDisabled(subject, allSubjects)}
								<SubjectCard
									{subject}
									{disabled}
									{reason}
									onclick={() => onToggle(year, subject.id)}
								/>
							{/if}
						</td>
						<td class="p-1 align-top">
							{#if index < semestre2.length}
								{@const subject = semestre2[index]}
								{@const { disabled, reason } = isDisabled(subject, allSubjects)}
								<SubjectCard
									{subject}
									{disabled}
									{reason}
									onclick={() => onToggle(year, subject.id)}
								/>
							{/if}
						</td>
					</tr>
				{/each}

				<!-- Materias Anuales -->
				{#if anuales.length > 0}
					{#each anuales as subject (subject.id)}
						{@const { disabled, reason } = isDisabled(subject, allSubjects)}
						<tr>
							<td colspan="2" class="p-1 align-top">
								<SubjectCard
									{subject}
									{disabled}
									{reason}
									onclick={() => onToggle(year, subject.id)}
								/>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
