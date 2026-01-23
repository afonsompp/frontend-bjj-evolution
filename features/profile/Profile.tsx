import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { UserProfile, CreateUpdateProfileDTO } from '../../types';
import { Button } from '../../components/ui/Button';
import { Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Esquema de validação traduzido
const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  secondName: z.string().min(1, 'Sobrenome é obrigatório'),
  belt: z.enum(['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']),
  stripe: z.coerce.number().min(0).max(4),
  startsIn: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: 'Data inválida',
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: profile, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data } = await api.get<UserProfile>('/profiles');
        return data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          return null as any;
        }
        throw err;
      }
    },
    retry: false,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        secondName: profile.secondName,
        belt: profile.belt,
        stripe: Number(profile.stripe) || 0, // Garante que seja número ao carregar
        startsIn: profile.startsIn,
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateUpdateProfileDTO) => {
        return api.post('/profiles', data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.invalidateQueries({ queryKey: ['checkProfileExists'] });
      navigate('/');
    },
    onError: () => {
      alert("Falha ao atualizar o perfil.");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;
  if (isError && (error as any)?.response?.status !== 404) return <div className="text-danger">Erro ao carregar perfil</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="text-text-muted mt-2">Gerencie suas informações pessoais e graduação.</p>
      </header>

      <div className="bg-surface rounded-xl p-6 border border-zinc-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Nome</label>
              <input
                type="text"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('name')}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Sobrenome</label>
              <input
                type="text"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('secondName')}
              />
              {errors.secondName && <p className="text-danger text-xs mt-1">{errors.secondName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Faixa</label>
              <select
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('belt')}
              >
                <option value="WHITE">Branca</option>
                <option value="BLUE">Azul</option>
                <option value="PURPLE">Roxa</option>
                <option value="BROWN">Marrom</option>
                <option value="BLACK">Preta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Graus</label>
              <select
                 className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                 {...register('stripe', { valueAsNumber: true })}
              >
                 <option value="0">0</option>
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Início dos Treinos</label>
              <input
                type="date"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('startsIn')}
              />
              {errors.startsIn && <p className="text-danger text-xs mt-1">{errors.startsIn.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty}
              isLoading={mutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};