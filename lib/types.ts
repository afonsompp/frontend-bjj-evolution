/* =========================================
   Enums & Domains
========================================= */

export type TechniqueType = 
  | 'SUBMISSION' | 'PIN' | 'POSITION' | 'GUARD_PASS' 
  | 'GUARD_POSITION' | 'SCAPE' | 'SWEEP' | 'TAKEDOWN' | 'GRIP';

export type TechniqueTarget = 
  | 'HEAD' | 'NECK' | 'SHOULDER' | 'TORSO' | 'LEG' | 'FOOT' 
  | 'ANKLE' | 'KNEE' | 'HIP' | 'BACK' | 'SPINE' | 'ARM' 
  | 'ELBOW' | 'WRIST' | 'HAND' | 'GUARD_PASS' | 'GUARD_POSITION' 
  | 'PIN' | 'TAKEDOWN' | 'SWEEP' | 'ESCAPE';

export type ClassType = 'GI' | 'NO_GI';
export type TrainingType = 'REGULAR' | 'OPEN_MAT' | 'COMPETITION' | 'SEMINAR' | 'DRILL';

export type UserRole = 'ACADEMY_OWNER' | 'CUSTOMER' | 'ADMIN';
export type AcademyRole = 'OWNER' | 'MANAGER' | 'INSTRUCTOR' | 'STUDENT';
export type MemberStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

/* =========================================
   Entities
========================================= */

export interface Technique {
  id: number;
  name: string;
  alternativeName?: string;
  type: TechniqueType;
  target: TechniqueTarget;
}

export interface UserProfile {
  id: string;
  name: string;
  secondName: string;
  nickname: string
  belt: string;
  stripe: number;
  role: string

}

/* =========================================
   API DTOs
========================================= */

/**
 * Usado para enviar dados para a API (POST/PUT).
 * Usa arrays de IDs para relacionamentos.
 */
export interface TrainingRequestDTO {
  classType: ClassType;
  trainingType: TrainingType;
  sessionDate: string; // ISO String
  durationMinutes: number;
  
  // Relacionamentos via ID
  techniqueIds: number[];
  techniqueSubmissionIds: number[];
  techniqueSubmissionAllowedIds: number[];
  
  // Métricas
  totalRolls: number;
  totalRounds: number;
  roundLengthMinutes: number;
  restLengthMinutes: number;
  cardioRating: number;
  intensityRating: number;
  
  // Pontuação
  taps: number;
  submissions: number;
  escapes: number;
  sweeps: number;
  takedowns: number;
  guardPasses: number;
}

/**
 * Usado para receber dados da API (GET).
 * Usa arrays de Objetos para exibir nomes e detalhes no Dashboard.
 */
export interface TrainingResponse {
  id: number;
  classType: ClassType;
  trainingType: TrainingType;
  sessionDate: string;
  durationMinutes: number;

  // Relacionamentos Expandidos (Importante para o Dashboard ler o .name)
  technique: Technique[]; 
  submissionTechniques: Technique[];
  submissionTechniquesAllowed: Technique[];
  
  userProfile?: UserProfile;

  // Métricas
  totalRolls: number;
  roundLengthMinutes: number;
  restLengthMinutes: number;
  cardioRating: number;
  intensityRating: number;

  // Pontuação
  taps: number;
  submissions: number;
  escapes: number;
  sweeps: number;
  takedowns: number;
  guardPasses: number;

  description: string;

}