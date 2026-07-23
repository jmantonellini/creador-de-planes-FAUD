<script lang="ts">
	import type { Subject, Requirement } from '$lib/types';

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
	let showEnroll = $state(false);
	let showApprove = $state(false);

	// Separar los estados para cada sección
	let enrollReq = $state({ subjectId: 0, requiredStatus: 'regular' as 'regular' | 'approved' });
	let approveReq = $state({ subjectId: 0, requiredStatus: 'regular' as 'regular' | 'approved' });

	const availableSubjects = $derived(allSubjects.filter((s) => s.id !== formData.id));

	function addRequirement(type: 'enroll' | 'approve') {
		const req = type === 'enroll' ? enrollReq : approveReq;

		if (!req.subjectId) {
			alert('Selecciona una materia');
			return;
		}

		const list = type === 'enroll' ? formData.requiredToEnroll : formData.requiredToApprove;
		if (list.some((r) => r.subjectId === req.subjectId)) {
			alert('Esta materia ya está en la lista');
			return;
		}

		const newReq: Requirement = {
			subjectId: req.subjectId,
			requiredStatus: req.requiredStatus
		};

		if (type === 'enroll') {
			formData.requiredToEnroll = [...formData.requiredToEnroll, newReq];
			enrollReq = { subjectId: 0, requiredStatus: 'regular' };
		} else {
			formData.requiredToApprove = [...formData.requiredToApprove, newReq];
			approveReq = { subjectId: 0, requiredStatus: 'regular' };
		}
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
		return allSubjects.find((s) => s.id === id)?.name || `ID: ${id}`;
	}

	function submitForm() {
		if (!formData.name.trim()) {
			alert('El nombre es obligatorio');
			return;
		}
		onSave(formData);
	}
</script>

<div class="space-y-4">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Nombre *</span>
				<input
					type="text"
					bind:value={formData.name}
					placeholder="Nombre de la materia"
					class="input input-bordered w-full"
				/>
			</label>
		</div>

		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Nombre anterior</span>
				<input
					type="text"
					bind:value={formData.oldName}
					placeholder="Nombre anterior"
					class="input input-bordered w-full"
				/>
			</label>
		</div>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Año</span>
				<input
					type="number"
					bind:value={formData.year}
					min="1"
					max="6"
					class="input input-bordered w-full"
				/>
			</label>
		</div>

		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Semestre</span>
				<select bind:value={formData.semester} class="select select-bordered w-full">
					<option value={undefined}>Anual</option>
					<option value={1}>1er Semestre</option>
					<option value={2}>2do Semestre</option>
				</select>
			</label>
		</div>

		<div>
			<label class="form-control w-full">
				<span class="label-text font-medium">Régimen</span>
				<select bind:value={formData.regimen} class="select select-bordered w-full">
					<option value="TRIMESTRAL">Trimestral</option>
					<option value="SEMESTRAL">Semestral</option>
					<option value="ANUAL">Anual</option>
				</select>
			</label>
		</div>
	</div>

	<div class="divider text-sm">Correlativas</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Para Cursar -->
		<div class="card bg-base-200">
			<div class="card-body p-4">
				<div class="flex justify-between items-center">
					<h4 class="font-medium">Para Cursar</h4>
					<button class="btn btn-ghost btn-sm" onclick={() => (showEnroll = !showEnroll)}>
						{showEnroll ? '−' : '+'}
					</button>
				</div>

				{#if showEnroll}
					<div class="flex gap-2">
						<select
							bind:value={enrollReq.subjectId}
							class="select select-bordered select-sm flex-1"
						>
							<option value={0}>Seleccionar...</option>
							{#each availableSubjects as s (s.id)}
								<option value={s.id}>{s.name}</option>
							{/each}
						</select>
						<select
							bind:value={enrollReq.requiredStatus}
							class="select select-bordered select-sm w-24"
						>
							<option value="regular">Regular</option>
							<option value="approved">Aprobada</option>
						</select>
						<button class="btn btn-primary btn-sm" onclick={() => addRequirement('enroll')}>
							+
						</button>
					</div>
				{/if}

				<div class="space-y-1 mt-2">
					{#each formData.requiredToEnroll as req (req.subjectId)}
						<div class="flex justify-between items-center text-sm bg-base-100 p-2 rounded">
							<span>{getSubjectName(req.subjectId)}</span>
							<span class="badge">{req.requiredStatus === 'regular' ? 'Regular' : 'Aprobada'}</span>
							<button
								class="btn btn-ghost btn-xs text-error"
								onclick={() => removeRequirement('enroll', req.subjectId)}
							>
								✕
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Para Aprobar -->
		<div class="card bg-base-200">
			<div class="card-body p-4">
				<div class="flex justify-between items-center">
					<h4 class="font-medium">Para Aprobar</h4>
					<button class="btn btn-ghost btn-sm" onclick={() => (showApprove = !showApprove)}>
						{showApprove ? '−' : '+'}
					</button>
				</div>

				{#if showApprove}
					<div class="flex gap-2">
						<select
							bind:value={approveReq.subjectId}
							class="select select-bordered select-sm flex-1"
						>
							<option value={0}>Seleccionar...</option>
							{#each availableSubjects as s (s.id)}
								<option value={s.id}>{s.name}</option>
							{/each}
						</select>
						<select
							bind:value={approveReq.requiredStatus}
							class="select select-bordered select-sm w-24"
						>
							<option value="regular">Regular</option>
							<option value="approved">Aprobada</option>
						</select>
						<button class="btn btn-primary btn-sm" onclick={() => addRequirement('approve')}>
							+
						</button>
					</div>
				{/if}

				<div class="space-y-1 mt-2">
					{#each formData.requiredToApprove as req (req.subjectId)}
						<div class="flex justify-between items-center text-sm bg-base-100 p-2 rounded">
							<span>{getSubjectName(req.subjectId)}</span>
							<span
								class="badge"
								class:badge-success={req.requiredStatus === 'approved'}
								class:badge-warning={req.requiredStatus === 'regular'}
								>{req.requiredStatus === 'regular' ? 'Regular' : 'Aprobada'}</span
							>
							<button
								class="btn btn-ghost btn-xs text-error"
								onclick={() => removeRequirement('approve', req.subjectId)}
							>
								✕
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-end gap-2 pt-2">
		<button class="btn btn-ghost" onclick={onCancel}> Cancelar </button>
		<button class="btn btn-primary" onclick={submitForm}> 💾 Guardar Materia </button>
	</div>
</div>
