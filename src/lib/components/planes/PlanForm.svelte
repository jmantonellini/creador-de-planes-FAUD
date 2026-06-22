<script lang="ts">
	import type { Plan, Subject, Requirement, Status } from '$lib/types';
	import SubjectForm from './SubjectForm.svelte';
	import { generateId } from '$lib/stores/planesStore.svelte';

	export let plan: Plan | null = null;
	export let onSave: (plan: Plan) => void;
	export let onCancel: () => void;

	let formData = $state<Plan>({
		id: plan?.id || generateId(),
		name: plan?.name || '',
		description: plan?.description || '',
		year: plan?.year || new Date().getFullYear(),
		subjects: plan?.subjects ? JSON.parse(JSON.stringify(plan.subjects)) : [],
		levelRules: plan?.levelRules || []
	});

	let showSubjectForm = $state(false);
	let editingSubjectIndex = $state<number | null>(null);
	let selectedSubject: Subject | null = $state(null);

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
			credits: 7,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		};
		formData.subjects = [...formData.subjects, newSubject];
		editingSubjectIndex = formData.subjects.length - 1;
		selectedSubject = newSubject;
		showSubjectForm = true;
	}

	function editSubject(index: number) {
		editingSubjectIndex = index;
		selectedSubject = JSON.parse(JSON.stringify(formData.subjects[index]));
		showSubjectForm = true;
	}

	function saveSubject(subject: Subject) {
		if (editingSubjectIndex !== null) {
			formData.subjects[editingSubjectIndex] = subject;
			formData.subjects = [...formData.subjects];
		}
		showSubjectForm = false;
		editingSubjectIndex = null;
		selectedSubject = null;
	}

	function deleteSubject(index: number) {
		if (confirm('¿Eliminar esta materia?')) {
			formData.subjects = formData.subjects.filter((_, i) => i !== index);
		}
	}

	function cancelSubjectForm() {
		if (editingSubjectIndex !== null && !formData.subjects[editingSubjectIndex]?.name) {
			formData.subjects = formData.subjects.filter((_, i) => i !== editingSubjectIndex);
		}
		showSubjectForm = false;
		editingSubjectIndex = null;
		selectedSubject = null;
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
		onSave(formData);
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="form-control">
			<label class="label">
				<span class="label-text font-semibold">Nombre del Plan *</span>
			</label>
			<input
				type="text"
				bind:value={formData.name}
				placeholder="Ej: Plan 2025 - Diseño Industrial"
				class="input input-bordered w-full"
			/>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text font-semibold">Año</span>
			</label>
			<input type="number" bind:value={formData.year} class="input input-bordered w-full" />
		</div>
	</div>

	<div class="form-control">
		<label class="label">
			<span class="label-text font-semibold">Descripción</span>
		</label>
		<textarea
			bind:value={formData.description}
			placeholder="Descripción del plan (opcional)"
			class="textarea textarea-bordered w-full"
			rows="2"></textarea>
	</div>

	<div class="divider">Materias</div>

	<div class="flex justify-between items-center">
		<span class="text-sm text-gray-500">{formData.subjects.length} materias</span>
		<button class="btn btn-faud btn-sm" onclick={addSubject}>
			<i class="fas fa-plus mr-2"></i> Agregar Materia
		</button>
	</div>

	{#if showSubjectForm && selectedSubject}
		<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
			<SubjectForm
				subject={selectedSubject}
				allSubjects={formData.subjects}
				onSave={saveSubject}
				onCancel={cancelSubjectForm}
			/>
		</div>
	{/if}

	<div class="space-y-2 max-h-96 overflow-y-auto">
		{#each formData.subjects as subject, index}
			<div
				class="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-start hover:bg-gray-50 transition-colors"
			>
				<div class="flex-1">
					<div class="font-semibold text-sm">
						{subject.name || 'Materia sin nombre'}
					</div>
					<div class="text-xs text-gray-500">
						Año {subject.year} · {subject.semester ? `Semestre ${subject.semester}` : 'Anual'} ·
						{subject.credits} créditos
					</div>
					<div class="text-xs text-gray-500">
						Correlativas: {subject.requiredToEnroll.length} para cursar · {subject.requiredToApprove
							.length} para aprobar
					</div>
				</div>
				<div class="flex gap-2 ml-2">
					<button class="btn btn-ghost btn-xs" onclick={() => editSubject(index)} title="Editar">
						<i class="fas fa-edit"></i>
					</button>
					<button
						class="btn btn-ghost btn-xs text-red-500"
						onclick={() => deleteSubject(index)}
						title="Eliminar"
					>
						<i class="fas fa-trash"></i>
					</button>
				</div>
			</div>
		{:else}
			<div class="text-center py-8 text-gray-400">
				<i class="fas fa-book text-4xl mb-2"></i>
				<p>No hay materias agregadas</p>
				<p class="text-xs">Haz clic en "Agregar Materia" para comenzar</p>
			</div>
		{/each}
	</div>

	<div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
		<button class="btn btn-ghost" onclick={onCancel}> Cancelar </button>
		<button class="btn btn-faud" onclick={submitForm}>
			<i class="fas fa-save mr-2"></i> Guardar Plan
		</button>
	</div>
</div>
