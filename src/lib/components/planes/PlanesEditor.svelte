<script lang="ts">
	import Delete from '$lib/icons/Delete.svelte';
	import Edit from '$lib/icons/Edit.svelte';
	import { plans, deletePlan } from '$lib/stores/planesStore.svelte';
	import type { Plan } from '$lib/types';
	import PlanForm from './PlanForm.svelte';

	let showForm = $state(false);
	let editingPlan: Plan | null = $state(null);

	function editPlan(plan: Plan) {
		editingPlan = JSON.parse(JSON.stringify(plan));
		showForm = true;
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold">Planes de Estudio</h2>
		<button
			class="btn btn-primary"
			onclick={() => {
				editingPlan = null;
				showForm = true;
			}}
		>
			+ Nuevo Plan
		</button>
	</div>

	{#if showForm}
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<PlanForm
					plan={editingPlan}
					onSave={() => {
						showForm = false;
						editingPlan = null;
					}}
					onCancel={() => {
						showForm = false;
						editingPlan = null;
					}}
				/>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each plans.value as plan (plan.id)}
			<div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
				<div class="card-body">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="card-title">{plan.name}</h3>
							<p class="text-sm text-gray-500">Año: {plan.year}</p>
							<p class="text-sm text-gray-500">{plan.subjects.length} materias</p>
							{#if plan.description}
								<p class="text-sm mt-2">{plan.description}</p>
							{/if}
						</div>
						<div class="flex gap-2">
							<button class="btn btn-ghost btn-sm" onclick={() => editPlan(plan)}><Edit /></button>
							<button
								class="btn btn-ghost btn-sm text-error"
								onclick={() => {
									if (confirm('¿Eliminar este plan?')) {
										deletePlan(plan.id);
									}
								}}
							>
								<Delete />
							</button>
						</div>
					</div>
					<div class="card-actions justify-end mt-4">
						<a href="/?plan={plan.id}" class="btn btn-secondary btn-outline btn-sm">Simular</a>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-100 shadow-md col-span-full">
				<div class="card-body text-center py-12">
					<p class="text-gray-500">No hay planes creados</p>
					<button
						class="btn btn-primary btn-sm w-fit mx-auto"
						onclick={() => {
							editingPlan = null;
							showForm = true;
						}}
					>
						Crear primer plan
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
