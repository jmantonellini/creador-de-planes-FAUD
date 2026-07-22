import type { Plan, Subject } from '../types';
import { defaultSubjects } from '../subjects';
import { localStore } from './localStore.svelte';

export const plans = localStore<Plan[]>('plans', []);
export const activePlanId = localStore<string | null>('activePlanId', null);
export const simSubjects = localStore<Record<number, Subject[]>>('simSubjects', {});

export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export function getPlan(id: string | null): Plan | null {
	if (!id) return null;
	return plans.value.find((p) => p.id === id) || null;
}

export function savePlan(plan: Plan) {
	const currentPlans = plans.value || [];
	const index = currentPlans.findIndex((p) => p.id === plan.id);

	let newPlans: Plan[];
	if (index >= 0) {
		newPlans = [...currentPlans];
		newPlans[index] = plan;
	} else {
		newPlans = [...currentPlans, plan];
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
		return simSubjects.value || {};
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
		name: 'Plan 2026 - Arquitectura',
		description: 'Plan de estudios 2026 para la carrera de Arquitectura',
		year: 2026,
		subjects: Object.values(defaultSubjects).flat()
	};
	return defaultPlan;
}

export function initializeDefaultPlan() {
	if (plans.value.length === 0) {
		const defaultPlan = createDefaultPlan();
		savePlan(defaultPlan);
		activePlanId.value = defaultPlan.id;
		simSubjects.value = defaultSubjects;
		return defaultPlan;
	}
	return null;
}
