<script lang="ts">
	import { customPlans, savePlan, deletePlan, generateId } from '$lib/stores/planesStore.svelte';
	import type { Plan, Subject, Requirement } from '$lib/types';
	import PlanForm from './PlanForm.svelte';

	let showForm = $state(false);
	let editingPlan: Plan | null = $state(null);
	let selectedPlan: Plan | null = $state(null);

	function startNewPlan() {
		editingPlan = null;
		showForm = true;
	}

	function editPlan(plan: Plan) {
		editingPlan = JSON.parse(JSON.stringify(plan));
		showForm = true;
	}

	function savePlanHandler(plan: Plan) {
		if (editingPlan) {
			// Update existing
			const index = customPlans.value.findIndex((p) => p.id === plan.id);
			if (index >= 0) {
				customPlans.value[index] = plan;
				customPlans.value = [...customPlans.value];
			}
		} else {
			// Create new
			plan.id = generateId();
			customPlans.value = [...customPlans.value, plan];
		}
		showForm = false;
		editingPlan = null;
	}

	function deletePlanHandler(planId: string) {
		if (confirm('¿Estás seguro de eliminar este plan?')) {
			deletePlan(planId);
		}
	}

	function viewPlan(plan: Plan) {
		selectedPlan = selectedPlan?.id === plan.id ? null : plan;
	}
</script>

<div class="container mx-auto p-4">
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold text-[#224567]">
			<i class="fas fa-pen-to-square mr-2"></i> Editor de Planes
		</h2>
		<button class="btn btn-faud" onclick={startNewPlan}>
			<i class="fas fa-plus mr-2"></i> Nuevo Plan
		</button>
	</div>

	{#if showForm}
		<div class="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-[#224567]">
			<PlanForm
				plan={editingPlan}
				onSave={savePlanHandler}
				onCancel={() => {
					showForm = false;
					editingPlan = null;
				}}
			/>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each customPlans.value as plan (plan.id)}
			<div
				class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200"
			>
				<div class="flex justify-between items-start">
					<div class="flex-1">
						<h3 class="font-bold text-lg text-[#224567]">{plan.name}</h3>
						<p class="text-sm text-gray-500">Año: {plan.year}</p>
						<p class="text-sm text-gray-500">Materias: {plan.subjects.length}</p>
						{#if plan.description}
							<p class="text-sm text-gray-600 mt-1">{plan.description}</p>
						{/if}
					</div>
					<div class="flex gap-2">
						<button class="btn btn-ghost btn-sm" onclick={() => viewPlan(plan)}>
							<i class="fas fa-eye"></i>
						</button>
						<button class="btn btn-ghost btn-sm" onclick={() => editPlan(plan)}>
							<i class="fas fa-edit"></i>
						</button>
						<button
							class="btn btn-ghost btn-sm text-red-500"
							onclick={() => deletePlanHandler(plan.id)}
						>
							<i class="fas fa-trash"></i>
						</button>
					</div>
				</div>

				{#if selectedPlan?.id === plan.id}
					<div class="mt-4 pt-4 border-t border-gray-200">
						<h4 class="font-semibold text-sm mb-2">Materias:</h4>
						<div class="max-h-60 overflow-y-auto space-y-1">
							{#each plan.subjects as subject}
								<div class="text-sm bg-gray-50 p-2 rounded flex justify-between">
									<span>{subject.name}</span>
									<span class="text-xs text-gray-500">Año {subject.year}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="col-span-full text-center py-12 bg-gray-50 rounded-lg">
				<i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
				<p class="text-gray-500">No hay planes creados aún</p>
				<button class="btn btn-faud mt-4" onclick={startNewPlan}>
					<i class="fas fa-plus mr-2"></i> Crear primer plan
				</button>
			</div>
		{/each}
	</div>
</div>
