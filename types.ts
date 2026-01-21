export type ClassType = 'REGULAR' | 'PRIVATE' | 'OPEN_MAT' | 'SEMINAR' | 'CAMP' | 'COMPETITION' | 'TEACHING';
export type TrainingType = 'GI' | 'NO_GI';
export type BeltType = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';

export interface UserProfile {
  id: string;
  name: string;
  secondName: string;
  belt: BeltType;
  stripe: number;
  startsIn: string;
}

export interface CreateUpdateProfileDTO {
  name: string;
  secondName: string;
  belt: BeltType;
  stripe: number;
  startsIn: string;
}

export interface TechniqueSummary {
  id: number;
  name: string;
}

export interface TrainingResponse {
  id: number;
  classType: ClassType;
  trainingType: TrainingType;
  sessionDate: string;
  durationMinutes: number;
  techniques: TechniqueSummary[];
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

export interface CreateUpdateTrainingDTO {
  classType: ClassType;
  trainingType: TrainingType;
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
