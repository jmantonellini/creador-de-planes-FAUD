<script lang="ts">
	import type { Subject, Requirement, Status } from '$lib/types';

	let {
		subject,
		allSubjects,
		onSave,
		onCancel
	}: {
		subject: Subject;
		allSubjects: Subject[];
		onSave: (subject: Subject) => void;
		onCancel: () => void;
	} = $props();

	let formData = $state<Subject>(JSON.parse(JSON.stringify(subject)));

	let showEnrollRequirements = $state(false);
	let showApproveRequirements = $state(false);
	let newRequirement = $state<{ subjectId: number; requiredStatus: 'regular' | 'approved' }>({
		subjectId: 0,
		requiredStatus: 'regular'
	});

	function addRequirement(type: 'enroll' | 'approve') {
		if (!newRequirement.subjectId) return;

		const exists = (
			type === 'enroll' ? formData.requiredToEnroll : formData.requiredToApprove
		).some((r) => r.subjectId === newRequirement.subjectId);

		if (exists) {
			alert('Esta materia ya está en la lista de correlativas');
			return;
		}

		if (type === 'enroll') {
			formData.requiredToEnroll = [
				...formData.requiredToEnroll,
				{
					subjectId: newRequirement.subjectId,
					requiredStatus: newRequirement.requiredStatus
				}
			];
		} else {
			formData.requiredToApprove = [
				...formData.requiredToApprove,
				{
					subjectId: newRequirement.subjectId,
					requiredStatus: newRequirement.requiredStatus
				}
			];
		}

		newRequirement.subjectId = 0;
		newRequirement.requiredStatus = 'regular';
	}

	function removeRequirement(type: 'enroll' | 'approve', subjectId: number) {
		if (type === 'enroll') {
			formData.requiredToEnroll = formData.requiredToEnroll.filter(
				(r) => r.subjectId !== subjectId
			);
		} else {
			formData.requiredToApprove = formData.requiredToApprove.filter(
				(r) => r.subjectId !== subjectId
			);
		}
	}

	function getSubjectName(id: number): string {
		const subj = allSubjects.find((s) => s.id === id);
		return subj?.name || `ID: ${id}`;
	}

	function submitForm() {
		if (!formData.name.trim()) {
			alert('El nombre de la materia es obligatorio');
			return;
		}
		if (!formData.year) {
			alert('El año es obligatorio');
			return;
		}
		onSave(formData);
	}
</script>

<div class="space-y-4">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div class="form-control">
			<label for="name" class="label">
				<span class="label-text font-semibold">Nombre *</span>
			</label>
			<input
				id="name"
				type="text"
				bind:value={formData.name}
				placeholder="Nombre de la materia"
				class="input input-bordered input-sm w-full"
			/>
		</div>

		<div class="form-control">
			<label for="oldName" class="label">
				<span class="label-text font-semibold">Nombre anterior</span>
			</label>
			<input
				id="oldName"
				type="text"
				bind:value={formData.oldName}
				placeholder="Nombre anterior (opcional)"
				class="input input-bordered input-sm w-full"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
		<div class="form-control">
			<label for="year" class="label">
				<span class="label-text font-semibold">Año *</span>
			</label>
			<input
				id="year"
				type="number"
				bind:value={formData.year}
				min="1"
				max="6"
				class="input input-bordered input-sm w-full"
			/>
		</div>

		<div class="form-control">
			<label for="semestre" class="label">
				<span class="label-text font-semibold">Semestre</span>
			</label>
			<select
				id="semestre"
				bind:value={formData.semester}
				class="select select-bordered select-sm w-full"
			>
				<option value={undefined}>Anual</option>
				<option value={1}>1er Semestre</option>
				<option value={2}>2do Semestre</option>
			</select>
		</div>

		<div class="form-control">
			<label for="regimen" class="label">
				<span class="label-text font-semibold">Régimen</span>
			</label>
			<select
				id="regimen"
				bind:value={formData.regimen}
				class="select select-bordered select-sm w-full"
			>
				<option value="TRIMESTRAL">Trimestral</option>
				<option value="SEMESTRAL">Semestral</option>
				<option value="ANUAL">Anual</option>
			</select>
		</div>

		<div class="form-control">
			<label for="credits" class="label">
				<span class="label-text font-semibold">Créditos</span>
			</label>
			<input
				id="credits"
				type="number"
				bind:value={formData.credits}
				min="1"
				max="40"
				class="input input-bordered input-sm w-full"
			/>
		</div>
	</div>

	<div class="divider text-xs">Correlativas</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Para Cursar -->
		<div class="bg-blue-50 p-3 rounded-lg">
			<div class="flex justify-between items-center mb-2">
				<span class="font-semibold text-sm">Para Cursar</span>
				<button
					title="Agregar"
					class="btn btn-xs btn-ghost"
					onclick={() => (showEnrollRequirements = !showEnrollRequirements)}
				>
					<i class="fas fa-plus"></i>
				</button>
			</div>

			{#if showEnrollRequirements}
				<div class="flex gap-2 mb-2">
					<select
						bind:value={newRequirement.subjectId}
						class="select select-bordered select-xs flex-1"
					>
						<option value={0}>Seleccionar materia...</option>
						{#each allSubjects.filter((s) => s.id !== formData.id) as subj (subj.id)}
							<option value={subj.id}>{subj.name}</option>
						{/each}
					</select>
					<select
						bind:value={newRequirement.requiredStatus}
						class="select select-bordered select-xs w-24"
					>
						<option value="regular">Regular</option>
						<option value="approved">Aprobada</option>
					</select>
					<button
						title="Agregar"
						class="btn btn-xs btn-faud"
						onclick={() => addRequirement('enroll')}
					>
						<i class="fas fa-check"></i>
					</button>
				</div>
			{/if}

			<div class="space-y-1">
				{#each formData.requiredToEnroll as req (req.subjectId)}
					<div class="flex justify-between items-center text-xs bg-white p-1 px-2 rounded">
						<span>{getSubjectName(req.subjectId)}</span>
						<span class="badge badge-ghost badge-xs">
							{req.requiredStatus === 'regular' ? 'Regular' : 'Aprobada'}
						</span>
						<button
							title="Agregar"
							class="btn btn-ghost btn-xs text-red-500"
							onclick={() => removeRequirement('enroll', req.subjectId)}
						>
							<i class="fas fa-times"></i>
						</button>
					</div>
				{:else}
					<p class="text-xs text-gray-400 text-center py-2">Sin correlativas</p>
				{/each}
			</div>
		</div>

		<!-- Para Aprobar -->
		<div class="bg-green-50 p-3 rounded-lg">
			<div class="flex justify-between items-center mb-2">
				<span class="font-semibold text-sm">Para Aprobar</span>
				<button
					title="Agregar"
					class="btn btn-xs btn-ghost"
					onclick={() => (showApproveRequirements = !showApproveRequirements)}
				>
					<i class="fas fa-plus"></i>
				</button>
			</div>

			{#if showApproveRequirements}
				<div class="flex gap-2 mb-2">
					<select
						bind:value={newRequirement.subjectId}
						class="select select-bordered select-xs flex-1"
					>
						<option value={0}>Seleccionar materia...</option>
						{#each allSubjects.filter((s) => s.id !== formData.id) as subj (subj.id)}
							<option value={subj.id}>{subj.name}</option>
						{/each}
					</select>
					<select
						bind:value={newRequirement.requiredStatus}
						class="select select-bordered select-xs w-24"
					>
						<option value="regular">Regular</option>
						<option value="approved">Aprobada</option>
					</select>
					<button
						title="Agregar"
						class="btn btn-xs btn-faud"
						onclick={() => addRequirement('approve')}
					>
						<i class="fas fa-check"></i>
					</button>
				</div>
			{/if}

			<div class="space-y-1">
				{#each formData.requiredToApprove as req (req.subjectId)}
					<div class="flex justify-between items-center text-xs bg-white p-1 px-2 rounded">
						<span>{getSubjectName(req.subjectId)}</span>
						<span class="badge badge-ghost badge-xs">
							{req.requiredStatus === 'regular' ? 'Regular' : 'Aprobada'}
						</span>
						<button
							title="Agregar"
							class="btn btn-ghost btn-xs text-red-500"
							onclick={() => removeRequirement('approve', req.subjectId)}
						>
							<i class="fas fa-times"></i>
						</button>
					</div>
				{:else}
					<p class="text-xs text-gray-400 text-center py-2">Sin correlativas</p>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex justify-end gap-2 pt-2">
		<button class="btn btn-ghost btn-sm" onclick={onCancel}> Cancelar </button>
		<button class="btn btn-faud btn-sm" onclick={submitForm}>
			<i class="fas fa-check mr-2"></i> Guardar Materia
		</button>
	</div>
</div>
