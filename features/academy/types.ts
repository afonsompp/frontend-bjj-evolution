import { UserProfile, AcademyRole, MemberStatus, ClassType, TrainingType } from '@/lib/types';
import { BeltType } from '@/types';

export interface Academy {
  id: string;
  name: string;
  address: string;
}

export interface AddMemberDTO {
  userId: string;
  role: AcademyRole;
  belt?: BeltType;
  stripe?: number;
  status?: MemberStatus;
}


export interface AcademyMember {
  academyId: string;
  user: UserProfile;
  role: AcademyRole;
  status: MemberStatus;
  belt: BeltType;
  stripe: number;
}

export interface GraduationRequest {
  newBelt: BeltType;
  newStripe: number;
}
export interface ScheduledClass {
  id: number;
  academyId: string;
  instructor: UserProfile;
  startTime: string; // ISO DateTime
  duration: string; // ISO Duration ou minutos (depende do seu DTO)
  classType: ClassType;
  trainingType: TrainingType;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELED';
}

export interface CreateAcademyDTO {
  name: string;
  address: string;
  ownerId: string;
}

export interface CreateClassDTO {
  instructorId: string;
  startTime: string;
  durationMinutes: number;
  classType: ClassType;
  trainingType: TrainingType;
  techniqueIds: number[];
}