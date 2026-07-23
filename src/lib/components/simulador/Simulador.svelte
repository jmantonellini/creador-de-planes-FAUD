<script lang="ts">
	import * as htmlToImage from 'html-to-image';
	import {
		plans,
		activePlanId,
		getPlan,
		getSubjectsByYear,
		savePlan,
		createDefaultPlan,
		cleanSimSubjects
	} from '$lib/stores/planesStore.svelte';
	import type { Subject, Requirement, Plan } from '$lib/types';
	import YearColumn from './YearColumn.svelte';
	import { page } from '$app/state';

	let selectedPlanId = $state<string | null>(null);
	let planParam = $derived(page.url.searchParams.get('plan'));
	let currentSubjects = $state<Record<number, Subject[]>>({});
	let initialized = $state(false);
	let maxYear = $derived(
		Object.keys(currentSubjects).length > 0
			? Math.max(...Object.keys(currentSubjects).map(Number))
			: 0
	);

	// Cargar plan al inicio una sola vez desde la URL o el store
	$effect(() => {
		if (initialized) return;

		const initialPlanId = planParam ?? activePlanId.value ?? plans.value[0]?.id ?? null;
		loadPlan(initialPlanId, { syncUrl: false });
		initialized = true;
	});

	function updatePlanUrl(planId: string | null) {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);
		if (planId) {
			url.searchParams.set('plan', planId);
		} else {
			url.searchParams.delete('plan');
		}

		window.history.replaceState({}, '', `${url.pathname}${url.search}`);
	}

	function loadPlan(planId: string | null, options: { syncUrl?: boolean } = {}) {
		const { syncUrl = true } = options;
		const plan = getPlan(planId);
		if (plan) {
			currentSubjects = getSubjectsByYear(plan.id);
			activePlanId.value = plan.id;
			selectedPlanId = plan.id;
			if (syncUrl) updatePlanUrl(plan.id);
			return;
		}

		const fallbackPlan = getPlan(activePlanId.value) || plans.value[0];
		if (fallbackPlan) {
			currentSubjects = getSubjectsByYear(fallbackPlan.id);
			activePlanId.value = fallbackPlan.id;
			selectedPlanId = fallbackPlan.id;
			if (syncUrl) updatePlanUrl(fallbackPlan.id);
			return;
		}

		const defaultPlan = createDefaultPlan();
		savePlan(defaultPlan);
		currentSubjects = getSubjectsByYear(defaultPlan.id);
		activePlanId.value = defaultPlan.id;
		selectedPlanId = defaultPlan.id;
		if (syncUrl) updatePlanUrl(defaultPlan.id);
	}

	function toggleStatus(year: number, id: number) {
		const plan = getPlan(selectedPlanId);
		if (!plan) return;

		const subject = plan.subjects.find((s) => s.id === id);
		if (!subject) return;

		const nextStatus: Subject['status'] =
			subject.status === 'normal'
				? 'regular'
				: subject.status === 'regular'
					? 'approved'
					: 'normal';

		const updatedPlan: Plan = {
			...plan,
			subjects: plan.subjects.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
		};

		savePlan(updatedPlan);
		currentSubjects = getSubjectsByYear(selectedPlanId);
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
		const updatedPlan = cleanSimSubjects(selectedPlanId);
		if (updatedPlan) {
			currentSubjects = getSubjectsByYear(selectedPlanId);
		}
	}

	function approveYear(year: number) {
		const plan = getPlan(selectedPlanId);
		if (!plan) return;

		const updatedPlan: Plan = {
			...plan,
			subjects: plan.subjects.map((subject) =>
				subject.year <= year ? { ...subject, status: 'approved' } : subject
			)
		};

		savePlan(updatedPlan);
		currentSubjects = getSubjectsByYear(selectedPlanId);
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
