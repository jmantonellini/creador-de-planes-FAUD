export type Status = 'normal' | 'regular' | 'approved';
export type RequiredStatus = 'regular' | 'approved';

export interface Requirement {
	subjectId: number;
	requiredStatus: RequiredStatus;
}

export type Regimen = 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export type Subject = {
	id: number;
	disabled?: boolean;
	year: number;
	semester?: number;
	name: string;
	oldName?: string;
	creditos?: number;
	regimen: Regimen;
	modalidad: string;
	horas_lectivas: number;
	horas_IP: number;
	horas_TAE: number;
	horas_TTE: number;
	status: Status;
	requiredToEnroll: Requirement[];
	requiredToApprove: Requirement[];
};

export type Plan = {
	id: string;
	name: string;
	description?: string;
	year: number;
	subjects: Subject[];
	levelRules?: LevelRule[];
};

export type LevelRule = {
	level: number;
	description: string;
	check: (subjects: Subject[]) => { ok: boolean; reason?: string };
};
