<script lang="ts">
	import Delete from '$lib/icons/Delete.svelte';
	import Download from '$lib/icons/Download.svelte';
	import Duplicate from '$lib/icons/Duplicate.svelte';
	import Edit from '$lib/icons/Edit.svelte';
	import Upload from '$lib/icons/Upload.svelte';
	import { plans, deletePlan, savePlan, generateId } from '$lib/stores/planesStore.svelte';
	import type { Plan } from '$lib/types';
	import PlanForm from './PlanForm.svelte';

	let showForm = $state(false);
	let editingPlan: Plan | null = $state(null);
	let showModal = $state(false);

	function editPlan(plan: Plan) {
		editingPlan = JSON.parse(JSON.stringify(plan));
		showForm = true;
	}

	function downloadPlan(plan: Plan) {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', `${plan.name}.json`);
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

	function duplicatePlan(plan: Plan) {
		const newPlan = JSON.parse(JSON.stringify(plan));
		newPlan.id = generateId();
		newPlan.name += ' (Copia)';
		savePlan(newPlan);
	}

	function importPlan(file: File) {
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const plan: Plan = JSON.parse(event.target?.result as string);

				// Validar IDs únicos
				const ids = plan.subjects.map((s) => s.id);
				const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
				if (duplicateIds.length > 0) {
					alert(
						`Error: IDs duplicados encontrados: ${duplicateIds.join(', ')}. Por favor, corrige el archivo JSON.`
					);
					return;
				}

				if (!plan.id) {
					plan.id = generateId();
				}
				savePlan(plan);
				showModal = false;
			} catch (error) {
				alert('Error al cargar el plan: ' + error);
			}
		};
		reader.readAsText(file);
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold">Planes de Estudio</h2>
		<div class="flex gap-4">
			<button
				title="Importar plan"
				class="btn btn-primary btn-outline"
				onclick={() => {
					showModal = true;
				}}
			>
				<Upload /></button
			>
			<button
				class="btn btn-primary"
				onclick={() => {
					editingPlan = null;
					showForm = true;
				}}
			>
				+ Crear
			</button>
		</div>
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
					</div>
					<div class="card-actions justify-end mt-4">
						<button title="Editar plan" class="btn btn-ghost btn-sm" onclick={() => editPlan(plan)}
							><Edit /></button
						>
						<button
							title="Duplicar plan"
							class="btn btn-ghost btn-sm"
							onclick={() => duplicatePlan(plan)}><Duplicate /></button
						>
						<button
							title="Descargar plan"
							class="btn btn-ghost btn-sm"
							onclick={() => downloadPlan(plan)}><Download /></button
						>
						<button
							title="Eliminar plan"
							class="btn btn-ghost btn-sm text-error"
							onclick={() => {
								if (confirm('¿Eliminar este plan?')) {
									deletePlan(plan.id);
								}
							}}
						>
							<Delete />
						</button>
						<a
							title="Simular plan"
							href="/?plan={plan.id}"
							class="btn btn-secondary btn-outline btn-sm">Simular</a
						>
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

<dialog open={showModal} class="modal">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg">Cargar Plan de Estudio</h3>
		<p class="py-4">Selecciona un archivo JSON para cargar un plan de estudio.</p>
		<input
			type="file"
			class="file-input file-input-bordered w-full"
			accept=".json"
			onchange={(e) => {
				const file = e.target?.files?.[0];
				if (file) {
					importPlan(file);
				}
			}}
		/>
		<div class="modal-action">
			<button class="btn btn-primary">Cerrar</button>
		</div>
	</form>
</dialog>
