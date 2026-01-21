export type TechniqueType = 
  | 'SUBMISSION' | 'PIN' | 'POSITION' | 'GUARD_PASS' 
  | 'GUARD_POSITION' | 'SCAPE' | 'SWEEP' | 'TAKEDOWN' | 'GRIP';

export type TechniqueTarget = 
  | 'HEAD' | 'NECK' | 'SHOULDER' | 'TORSO' | 'LEG' | 'FOOT' 
  | 'ANKLE' | 'KNEE' | 'HIP' | 'BACK' | 'SPINE' | 'ARM' 
  | 'ELBOW' | 'WRIST' | 'HAND' | 'GUARD_PASS' | 'GUARD_POSITION' 
  | 'PIN' | 'TAKEDOWN' | 'SWEEP' | 'ESCAPE';

export interface Technique {
  id: number;
  name: string;
  alternativeName?: string;
  type: TechniqueType;
  target: TechniqueTarget;
}

export interface TrainingRequestDTO {
  classType: string;
  trainingType: string;
  sessionDate: string;
  durationMinutes: number;
  techniqueIds: number[];
  totalRolls: number;
  totalRounds: number;
  roundLengthMinutes: number;
  restLengthMinutes: number;
  cardioRating: number;
  intensityRating: number;
  taps: number;
  submissions: number;
  escapes: number;
  sweeps: number;
  takedowns: number;
  guardPasses: number;
}