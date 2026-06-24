<script lang="ts">
	import * as htmlToImage from 'html-to-image';
	import {
		plans,
		activePlanId,
		simSubjects,
		getPlan,
		getSubjectsByYear,
		savePlan,
		createDefaultPlan
	} from '$lib/stores/planesStore.svelte';
	import type { Subject, Requirement } from '$lib/types';
	import YearColumn from './YearColumn.svelte';
	import { defaultSubjects } from '$lib/subjects';

	let selectedPlanId = $state<string | null>(null);
	let currentSubjects = $state<Record<number, Subject[]>>({});
	let maxYear = $derived(
		Object.keys(currentSubjects).length > 0
			? Math.max(...Object.keys(currentSubjects).map(Number))
			: 0
	);

	// Cargar plan al inicio
	$effect(() => {
		// Si hay un plan activo, cargarlo
		if (activePlanId.value) {
			const subjects = getSubjectsByYear(activePlanId.value);
			currentSubjects = subjects;
			selectedPlanId = activePlanId.value;
		} else {
			// Si no hay plan activo, usar simSubjects o crear default
			if (Object.keys(simSubjects.value).length > 0) {
				currentSubjects = simSubjects.value;
			} else {
				// Crear plan por defecto
				const defaultPlan = createDefaultPlan();
				savePlan(defaultPlan);
				activePlanId.value = defaultPlan.id;
				currentSubjects = defaultSubjects;
				simSubjects.value = defaultSubjects;
				selectedPlanId = defaultPlan.id;
			}
		}
	});

	function loadPlan(planId: string | null) {
		if (planId) {
			const plan = getPlan(planId);
			if (plan) {
				const subjects = getSubjectsByYear(planId);
				currentSubjects = subjects;
				simSubjects.value = subjects;
				activePlanId.value = planId;
				selectedPlanId = planId;
			}
		} else {
			// Cargar plan por defecto
			const defaultPlan = createDefaultPlan();
			savePlan(defaultPlan);
			const subjects = getSubjectsByYear(defaultPlan.id);
			currentSubjects = subjects;
			simSubjects.value = subjects;
			activePlanId.value = defaultPlan.id;
			selectedPlanId = defaultPlan.id;
		}
	}

	function toggleStatus(year: number, id: number) {
		const list = currentSubjects[year] ?? [];
		const subject = list.find((s) => s.id === id);
		if (!subject) return;

		subject.status =
			subject.status === 'normal'
				? 'regular'
				: subject.status === 'regular'
					? 'approved'
					: 'normal';

		currentSubjects = { ...currentSubjects };
		simSubjects.value = currentSubjects;
	}

	function hasRequiredStatus(subjects: Subject[], requirement: Requirement): boolean {
		const target = subjects.find((s) => s.id === requirement.subjectId);
		if (!target) return false;
		return requirement.requiredStatus === 'regular'
			? target.status === 'regular' || target.status === 'approved'
			: target.status === 'approved';
	}

	function isDisabled(subject: Subject, allSubjects: Subject[]) {
		if (
			subject.status === 'normal' &&
			!subject.requiredToEnroll.every((r) => hasRequiredStatus(allSubjects, r))
		) {
			return { disabled: true, reason: 'Faltan correlativas para cursar' };
		}

		if (
			subject.status === 'regular' &&
			!subject.requiredToApprove.every((r) => hasRequiredStatus(allSubjects, r))
		) {
			return { disabled: true, reason: 'Faltan correlativas para aprobar' };
		}

		return { disabled: false };
	}

	function resetAll() {
		const defaultPlan = createDefaultPlan();
		savePlan(defaultPlan);
		currentSubjects = defaultSubjects;
		simSubjects.value = defaultSubjects;
		activePlanId.value = defaultPlan.id;
		selectedPlanId = defaultPlan.id;
	}

	function approveYear(year: number) {
		for (let y = 1; y <= year; y++) {
			const list = currentSubjects[y] ?? [];
			list.forEach((s) => (s.status = 'approved'));
		}
		currentSubjects = { ...currentSubjects };
		simSubjects.value = currentSubjects;
	}

	async function exportImage() {
		const node = document.getElementById('print-area');
		if (!node) return;

		try {
			const dataUrl = await htmlToImage.toPng(node, {
				backgroundColor: '#ffffff',
				pixelRatio: 2
			});

			const link = document.createElement('a');
			link.download = 'simulador-correlativas.png';
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Error:', err);
		}
	}
</script>

<div class="space-y-6 flex flex-col items-center">
	<!-- Selector de plan -->
	<div class="card bg-base-100 w-fit shadow-md">
		<div class="card-body">
			<div class="flex gap-4 items-end">
				<fieldset class="fieldset">
					<legend class="fieldset-legend"> Plan de Estudios </legend>
					<select
						id="plan"
						class="select select-bordered"
						bind:value={selectedPlanId}
						onchange={(e) => loadPlan(e.currentTarget.value)}
					>
						<option value="">Seleccionar plan...</option>
						{#each plans.value as plan (plan.id)}
							<option value={plan.id}>{plan.name} ({plan.year})</option>
						{/each}
					</select>
				</fieldset>

				<div class="flex gap-2">
					<button class="btn btn-primary" onclick={() => approveYear(maxYear)}>Aprobar Todo</button>
					<button class="btn btn-ghost" onclick={resetAll}> 🔄 Reiniciar </button>
					<button class="btn btn-ghost" onclick={exportImage}> 🖨️ Exportar </button>
				</div>
			</div>
		</div>
	</div>

	<!-- Leyenda -->
	<div id="print-area" class="gap-6 flex flex-col items-center">
		<div class="flex flex-wrap gap-4 items-center justify-center text-sm">
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-blue-200 border-2 border-blue-500"></div>
				<span>Habilitada</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-red-200 border-2 border-red-500"></div>
				<span>Inhabilitada</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-yellow-200 border-2 border-yellow-500"></div>
				<span>Regular</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 rounded bg-green-200 border-2 border-green-500"></div>
				<span>Aprobada</span>
			</div>
		</div>

		<!-- Columnas -->
		{#if Object.keys(currentSubjects).length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{#each Object.entries(currentSubjects) as [year, list] (year)}
					{@const allSubjects = Object.values(currentSubjects).flat()}
					<YearColumn
						year={+year}
						subjects={list}
						{allSubjects}
						onToggle={toggleStatus}
						{isDisabled}
						onApproveYear={() => approveYear(+year)}
					/>
				{/each}
			</div>
		{:else}
			<div class="card bg-base-100 shadow-md">
				<div class="card-body text-center py-12">
					<p class="text-gray-500">No hay materias cargadas para este plan.</p>
					<a href="/planes" class="btn btn-primary btn-sm w-fit mx-auto">Crear Plan</a>
				</div>
			</div>
		{/if}
	</div>
</div>
