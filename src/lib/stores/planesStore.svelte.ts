import { localStore } from './localStore.svelte';
import { defaultSubjects } from '../subjects';
import type { Subject, Plan } from '../types';

export const customPlans = localStore<Plan[]>('custom_plans', []);

export const activePlanId = localStore<string | null>('active_plan_id', null);

export function getPlanSubjects(planId: string | null): Subject[] {
	if (!planId) {
		return Object.values(defaultSubjects).flat();
	}

	const plan = customPlans.value.find((p) => p.id === planId);
	return plan?.subjects ?? [];
}

export function getPlan(planId: string | null): Plan | null {
	if (!planId) return null;
	return customPlans.value.find((p) => p.id === planId) ?? null;
}

export function savePlan(plan: Plan) {
	const index = customPlans.value.findIndex((p) => p.id === plan.id);
	if (index >= 0) {
		customPlans.value[index] = plan;
	} else {
		customPlans.value = [...customPlans.value, plan];
	}
	customPlans.value = [...customPlans.value];
}

export function deletePlan(planId: string) {
	customPlans.value = customPlans.value.filter((p) => p.id !== planId);
	if (activePlanId.value === planId) {
		activePlanId.value = null;
	}
}

export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// Función para obtener todas las materias de un plan en formato subjectsByYear
export function getSubjectsByYear(planId: string | null): Record<number, Subject[]> {
	const subjects = getPlanSubjects(planId);
	const result: Record<number, Subject[]> = {};

	subjects.forEach((subject) => {
		if (!result[subject.year]) {
			result[subject.year] = [];
		}
		result[subject.year].push(subject);
	});

	return result;
}
