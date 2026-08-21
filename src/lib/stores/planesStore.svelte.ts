import type { Plan, Subject } from '../types';
import { defaultSubjects } from '../subjects';
import { localStore } from './localStore.svelte';
import { SvelteMap } from 'svelte/reactivity';

export const plans = localStore<Plan[]>('plans', []);
export const activePlanId = localStore<string | null>('activePlanId', null);

export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function repairPlan(plan: Plan): Plan {
	if (!plan || !plan.subjects || plan.subjects.length === 0) {
		return plan;
	}

	let needsRepair = false;
	let repairedPlan = { ...plan };

	// 1. DETECTAR Y REASIGNAR IDs DUPLICADOS
	const ids = plan.subjects.map((s) => s.id);
	const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

	if (duplicateIds.length > 0) {
		console.log(`🔧 Reparando plan "${plan.name}": IDs duplicados encontrados`, duplicateIds);
		needsRepair = true;

		const idMap = new SvelteMap<number, number>();
		let nextId = Math.max(0, ...ids) + 1;

		const repairedSubjects = plan.subjects.map((subject) => {
			// Si el ID está duplicado o es 0, asignar uno nuevo
			if (duplicateIds.includes(subject.id) || subject.id === 0) {
				const newId = nextId++;
				idMap.set(subject.id, newId);
				return { ...subject, id: newId };
			}
			// Mantener IDs únicos
			idMap.set(subject.id, subject.id);
			return subject;
		});

		repairedPlan = {
			...plan,
			subjects: repairedSubjects
		};

		// Actualizar referencias con el mapa de IDs
		repairedPlan.subjects = repairedPlan.subjects.map((subject) => ({
			...subject,
			requiredToEnroll:
				subject.requiredToEnroll?.map((req) => ({
					...req,
					subjectId: idMap.get(req.subjectId) || req.subjectId
				})) || [],
			requiredToApprove:
				subject.requiredToApprove?.map((req) => ({
					...req,
					subjectId: idMap.get(req.subjectId) || req.subjectId
				})) || []
		}));
	}

	// 2. ELIMINAR REFERENCIAS A IDs QUE NO EXISTEN
	const allSubjectIds = new Set(repairedPlan.subjects.map((s) => s.id));
	let hasInvalidRefs = false;

	const finalSubjects = repairedPlan.subjects.map((subject) => {
		let needsFix = false;

		// Filtrar referencias inválidas en requiredToEnroll
		const validEnroll =
			subject.requiredToEnroll?.filter((req) => {
				if (!allSubjectIds.has(req.subjectId)) {
					console.warn(
						`🗑️ Eliminando referencia inválida en "${subject.name}": ID ${req.subjectId} no existe`
					);
					hasInvalidRefs = true;
					needsFix = true;
					return false;
				}
				return true;
			}) || [];

		// Filtrar referencias inválidas en requiredToApprove
		const validApprove =
			subject.requiredToApprove?.filter((req) => {
				if (!allSubjectIds.has(req.subjectId)) {
					console.warn(
						`🗑️ Eliminando referencia inválida en "${subject.name}": ID ${req.subjectId} no existe`
					);
					hasInvalidRefs = true;
					needsFix = true;
					return false;
				}
				return true;
			}) || [];

		if (needsFix) {
			return {
				...subject,
				requiredToEnroll: validEnroll,
				requiredToApprove: validApprove
			};
		}
		return subject;
	});

	if (hasInvalidRefs) {
		needsRepair = true;
		repairedPlan = {
			...repairedPlan,
			subjects: finalSubjects
		};
	}

	if (needsRepair) {
		console.log(`✅ Plan "${plan.name}" reparado correctamente`);
	} else {
		console.log(`✅ Plan "${plan.name}" no necesita reparación`);
	}

	return repairedPlan;
}

function repairAllPlans() {
	if (!plans.value || plans.value.length === 0) return;

	let needsSave = false;
	const repairedPlans = plans.value.map((plan) => {
		const repaired = repairPlan(plan);
		// Comparar si hubo cambios (comparación simple)
		if (JSON.stringify(repaired) !== JSON.stringify(plan)) {
			needsSave = true;
		}
		return repaired;
	});

	if (needsSave) {
		console.log('💾 Guardando planes reparados...');
		plans.value = repairedPlans;
		console.log('✅ Planes reparados y guardados automáticamente');
	}
}

export function getPlan(id: string | null): Plan | null {
	if (!id) return null;
	return plans.value.find((p) => p.id === id) || null;
}

export function savePlan(plan: Plan) {
	// Reparar el plan antes de guardar
	const repairedPlan = repairPlan(JSON.parse(JSON.stringify(plan)));

	const currentPlans = plans.value || [];
	const index = currentPlans.findIndex((p) => p.id === repairedPlan.id);

	let newPlans: Plan[];
	if (index >= 0) {
		newPlans = [...currentPlans];
		newPlans[index] = repairedPlan;
	} else {
		newPlans = [...currentPlans, repairedPlan];
	}

	plans.value = newPlans;
}

export function deletePlan(id: string) {
	plans.value = (plans.value || []).filter((p) => p.id !== id);
	if (activePlanId.value === id) {
		activePlanId.value = null;
	}
}

export function getSubjectsByYear(planId: string | null): Record<number, Subject[]> {
	if (!planId) {
		return {};
	}

	const plan = getPlan(planId);
	if (!plan) return {};

	const result: Record<number, Subject[]> = {};
	plan.subjects.forEach((s) => {
		if (!result[s.year]) result[s.year] = [];
		result[s.year].push(s);
	});
	return result;
}

export function createDefaultPlan() {
	const defaultPlan: Plan = {
		id: 'default',
		name: 'Plan 2026 - Arquitectura (por defecto)',
		description: 'Plan de estudios 2026 para la carrera de Arquitectura',
		year: 2026,
		subjects: Object.values(defaultSubjects).flat()
	};
	return defaultPlan;
}

export function initializeDefaultPlan() {
	// Primero reparar planes existentes
	repairAllPlans();

	if (plans.value.length === 0) {
		const defaultPlan = createDefaultPlan();
		savePlan(defaultPlan);
		activePlanId.value = defaultPlan.id;
		return defaultPlan;
	}
	return null;
}

export function cleanSimSubjects(planId: string | null = activePlanId.value) {
	const plan = getPlan(planId);
	if (!plan) return null;

	const resetPlan: Plan = {
		...plan,
		subjects: plan.subjects.map((subject) => ({
			...subject,
			status: 'normal'
		}))
	};

	savePlan(resetPlan);
	return resetPlan;
}

// Esta función se ejecuta cuando el módulo se carga
(function autoRepair() {
	try {
		// Usamos setTimeout para asegurar que el store ya está inicializado
		setTimeout(() => {
			repairAllPlans();
		}, 100);
	} catch (error) {
		console.error('Error en reparación automática:', error);
	}
})();
