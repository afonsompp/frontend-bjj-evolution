import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save, Activity, Timer, BookOpen, Trophy, AlertCircle } from 'lucide-react';
import { TechniqueSelector } from '../../components/training/TechniqueSelector';
import { Technique, TrainingRequestDTO } from './types';

// --- 1. Zod Schema (Traduzido) ---
const trainingSchema = z.object({
  classType: z.enum(['REGULAR', 'PRIVATE', 'OPEN_MAT', 'SEMINAR', 'CAMP', 'COMPETITION', 'TEACHING']),
  trainingType: z.enum(['GI', 'NO_GI']),
  sessionDate: z.string().min(1, 'A data é obrigatória'),
  durationMinutes: z.coerce.number().min(0, 'Duração inválida'),
  
  // Os 3 Arrays de IDs para as Técnicas
  techniqueIds: z.array(z.number()).default([]),
  submissionTechniqueIds: z.array(z.number()).default([]),
  submissionTechniqueAllowedIds: z.array(z.number()).default([]),

  totalRolls: z.coerce.number().min(0),
  totalRounds: z.coerce.number().min(0),
  roundLengthMinutes: z.coerce.number().min(0),
  restLengthMinutes: z.coerce.number().min(0),
  cardioRating: z.coerce.number().min(1).max(5),
  intensityRating: z.coerce.number().min(1).max(5),
  taps: z.coerce.number().min(0),
  submissions: z.coerce.number().min(0),
  escapes: z.coerce.number().min(0),
  sweeps: z.coerce.number().min(0),
  takedowns: z.coerce.number().min(0),
  guardPasses: z.coerce.number().min(0),
});

type FormData = z.infer<typeof trainingSchema>;

type TechniqueField = 'techniqueIds' | 'submissionTechniqueIds' | 'submissionTechniqueAllowedIds';

export const TrainingForm: React.FC = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Buscar Técnicas
  const { data: techniques = [], isLoading: isLoadingTechniques } = useQuery({
    queryKey: ['techniques'],
    queryFn: async () => {
      const res = await api.get<Technique[]>('/techniques');
      return res.data;
    }
  });

  // Buscar Treino (se edição)
  const { data: trainingToEdit, isLoading: isLoadingTraining } = useQuery({
    queryKey: ['training', id],
    queryFn: async () => {
      const res = await api.get(`/trainings/${id}`);
      return res.data;
    },
    enabled: isEditing,
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      classType: 'REGULAR',
      trainingType: 'GI',
      durationMinutes: 90,
      totalRolls: 1,
      totalRounds: 1,
      roundLengthMinutes: 5,
      restLengthMinutes: 1,
      cardioRating: 3,
      intensityRating: 3,
      techniqueIds: [],
      submissionTechniqueIds: [],
      submissionTechniqueAllowedIds: [],
      taps: 0, submissions: 0, escapes: 0, sweeps: 0, takedowns: 0, guardPasses: 0
    }
  });

  // --- 2. Preenchimento do Formulário (Edição) ---
  useEffect(() => {
    if (trainingToEdit) {
      const date = new Date(trainingToEdit.sessionDate);
      // Ajuste simples para datetime-local
      const formattedDate = date.toISOString().slice(0, 16); 

      const extractIds = (list: any[]) => list ? list.map((t: any) => t.id) : [];

      reset({
        ...trainingToEdit,
        sessionDate: formattedDate,
        techniqueIds: extractIds(trainingToEdit.technique || trainingToEdit.techniques),
        submissionTechniqueIds: extractIds(trainingToEdit.submissionTechniques),
        submissionTechniqueAllowedIds: extractIds(trainingToEdit.submissionTechniquesAllowed),
      });
    }
  }, [trainingToEdit, reset]);

  const watchedTechniques = watch('techniqueIds');
  const watchedSubs = watch('submissionTechniqueIds');
  const watchedTaps = watch('submissionTechniqueAllowedIds');

  const mutation = useMutation({
    mutationFn: (data: TrainingRequestDTO) => {
      const payload = { ...data, sessionDate: new Date(data.sessionDate).toISOString() };
      
      if (isEditing) {
        return api.put(`/trainings/${id}`, payload);
      }
      return api.post('/trainings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      if (isEditing) queryClient.invalidateQueries({ queryKey: ['training', id] });
      navigate('/trainings');
    },
    onError: (err) => {
      console.error(err);
      alert('Falha ao salvar o treino.');
    }
  });

  const handleToggle = (field: TechniqueField, techId: number) => {
    const currentList = watch(field) || [];
    if (currentList.includes(techId)) {
      setValue(field, currentList.filter(id => id !== techId));
    } else {
      setValue(field, [...currentList, techId]);
    }
  };

  if (isEditing && isLoadingTraining) {
      return <div className="p-10 text-center text-zinc-500">Carregando dados...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/trainings')}>
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Editar Treino' : 'Registrar Treino'}
        </h1>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data as any))} className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        
        {/* SEÇÃO 1: Informações Gerais */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
             <Activity className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold text-white">Informações Gerais</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Data e Hora</label>
                 <input 
                    type="datetime-local" 
                    className="block w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-primary"
                    {...register('sessionDate')}
                 />
                 {errors.sessionDate && <span className="text-red-500 text-xs">{errors.sessionDate.message}</span>}
              </div>
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Duração (min)</label>
                 <input type="number" className="form-input block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('durationMinutes')} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Tipo</label>
                 <select className="block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('trainingType')}>
                    <option value="GI">De Kimono (Gi)</option>
                    <option value="NO_GI">Sem Kimono (No-Gi)</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Tipo de Aula</label>
                 <select className="block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('classType')}>
                    <option value="REGULAR">Aula Normal</option>
                    <option value="OPEN_MAT">Open Mat / Livre</option>
                    <option value="PRIVATE">Particular</option>
                    <option value="COMPETITION">Competição</option>
                    <option value="SEMINAR">Seminário</option>
                    <option value="CAMP">Camp</option>
                    <option value="TEACHING">Dando Aula</option>
                 </select>
              </div>
           </div>
        </section>

        {/* SEÇÃO 2: Técnicas Treinadas */}
        <section className="border-t border-zinc-800 pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Técnicas Treinadas / Posição do Dia</h3>
            </div>
            <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800">
                {isLoadingTechniques ? <p className="text-zinc-500">Carregando...</p> : (
                    <TechniqueSelector 
                        techniques={techniques}
                        selectedIds={watchedTechniques}
                        onToggle={(id) => handleToggle('techniqueIds', id)}
                    />
                )}
            </div>
        </section>

        {/* SEÇÃO 3: Meus Ataques */}
        <section className="border-t border-zinc-800 pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Minhas Finalizações (Ataque)</h3>
            </div>
            <div className="bg-green-950/10 p-4 rounded-lg border border-green-900/30">
                {isLoadingTechniques ? <p className="text-zinc-500">Carregando...</p> : (
                    <TechniqueSelector 
                        techniques={techniques}
                        selectedIds={watchedSubs}
                        onToggle={(id) => handleToggle('submissionTechniqueIds', id)}
                    />
                )}
            </div>
        </section>

        {/* SEÇÃO 4: Minhas Defesas */}
        <section className="border-t border-zinc-800 pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Finalizações Sofridas (Defesa)</h3>
            </div>
            <div className="bg-red-950/10 p-4 rounded-lg border border-red-900/30">
                {isLoadingTechniques ? <p className="text-zinc-500">Carregando...</p> : (
                    <TechniqueSelector 
                        techniques={techniques}
                        selectedIds={watchedTaps}
                        onToggle={(id) => handleToggle('submissionTechniqueAllowedIds', id)}
                    />
                )}
            </div>
        </section>

        {/* SEÇÃO 5: Estatísticas */}
        <section className="space-y-4 pt-4 border-t border-zinc-800">
           <div className="flex items-center gap-2 pb-2">
             <Timer className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold text-white">Métricas de Performance</h3>
           </div>
           
           {/* Estrutura */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                  <label className="text-xs text-zinc-500">Total Rounds</label>
                  <input type="number" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('totalRounds')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Total Rolas (Lutas)</label>
                  <input type="number" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('totalRolls')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Gás / Cardio (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('cardioRating')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Intensidade (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('intensityRating')} />
              </div>
           </div>

           {/* Contadores */}
           <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                {k: 'submissions', l: 'Finalizou'}, {k: 'taps', l: 'Bateu'}, 
                {k: 'takedowns', l: 'Quedas'}, {k: 'sweeps', l: 'Raspagens'}, 
                {k: 'guardPasses', l: 'Passagens'}, {k: 'escapes', l: 'Escapes'}
              ].map(stat => (
                  <div key={stat.k} className="bg-zinc-950 p-2 rounded border border-zinc-800 hover:border-zinc-600 transition-colors">
                      <label className="block text-[10px] uppercase text-zinc-500">{stat.l}</label>
                      <input type="number" className="w-full bg-transparent border-none text-white font-bold text-lg p-0 focus:ring-0" {...register(stat.k as any)} />
                  </div>
              ))}
           </div>
        </section>

        <div className="pt-4 flex justify-end">
           <Button type="submit" disabled={isSubmitting || mutation.isPending} className="w-full md:w-auto font-bold">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Treino' : 'Salvar Treino')}
           </Button>
        </div>

      </form>
    </div>
  );
};