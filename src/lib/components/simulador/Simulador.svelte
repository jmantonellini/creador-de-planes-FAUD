<script lang="ts">
	import { onMount } from 'svelte';
	import * as htmlToImage from 'html-to-image';
	import { localStore } from '$lib/stores/localStore.svelte';
	import { defaultSubjects, defaultPlans } from '$lib/subjects';
	import {
		activePlanId,
		getPlan,
		getPlanSubjects,
		customPlans
	} from '$lib/stores/planesStore.svelte';
	import type { Subject, Requirement } from '$lib/types';
	import YearColumn from './YearColumn.svelte';

	// Estados del simulador
	const subjects = localStore('sim_subjects', defaultSubjects);
	const plans = localStore('sim_plans', defaultPlans);

	let modalVisible = $state(false);
	let selectedPlanId = $state<string | null>(null);

	// Cargar plan seleccionado si existe
	$effect(() => {
		if (activePlanId.value) {
			const plan = getPlan(activePlanId.value);
			if (plan) {
				// Convertir plan.subjects a formato subjectsByYear
				const subjectsByYear: Record<number, Subject[]> = {};
				plan.subjects.forEach((s) => {
					if (!subjectsByYear[s.year]) subjectsByYear[s.year] = [];
					subjectsByYear[s.year].push(s);
				});
				subjects.value = subjectsByYear;
			}
		}
	});

	const reset = () => {
		subjects.value = defaultSubjects;
		plans.value = { 1: 2025, 2: 2025, 3: 2025, 4: 2025 };
		activePlanId.value = null;
	};

	function toggleStatus(year: number, id: number) {
		const list = subjects.value?.[year] ?? [];
		const subject = list.find((s) => s.id === id);
		if (!subject) return;

		subject.status =
			subject.status === 'normal'
				? 'regular'
				: subject.status === 'regular'
					? 'approved'
					: 'normal';

		subjects.value = { ...subjects.value };
	}

	function hasRequiredStatus(subjects: Subject[], requirement: Requirement): boolean {
		const target = subjects.find((s) => s.id === requirement.subjectId);
		if (!target) return false;

		if (requirement.requiredStatus === 'regular') {
			return target.status === 'regular' || target.status === 'approved';
		}
		return target.status === 'approved';
	}

	type LevelCheck = {
		ok: boolean;
		reason?: string;
	};

	const historiaYAnalisisId = 6;
	const representacionAvanzadaId = 12;

	function meetsLevelRequirements(level: number, allSubjects: Subject[]): LevelCheck {
		const byLevel = (lvl: number) => allSubjects.filter((s) => s.year === lvl);
		const libres = (subs: Subject[]) => subs.filter((s) => s.status === 'normal');
		const regulars = (subs: Subject[]) => subs.filter((s) => s.status === 'regular');
		const aproved = (subs: Subject[]) => subs.filter((s) => s.status === 'approved');

		switch (level) {
			case 1:
				return { ok: true };
			case 2: {
				const level1 = byLevel(1);
				const firstSem = level1.filter((s) => s.semester === 1);
				const secondSem = level1.filter((s) => s.semester === 2);

				const firstSemOk = aproved(firstSem).length >= firstSem.length - 1;
				const secondSemLibres = libres(secondSem).length;

				if (!firstSemOk) {
					return {
						ok: false,
						reason: 'Máx. 1 materia libre del 1º semestre y el resto aprobadas (Nivel I)'
					};
				}
				if (secondSemLibres > 2) {
					return {
						ok: false,
						reason: 'Máx. 2 materias libres del 2º semestre (Nivel I)'
					};
				}
				return { ok: true };
			}
			case 3: {
				const level1 = byLevel(1);
				const level2 = byLevel(2);
				const historia = level1.find((s) => s.id === historiaYAnalisisId);
				const otherLevel1 = level1.filter((s) => s.id !== historiaYAnalisisId);
				const historiaLibre = historia?.status === 'normal';
				const otherLibres = libres(otherLevel1).length;
				const otherRegulars = regulars(otherLevel1).length;
				const level1Ok =
					(historiaLibre && otherLibres <= 1 && otherRegulars <= 1) ||
					(!historiaLibre && otherLibres <= 2);
				if (!level1Ok) {
					return {
						ok: false,
						reason:
							'Debe aprobar todo el Nivel 1 menos 2 materias (o Historia libre y otra regular)'
					};
				}
				const level2Libres = libres(level2).length;
				if (level2Libres > 3) {
					return { ok: false, reason: 'Máx. 3 materias libres del Nivel II' };
				}
				return { ok: true };
			}
			case 4: {
				const level1 = byLevel(1);
				const level2 = byLevel(2);
				const level3 = byLevel(3);
				const historia = level1.find((s) => s.id === historiaYAnalisisId);
				const historiaLibre = historia?.status === 'normal';
				const all12 = [...level1, ...level2];
				const others12 = all12.filter(
					(s) => s.id !== representacionAvanzadaId && s.id !== historiaYAnalisisId
				);
				const all12Approved = others12.every((s) => s.status === 'approved');
				const level12Ok = all12Approved && !historiaLibre;
				if (!level12Ok) {
					return {
						ok: false,
						reason:
							'Debe aprobar todas las materias de los Niveles I y II (excepto Rep. Avanzada libre e Historia regular)'
					};
				}
				const level3Libres = libres(level3).length;
				if (level3Libres > 3) {
					return { ok: false, reason: 'Puede tener hasta 3 materias libres del Nivel III' };
				}
				return { ok: true };
			}
			default:
				return { ok: false, reason: 'Nivel no reconocido' };
		}
	}

	function canEnroll(subject: Subject, allSubjects: Subject[]): boolean {
		return subject.requiredToEnroll.every((req) => hasRequiredStatus(allSubjects, req));
	}

	function canApprove(subject: Subject, allSubjects: Subject[]): boolean {
		return subject.requiredToApprove.every((req) => hasRequiredStatus(allSubjects, req));
	}

	type DisabledResult = {
		disabled: boolean;
		reason?: string;
	};

	function isDisabled(subject: Subject, allSubjects: Subject[]): DisabledResult {
		const levelCheck = meetsLevelRequirements(subject.year, allSubjects);
		if (!levelCheck.ok) {
			return { disabled: true, reason: levelCheck.reason };
		}
		if (subject.status === 'normal' && !canEnroll(subject, allSubjects)) {
			return { disabled: true, reason: 'Faltan correlativas para cursar' };
		}
		if (subject.status === 'regular' && !canApprove(subject, allSubjects)) {
			return { disabled: true, reason: 'Faltan correlativas para aprobar' };
		}
		return { disabled: false };
	}

	function togglePlan(year: number) {
		const newPlan = plans.value?.[year] === 2025 ? 1989 : 2025;
		plans.value = { ...plans.value, [year]: newPlan };
	}

	async function exportAsImage() {
		const node = document.getElementById('print-area');
		if (!node) return;

		document.body.classList.add('export-mode');
		await tick();

		try {
			const dataUrl = await htmlToImage.toPng(node, {
				cacheBust: true,
				backgroundColor: '#ffffff',
				width: 1920,
				quality: 1,
				pixelRatio: 2
			});
			const link = document.createElement('a');
			link.download = 'Correlativas-Diseño-Industrial-FAUD.png';
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Error exporting image:', err);
		} finally {
			document.body.classList.remove('export-mode');
			document.documentElement.scrollLeft = 0;
		}
	}

	function approveYear(year: number) {
		for (let y = 1; y < year; y++) {
			const prevList = subjects.value?.[y] ?? [];
			prevList.forEach((subject) => {
				subject.status = 'approved';
			});
		}
		const list = subjects.value?.[year] ?? [];
		list.forEach((subject) => {
			subject.status = 'approved';
		});
		subjects.value = { ...subjects.value };
	}

	let tick = () => Promise.resolve();
	onMount(() => {
		tick = () => Promise.resolve();
	});
</script>

<main id="print-area" class="bg-white w-full flex flex-col items-center min-h-dvh pb-8">
	<div class="w-full flex items-center justify-between h-fit bg-[#224567] mb-4 p-4">
		<img src="/logo-simulador-correlativas.png" alt="Logo FAUD" class="w-auto max-h-10 md:h-10" />
		<div class="flex items-center gap-2">
			<select
				bind:value={selectedPlanId}
				class="select select-bordered select-sm bg-white/90 text-gray-700 max-w-[200px]"
				onchange={(e) => {
					const val = e.currentTarget.value;
					if (val) {
						const plan = getPlan(val);
						if (plan) {
							const subjectsByYear: Record<number, Subject[]> = {};
							plan.subjects.forEach((s) => {
								if (!subjectsByYear[s.year]) subjectsByYear[s.year] = [];
								subjectsByYear[s.year].push(s);
							});
							subjects.value = subjectsByYear;
							activePlanId.value = val;
						}
					} else {
						subjects.value = defaultSubjects;
						activePlanId.value = null;
					}
				}}
			>
				<option value="">📚 Plan por defecto</option>
				{#each customPlans.value as plan (plan.id)}
					<option value={plan.id} selected={plan.id === activePlanId.value}>
						{plan.name} ({plan.year})
					</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex flex-col items-center mb-4 md:mb-8 mt-4 text-gray-700">
		<h1 class="text-xl md:text-3xl font-bold mb-2">
			Simulador de Correlatividades para Diseño Industrial - FAUD
		</h1>
		<p class="text-sm md:text-base text-gray-700">
			Simulá tu situación académica y despejá todas las dudas!<br />
			Cambiá el estado de las materias <b>haciendo click</b> en ellas. Alterná el plan de estudios
			con el <b>botón correspondiente</b>.<br />
			Podés completar cada año automáticamente con el botón <b>"Aprobar Año"</b>.
		</p>
	</div>

	<div class="flex flex-col items-center justify-center md:justify-between gap-4 mb-2 md:mb-4">
		<div class="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
			<button
				onclick={() => {
					window.open(
						'https://faud.unc.edu.ar/wp-content/blogs.dir/3/files/sites/3/IF-2025-00740914-UNC-SAFAUD-1.pdf',
						'_blank'
					);
				}}
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-[#224567] rounded hover:opacity-75"
			>
				⚖️ <span class="hidden lg:inline">Equivalencias</span>
			</button>
			<button
				onclick={() => {
					window.open(
						'https://faud.unc.edu.ar/coordinacion-de-proyeccion-curricular/diseno-industrial-plan-de-estudios1/',
						'_blank'
					);
				}}
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-[#224567] rounded hover:opacity-75"
			>
				🔎 <span class="hidden lg:inline">Más info</span>
			</button>
			<button
				onclick={() => {
					modalVisible = true;
				}}
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-[#224567] rounded hover:opacity-75"
			>
				ℹ️ <span class="hidden lg:inline">Normas</span>
			</button>
			<button
				onclick={reset}
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-[#224567] rounded hover:opacity-75"
			>
				🔄 <span class="hidden lg:inline">Reiniciar</span>
			</button>
			<button
				onclick={exportAsImage}
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-[#224567] rounded hover:opacity-75"
			>
				🖨️ <span class="hidden lg:inline">Exportar</span>
			</button>
			<a
				href="/planes"
				class="print-hide whitespace-nowrap text-sm px-4 py-2 text-white bg-green-600 rounded hover:opacity-75"
			>
				✏️ <span class="hidden lg:inline">Editar Planes</span>
			</a>
		</div>

		<div class="flex gap-2 md:gap-4 items-end md:items-center text-xs font-semibold">
			<div class="flex items-center gap-2">
				<div class="square w-3 h-3 md:w-5 md:h-5 bg-blue-200 border-2 border-blue-500"></div>
				<span class="text-gray-700">Habilitada</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="square w-3 h-3 md:w-5 md:h-5 bg-red-200 border-2 border-red-500"></div>
				<span class="text-gray-700">Inhabilitada</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="square w-3 h-3 md:w-5 md:h-5 bg-yellow-200 border-2 border-yellow-500"></div>
				<span class="text-gray-700">Regular</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="square w-3 h-3 md:w-5 md:h-5 bg-green-200 border-2 border-green-500"></div>
				<span class="text-gray-700">Aprobada</span>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-full overflow-x-hidden">
		{#each Object.entries(subjects.value ?? {}) as [year, list] (year)}
			{@const numericYear = +year}
			{@const allSubjects = Object.values(subjects.value ?? {}).flat()}
			{@const yearPlan = plans.value?.[numericYear]}

			<YearColumn
				year={numericYear}
				subjects={list}
				{allSubjects}
				{yearPlan}
				onToggleStatus={toggleStatus}
				onTogglePlan={togglePlan}
				onApproveYear={approveYear}
				{isDisabled}
			/>
		{/each}
	</div>

	<a
		href="https://www.eco-sistema.net"
		target="_blank"
		class="mt-4 text-sm text-gray-600 hover:text-green-700 hover:underline transition-all"
		>Eco Sistema 🌱</a
	>
</main>

{#if modalVisible}
	<div
		class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
		onclick={() => (modalVisible = false)}
	>
		<div
			class="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90%] text-gray-600 text-start"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="font-bold text-center text-lg mb-2">Condiciones de acceso al Nivel</h2>
			<p class="text-sm mb-2">
				La comunidad estudiantil de la Licenciatura en Diseño Industrial podrá cursar hasta 6
				asignaturas en simultáneo del plan 2025 por período lectivo. Además, para acceder al
				cursado, se deben cumplir las siguientes condiciones dependiendo del semestre, el nivel y el
				ciclo de la carrera en el que se encuentre:
			</p>
			<ul class="list-disc pl-5 space-y-1 text-start text-sm">
				<li><strong>Nivel I:</strong> No hay restricciones.</li>
				<li>
					<strong>Nivel II:</strong> Todas las materias del primer semestre aprobadas (menos una libre);
					máximo 2 libres en el segundo semestre.
				</li>
				<li>
					<strong>Nivel III:</strong> Aprobadas todas del Nivel 1 menos 2 regulares (o Historia libre
					y otra regular); Nivel II máximo 3 libres.
				</li>
				<li>
					<strong>Nivel IV:</strong> Niveles I y II aprobados (excepto Historia regular y Representación
					Avanzada libre); hasta 3 libres en Nivel III.
				</li>
			</ul>
			<div class="mt-4 flex justify-end">
				<button
					onclick={() => (modalVisible = false)}
					class="px-4 py-2 bg-[#224567] text-white rounded hover:opacity-75"
				>
					Cerrar
				</button>
			</div>
		</div>
	</div>
{/if}
