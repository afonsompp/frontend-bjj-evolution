import { z } from 'zod';

export const trainingSchema = z.object({
  classType: z.enum(['REGULAR', 'PRIVATE', 'OPEN_MAT', 'SEMINAR', 'CAMP', 'COMPETITION', 'TEACHING']),
  trainingType: z.enum(['GI', 'NO_GI']),
  sessionDate: z.string().min(1, 'A data é obrigatória'),
  
  durationMinutes: z.coerce.number().min(0),
  totalRolls: z.coerce.number().min(0), // Mantido conforme solicitado
  roundLengthMinutes: z.coerce.number().min(0),
  restLengthMinutes: z.coerce.number().min(0),
  cardioRating: z.coerce.number().min(1).max(5),
  intensityRating: z.coerce.number().min(1).max(5),

  techniqueIds: z.array(z.number()).default([]),
  submissionTechniqueIds: z.array(z.number()).default([]),
  submissionTechniqueAllowedIds: z.array(z.number()).default([]),

  taps: z.coerce.number().min(0).default(0),
  submissions: z.coerce.number().min(0).default(0),
  escapes: z.coerce.number().min(0).default(0),
  sweeps: z.coerce.number().min(0).default(0),
  takedowns: z.coerce.number().min(0).default(0),
  guardPasses: z.coerce.number().min(0).default(0),
  description: z.string().default(""),
});

export type TrainingFormData = z.infer<typeof trainingSchema>;