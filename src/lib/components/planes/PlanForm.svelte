<script lang="ts">
	import type { Plan, Subject } from '$lib/types';
	import { generateId, savePlan } from '$lib/stores/planesStore.svelte';
	import SubjectForm from './SubjectForm.svelte';
	import Edit from '$lib/icons/Edit.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import Save from '$lib/icons/Save.svelte';

	let {
		plan,
		onSave,
		onCancel
	}: {
		plan: Plan | null;
		onSave: () => void;
		onCancel: () => void;
	} = $props();

	let formData = $state<Plan>({
		id: plan?.id || generateId(),
		name: plan?.name || '',
		description: plan?.description || '',
		year: plan?.year || new Date().getFullYear(),
		subjects: plan?.subjects ? JSON.parse(JSON.stringify(plan.subjects)) : []
	});

	let showSubjectForm = $state(false);
	let editingIndex = $state<number | null>(null);

	function addSubject() {
		const newSubject: Subject = {
			id: Math.max(0, ...formData.subjects.map((s) => s.id)) + 1,
			year: 1,
			semester: 1,
			name: '',
			oldName: '',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		};
		formData.subjects = [...formData.subjects, newSubject];
		editingIndex = formData.subjects.length - 1;
		showSubjectForm = true;
	}

	function editSubject(index: number) {
		editingIndex = index;
		showSubjectForm = true;
	}

	function saveSubject(subject: Subject) {
		if (editingIndex !== null) {
			formData.subjects[editingIndex] = subject;
			formData.subjects = [...formData.subjects]; // Trigger reactivity
		}
		showSubjectForm = false;
		editingIndex = null;
	}

	function deleteSubject(index: number) {
		if (confirm('¿Eliminar esta materia?')) {
			formData.subjects = formData.subjects.filter((_, i) => i !== index);
		}
	}

	function cancelSubjectForm() {
		if (editingIndex !== null && !formData.subjects[editingIndex]?.name) {
			formData.subjects = formData.subjects.filter((_, i) => i !== editingIndex);
		}
		showSubjectForm = false;
		editingIndex = null;
	}

	function submitForm() {
		if (!formData.name.trim()) {
			alert('El nombre del plan es obligatorio');
			return;
		}
		if (formData.subjects.length === 0) {
			alert('Debe agregar al menos una materia');
			return;
		}

		const ids = formData.subjects.map((s) => s.id);
		const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
		if (duplicateIds.length > 0) {
			alert(`Error: Hay materias con IDs duplicados: ${duplicateIds.join(', ')}`);
			return;
		}

		const allSubjectIds = new Set(formData.subjects.map((s) => s.id));
		for (const subject of formData.subjects) {
			for (const req of [...subject.requiredToEnroll, ...subject.requiredToApprove]) {
				if (!allSubjectIds.has(req.subjectId)) {
					alert(`La materia "${subject.name}" referencia a un ID inexistente: ${req.subjectId}`);
					return;
				}
			}
		}

		savePlan(formData);
		onSave();
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Nombre del Plan *</span>
				<input
					type="text"
					bind:value={formData.name}
					placeholder="Ej: Plan 2026 - Arquitectura"
					class="input input-bordered w-full"
				/>
			</label>
		</div>

		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Año</span>
				<input
					class="input input-bordered w-full remove-arrow"
					type="number"
					bind:value={formData.year}
				/>
			</label>
		</div>
	</div>

	<div>
		<label class="form-control w-full">
			<span class="label-text font-medium">Descripción</span>
			<textarea
				bind:value={formData.description}
				placeholder="Descripción del plan (opcional)"
				class="textarea textarea-bordered w-full"
				rows="2"></textarea>
		</label>
	</div>

	<div class="divider">Materias</div>

	<div class="flex justify-between items-center">
		<span class="text-sm">{formData.subjects.length} materias</span>
		<button class="btn btn-primary btn-sm" onclick={addSubject}> + Agregar Materia </button>
	</div>

	{#if showSubjectForm}
		<div class="card bg-base-200">
			<div class="card-body">
				<SubjectForm
					subject={formData.subjects[editingIndex || 0]}
					allSubjects={formData.subjects}
					onSave={saveSubject}
					onCancel={cancelSubjectForm}
				/>
			</div>
		</div>
	{/if}

	<div class="space-y-2 max-h-96 overflow-y-auto">
		{#each formData.subjects as subject, index (index)}
			<div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
				<div class="flex-1">
					<div class="font-medium">{subject.name || 'Materia sin nombre'}</div>
					<div class="text-sm text-gray-500">
						{subject.year}° Año ·
						{#if subject.semester}
							{subject.semester}° Semestre
						{:else}
							Anual
						{/if}
						{#if subject.requiredToEnroll.length > 0}
							· 📚 {subject.requiredToEnroll.length} correlativas
						{/if}
					</div>
				</div>
				<div class="flex gap-2">
					<button class="btn btn-ghost btn-sm" onclick={() => editSubject(index)}>
						<Edit />
					</button>
					<button class="btn btn-ghost btn-sm text-error" onclick={() => deleteSubject(index)}>
						<Delete />
					</button>
				</div>
			</div>
		{:else}
			<div class="text-center py-8 text-gray-400">
				<p>No hay materias agregadas</p>
			</div>
		{/each}
	</div>

	<div class="flex justify-end gap-3 pt-4 border-t">
		<button class="btn btn-ghost" onclick={onCancel}> Cancelar </button>
		<button class="btn btn-primary" onclick={submitForm}><Save /> Guardar Plan</button>
	</div>
</div>
