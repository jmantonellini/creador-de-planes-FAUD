type Status = 'normal' | 'regular' | 'approved';
type RequiredStatus = 'regular' | 'approved';

export interface Requirement {
	subjectId: number;
	requiredStatus: RequiredStatus; // "regular" or "approved"
}

export type Subject = {
	id: number;
	disabled?: boolean;
	year: number;
	semester?: number;
	name: string;
	oldName?: string;
	regimen: string;
	modalidad: string;
	horas_lectivas: number;
	horas_IP: number;
	horas_TAE: number;
	horas_TTE: number;
	credits: number;
	status: Status;
	requiredToEnroll: Requirement[];
	requiredToApprove: Requirement[];
};

export const plansByYear: Record<number, number> = {
	1: 2025,
	2: 2025,
	3: 2025,
	4: 2025
};

export const subjectsByYear: Record<number, Subject[]> = {
	1: [
		{
			id: 1,
			year: 1,
			semester: 1,
			name: 'INTRODUCCIÓN A LOS SISTEMAS DE REPRESENTACIÓN',
			oldName: 'SISTEMAS DE REPRESENTACIÓN I',
			regimen: 'TRIMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 80,
			horas_TAE: 70,
			horas_TTE: 150,
			credits: 6,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		},
		{
			id: 2,
			year: 1,
			semester: 1,
			name: 'FÍSICA Y MATEMÁTICA APLICADA AL DISEÑO INDUSTRIAL',
			oldName: 'MATEMÁTICA',
			regimen: 'TRIMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 50,
			horas_TAE: 75,
			horas_TTE: 125,
			credits: 5,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		},
		{
			id: 3,
			year: 1,
			semester: 1,
			name: 'INTRODUCCIÓN A LA CULTURA PROYECTUAL',
			oldName:
				'INTRODUCCIÓN A LA PROBLEMÁTICA DEL DISEÑO Y SU EXPRESIÓN Y ESTRATEGIAS DE APRENDIZAJE',
			regimen: 'TRIMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 50,
			horas_TAE: 100,
			horas_TTE: 150,
			credits: 6,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		},
		{
			id: 4,
			year: 1,
			semester: 2,
			name: 'INTRODUCCIÓN A LA LÓGICA DE LA FORMA',
			oldName: 'MORFOLOGÍA I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 100,
			horas_TAE: 125,
			horas_TTE: 225,
			credits: 9,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 1, requiredStatus: 'regular' }],
			requiredToApprove: [{ subjectId: 1, requiredStatus: 'approved' }]
		},
		{
			id: 5,
			year: 1,
			semester: 2,
			name: 'FUNDAMENTOS DE MATERIALIZACIÓN',
			oldName: 'INTRODUCCIÓN A LA TECNOLOGÍA',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 100,
			horas_TAE: 125,
			horas_TTE: 225,
			credits: 9,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 2, requiredStatus: 'regular' }],
			requiredToApprove: [{ subjectId: 2, requiredStatus: 'approved' }]
		},
		{
			id: 6,
			year: 1,
			semester: 2,
			name: 'HISTORIA Y ANÁLISIS DE LA CULTURA PROYECTUAL',
			oldName: 'HISTORIA DEL DISEÑO I - HISTORIA DEL DISEÑO II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 100,
			horas_TAE: 125,
			horas_TTE: 225,
			credits: 9,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 3, requiredStatus: 'regular' }],
			requiredToApprove: [{ subjectId: 3, requiredStatus: 'approved' }]
		},
		{
			id: 7,
			year: 1,
			semester: 2,
			name: 'INTRODUCCIÓN AL PROCESO DE DISEÑO',
			oldName: 'INTRODUCCIÓN AL DISEÑO INDUSTRIAL',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 160,
			horas_TAE: 240,
			horas_TTE: 400,
			credits: 16,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 1, requiredStatus: 'regular' },
				{ subjectId: 3, requiredStatus: 'regular' }
			],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' }
			]
		}
	],
	2: [
		{
			id: 8,
			year: 2,
			semester: 3,
			name: 'SISTEMAS DE REPRESENTACIÓN',
			oldName: 'SISTEMAS DE REPRESENTACIÓN II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 1, requiredStatus: 'regular' }],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' }
			]
		},
		{
			id: 9,
			year: 2,
			semester: 3,
			name: 'MORFOLOGÍA',
			oldName: 'MORFOLOGÍA II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 4, requiredStatus: 'approved' }],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' },
				{ subjectId: 4, requiredStatus: 'approved' }
			]
		},
		{
			id: 10,
			year: 2,
			semester: 3,
			name: 'TEORÍA ARGUMENTATIVA DEL PROYECTO',
			oldName: 'CIENCIAS HUMANAS',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 50,
			horas_TTE: 125,
			credits: 5,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 3, requiredStatus: 'approved' }],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' }
			]
		},
		{
			id: 11,
			year: 2,
			semester: 3,
			name: 'INTRODUCCIÓN AL DISEÑO DE PRODUCTO',
			oldName: 'DISEÑO INDUSTRIAL I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 120,
			horas_TAE: 130,
			horas_TTE: 250,
			credits: 10,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 1, requiredStatus: 'regular' },
				{ subjectId: 7, requiredStatus: 'approved' }
			],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' },
				{ subjectId: 7, requiredStatus: 'approved' }
			]
		},
		{
			id: 12,
			year: 2,
			semester: 4,
			name: 'REPRESENTACIÓN AVANZADA',
			oldName: 'INFORMÁTICA',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' },
				{ subjectId: 8, requiredStatus: 'regular' }
			],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' },
				{ subjectId: 8, requiredStatus: 'approved' }
			]
		},
		{
			id: 13,
			year: 2,
			semester: 4,
			name: 'ERGONOMÍA Y DISEÑO',
			oldName: 'ERGONOMÍA I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 7, requiredStatus: 'approved' }],
			requiredToApprove: [{ subjectId: 7, requiredStatus: 'approved' }]
		},
		{
			id: 14,
			year: 2,
			semester: 4,
			name: 'MATERIALIZACIÓN, ESTANDARIZACIÓN Y DETALLE',
			oldName: 'TECONOLOGÍA I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 5, requiredStatus: 'regular' },
				{ subjectId: 8, requiredStatus: 'regular' }
			],
			requiredToApprove: [
				{ subjectId: 5, requiredStatus: 'approved' },
				{ subjectId: 8, requiredStatus: 'regular' }
			]
		},
		{
			id: 15,
			year: 2,
			semester: 4,
			name: 'DISEÑO DE PRODUCTO',
			oldName: 'DISEÑO INDUSTRIAL I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 120,
			horas_TAE: 130,
			horas_TTE: 250,
			credits: 10,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 8, requiredStatus: 'regular' },
				{ subjectId: 11, requiredStatus: 'approved' }
			],
			requiredToApprove: [
				{ subjectId: 8, requiredStatus: 'approved' },
				{ subjectId: 11, requiredStatus: 'approved' }
			]
		}
	],
	3: [
		{
			id: 16,
			year: 3,
			semester: 5,
			name: 'ERGONOMÍA Y PROCESOS',
			oldName: 'ERGONOMÍA I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 125,
			horas_TTE: 200,
			credits: 8,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 13, requiredStatus: 'regular' }],
			requiredToApprove: [{ subjectId: 13, requiredStatus: 'approved' }]
		},
		{
			id: 17,
			year: 3,
			semester: 5,
			name: 'SEMIÓTICA DE LA FORMA',
			oldName: 'MORFOLOGÍA III',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 125,
			horas_TTE: 200,
			credits: 8,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 8, requiredStatus: 'regular' },
				{ subjectId: 9, requiredStatus: 'approved' }
			],
			requiredToApprove: [
				{ subjectId: 8, requiredStatus: 'approved' },
				{ subjectId: 9, requiredStatus: 'approved' }
			]
		},
		{
			id: 18,
			year: 3,
			semester: 5,
			name: 'INVESTIGACIÓN Y CRÍTICA DEL PROYECTO',
			oldName: 'TEORÍA DEL DISEÑO',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 50,
			horas_TTE: 125,
			credits: 5,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 10, requiredStatus: 'regular' },
				{ subjectId: 7, requiredStatus: 'approved' }
			],
			requiredToApprove: [
				{ subjectId: 10, requiredStatus: 'approved' },
				{ subjectId: 7, requiredStatus: 'approved' }
			]
		},
		{
			id: 19,
			year: 3,
			semester: 5,
			name: 'DISEÑO DE PRODUCTO SISTÉMICO',
			oldName: 'DISEÑO INDUSTRIAL II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 120,
			horas_TAE: 130,
			horas_TTE: 250,
			credits: 10,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 15, requiredStatus: 'approved' }],
			requiredToApprove: [{ subjectId: 15, requiredStatus: 'approved' }]
		},
		{
			id: 20,
			year: 3,
			semester: 6,
			name: 'GESTIÓN Y MARKETING',
			oldName: 'COMERCIALIZACIÓN DE PRODUCTOS I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 100,
			horas_TTE: 175,
			credits: 7,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 11, requiredStatus: 'approved' }],
			requiredToApprove: [{ subjectId: 11, requiredStatus: 'approved' }]
		},
		{
			id: 21,
			year: 3,
			semester: 6,
			name: 'TECNOLOGÍAS DE SISTEMAS COMPLEJOS',
			oldName: 'TECNOLOGÍA II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 125,
			horas_TTE: 200,
			credits: 8,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 14, requiredStatus: 'regular' }],
			requiredToApprove: [{ subjectId: 14, requiredStatus: 'approved' }]
		},
		{
			id: 22,
			year: 3,
			name: 'DISEÑO Y DESARROLLO DE PRODUCTO SISTÉMICO',
			oldName: 'DISEÑO INDUSTRIAL II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 120,
			horas_TAE: 130,
			horas_TTE: 250,
			credits: 10,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 19, requiredStatus: 'approved' }],
			requiredToApprove: [
				{ subjectId: 12, requiredStatus: 'regular' },
				{ subjectId: 13, requiredStatus: 'regular' },
				{ subjectId: 14, requiredStatus: 'regular' },
				{ subjectId: 15, requiredStatus: 'regular' },
				{ subjectId: 19, requiredStatus: 'approved' }
			]
		},
		{
			id: 23,
			year: 3,
			semester: 6,
			name: 'ELECTIVA I',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 3,
			horas_IP: 45,
			horas_TAE: 55,
			horas_TTE: 100,
			credits: 4,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		}
	],
	// {
	//   id: 27,
	//   year: 3,
	//   name: "PRÁCTICA PROFESIONAL",
	//   oldName: "DISEÑO INDUSTRIAL IV",
	//   regimen: "SEMESTRAL",
	//   modalidad: "PRESENCIAL",
	//   horas_lectivas: 8,
	//   horas_IP: 120,
	//   horas_TAE: 55,
	//   horas_TTE: 175,
	//   credits: 7,
	//   status: "normal",
	//   requiredToEnroll: [{subjectId: 19, requiredStatus: 'approved'}],
	//   requiredToApprove: []
	// },
	// {
	//   id: 28,
	//   year: 3,
	//   name: "IDIOMA",
	//   regimen: "SEMESTRAL",
	//   modalidad: "PRESENCIAL",
	//   horas_lectivas: 8,
	//   horas_IP: 120,
	//   horas_TAE: 55,
	//   horas_TTE: 175,
	//   credits: 7,
	//   status: "normal",
	//   requiredToEnroll: [{subjectId: 19, requiredStatus: 'approved'}],
	//   requiredToApprove: []
	// }],
	4: [
		{
			id: 24,
			year: 4,
			semester: 7,
			name: 'LEGISLACIÓN EN DISEÑO INDUSTRIAL',
			oldName: 'LEGISLACIÓN',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 125,
			horas_TTE: 200,
			credits: 8,
			status: 'normal',
			requiredToEnroll: [{ subjectId: 15, requiredStatus: 'approved' }],
			requiredToApprove: [{ subjectId: 15, requiredStatus: 'approved' }]
		},
		{
			id: 25,
			year: 4,
			semester: 7,
			name: 'GESTIÓN TECNOLÓGICA ESTRATÉGICA',
			oldName: 'TECONOLOGÍA III',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 5,
			horas_IP: 75,
			horas_TAE: 150,
			horas_TTE: 225,
			credits: 9,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 15, requiredStatus: 'approved' },
				{ subjectId: 21, requiredStatus: 'regular' }
			],
			requiredToApprove: [
				{ subjectId: 15, requiredStatus: 'approved' },
				{ subjectId: 21, requiredStatus: 'approved' }
			]
		},
		{
			id: 26,
			year: 4,
			name: 'ELECTIVA II',
			regimen: 'SEMESTRAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 3,
			horas_IP: 45,
			horas_TAE: 55,
			horas_TTE: 100,
			credits: 4,
			status: 'normal',
			requiredToEnroll: [],
			requiredToApprove: []
		},
		{
			id: 29,
			year: 4,
			name: 'PROYECTO INTEGRADOR DE DISEÑO INDUSTRIAL',
			oldName: 'DISEÑO INDUSTRIAL III',
			regimen: 'ANUAL',
			modalidad: 'PRESENCIAL',
			horas_lectivas: 8,
			horas_IP: 240,
			horas_TAE: 560,
			horas_TTE: 800,
			credits: 32,
			status: 'normal',
			requiredToEnroll: [
				{ subjectId: 22, requiredStatus: 'approved' },
				{ subjectId: 21, requiredStatus: 'regular' }
			],
			requiredToApprove: [
				{ subjectId: 1, requiredStatus: 'approved' },
				{ subjectId: 2, requiredStatus: 'approved' },
				{ subjectId: 3, requiredStatus: 'approved' },
				{ subjectId: 4, requiredStatus: 'approved' },
				{ subjectId: 5, requiredStatus: 'approved' },
				{ subjectId: 6, requiredStatus: 'approved' },
				{ subjectId: 7, requiredStatus: 'approved' },
				{ subjectId: 8, requiredStatus: 'approved' },
				{ subjectId: 9, requiredStatus: 'approved' },
				{ subjectId: 10, requiredStatus: 'approved' },
				{ subjectId: 11, requiredStatus: 'approved' },
				{ subjectId: 12, requiredStatus: 'approved' },
				{ subjectId: 13, requiredStatus: 'approved' },
				{ subjectId: 14, requiredStatus: 'approved' },
				{ subjectId: 15, requiredStatus: 'approved' },
				{ subjectId: 16, requiredStatus: 'approved' },
				{ subjectId: 17, requiredStatus: 'approved' },
				{ subjectId: 18, requiredStatus: 'approved' },
				{ subjectId: 19, requiredStatus: 'approved' },
				{ subjectId: 20, requiredStatus: 'approved' },
				{ subjectId: 21, requiredStatus: 'approved' },
				{ subjectId: 22, requiredStatus: 'approved' },
				{ subjectId: 24, requiredStatus: 'approved' },
				{ subjectId: 25, requiredStatus: 'approved' }
			]
		}
	]
};

export const defaultSubjects = subjectsByYear;
export const defaultPlans = plansByYear;
