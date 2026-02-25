import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  secondName: z.string().min(1, 'Sobrenome é obrigatório'),
  nickname: z.string().min(1, 'usuário é obrigatório'),
  belt: z.enum(['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']),
  stripe: z.coerce.number().min(0).max(4),
  startsIn: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: 'Data inválida',
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;