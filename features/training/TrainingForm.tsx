import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save, Activity, Timer, Hash } from 'lucide-react';
import { TechniqueSelector } from '../../components/training/TechniqueSelector';
import { Technique, TrainingRequestDTO } from './types';

// --- Zod Schema (Mesmo de antes) ---
const trainingSchema = z.object({
  classType: z.enum(['REGULAR', 'PRIVATE', 'OPEN_MAT', 'SEMINAR', 'CAMP', 'COMPETITION', 'TEACHING']),
  trainingType: z.enum(['GI', 'NO_GI']),
  sessionDate: z.string().min(1, 'Date is required'),
  durationMinutes: z.coerce.number().min(0),
  totalRolls: z.coerce.number().min(0),
  totalRounds: z.coerce.number().min(0),
  roundLengthMinutes: z.coerce.number().min(0),
  restLengthMinutes: z.coerce.number().min(0),
  techniqueIds: z.array(z.number()).default([]),
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

export const TrainingForm: React.FC = () => {
  const { id } = useParams(); // 1. Pega o ID da URL
  const isEditing = Boolean(id);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 2. Fetch das Técnicas (Sempre necessário)
  const { data: techniques = [], isLoading: isLoadingTechniques } = useQuery({
    queryKey: ['techniques'],
    queryFn: async () => {
      const res = await api.get<Technique[]>('/techniques');
      return res.data;
    }
  });

  // 3. Fetch do Treino (Apenas se estiver editando)
  const { data: trainingToEdit, isLoading: isLoadingTraining } = useQuery({
    queryKey: ['training', id],
    queryFn: async () => {
      const res = await api.get(`/trainings/${id}`);
      return res.data;
    },
    enabled: isEditing, // Só roda se tiver ID
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
      taps: 0, submissions: 0, escapes: 0, sweeps: 0, takedowns: 0, guardPasses: 0
    }
  });

  // 4. Efeito para preencher o formulário quando os dados chegam
  useEffect(() => {
    if (trainingToEdit) {
      // Formatar data para o input datetime-local (yyyy-MM-ddThh:mm)
      const date = new Date(trainingToEdit.sessionDate);
      const formattedDate = date.toISOString().slice(0, 16); 

      // Extrair apenas os IDs das técnicas (o backend retorna objetos completos)
      const techIds = trainingToEdit.techniques 
        ? trainingToEdit.techniques.map((t: any) => t.id) 
        : [];

      reset({
        ...trainingToEdit,
        sessionDate: formattedDate,
        techniqueIds: techIds
      });
    }
  }, [trainingToEdit, reset]);

  const selectedTechniqueIds = watch('techniqueIds');

  // 5. Mutação Dinâmica (Create ou Update)
  const mutation = useMutation({
    mutationFn: (data: TrainingRequestDTO) => {
      if (isEditing) {
        return api.put(`/trainings/${id}`, data);
      }
      return api.post('/trainings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      // Se for edição, invalida também o detalhe específico
      if (isEditing) queryClient.invalidateQueries({ queryKey: ['training', id] });
      
      alert(isEditing ? 'Treino atualizado!' : 'Treino registrado!');
      navigate('/trainings');
    },
    onError: (err) => {
      console.error(err);
      alert('Falha ao salvar o treino.');
    }
  });

  const onSubmit = (data: FormData) => {
    const isoDate = new Date(data.sessionDate).toISOString();
    mutation.mutate({ ...data, sessionDate: isoDate });
  };

  const handleTechniqueToggle = (techId: number) => {
    const current = selectedTechniqueIds || [];
    if (current.includes(techId)) {
      setValue('techniqueIds', current.filter(tid => tid !== techId));
    } else {
      setValue('techniqueIds', [...current, techId]);
    }
  };

  if (isEditing && isLoadingTraining) {
      return <div className="p-10 text-center text-zinc-500">Carregando dados do treino...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/trainings')}>
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit Session' : 'Log Session'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        
        {/* === SECTION 1: General Info === */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
             <Activity className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold text-white">General Info</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2">
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Date & Time</label>
                 <input 
                    type="datetime-local" 
                    max="9999-12-31T23:59"
                    className="block w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-primary"
                    {...register('sessionDate')}
                 />
                 {errors.sessionDate && <span className="text-red-500 text-xs">{errors.sessionDate.message}</span>}
              </div>
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (min)</label>
                 <input type="number" className="form-input block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('durationMinutes')} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                 <select className="block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('trainingType')}>
                    <option value="GI">Gi</option>
                    <option value="NO_GI">No-Gi</option>
                 </select>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Class Context</label>
                 <select className="block w-full bg-zinc-950 border-zinc-700 rounded-md text-white" {...register('classType')}>
                    <option value="REGULAR">Regular Class</option>
                    <option value="OPEN_MAT">Open Mat</option>
                    <option value="PRIVATE">Private Lesson</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="CAMP">Camp</option>
                    <option value="COMPETITION">Competition</option>
                    <option value="TEACHING">Teaching</option>
                 </select>
              </div>
           </div>
        </section>

        {/* === SECTION 2: Techniques === */}
        <section className="border-t border-zinc-800 pt-6">
            {isLoadingTechniques ? (
                <div className="text-center py-4 text-zinc-500">Loading techniques...</div>
            ) : (
                <TechniqueSelector 
                    techniques={techniques}
                    selectedIds={selectedTechniqueIds}
                    onToggle={handleTechniqueToggle}
                />
            )}
        </section>

        {/* === SECTION 3: Stats & Rounds === */}
        <section className="space-y-4 pt-4 border-t border-zinc-800">
           <div className="flex items-center gap-2 pb-2">
             <Timer className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold text-white">Structure & Ratings</h3>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                  <label className="text-xs text-zinc-500">Rounds</label>
                  <input type="number" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('totalRounds')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Round Time (m)</label>
                  <input type="number" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('roundLengthMinutes')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Cardio (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('cardioRating')} />
              </div>
              <div>
                  <label className="text-xs text-zinc-500">Intensity (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-zinc-950 border-zinc-700 rounded text-white" {...register('intensityRating')} />
              </div>
           </div>
        </section>

        {/* === SECTION 4: Performance === */}
        <section className="pt-4 border-t border-zinc-800">
           <div className="flex items-center gap-2 pb-2">
             <Hash className="w-5 h-5 text-primary" />
             <h3 className="text-lg font-semibold text-white">Performance</h3>
           </div>
           <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                {k: 'submissions', l: 'Subs'}, {k: 'taps', l: 'Taps'}, 
                {k: 'takedowns', l: 'Takedowns'}, {k: 'sweeps', l: 'Sweeps'}, 
                {k: 'guardPasses', l: 'Passes'}, {k: 'escapes', l: 'Escapes'}
              ].map(stat => (
                  <div key={stat.k} className="bg-zinc-950 p-2 rounded border border-zinc-800">
                      <label className="block text-[10px] uppercase text-zinc-500">{stat.l}</label>
                      <input type="number" className="w-full bg-transparent border-none text-white font-bold text-lg p-0 focus:ring-0" {...register(stat.k as any)} />
                  </div>
              ))}
           </div>
        </section>

        <div className="pt-4 flex justify-end">
           <Button type="submit" disabled={isSubmitting || mutation.isPending} className="w-full md:w-auto font-bold">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Session' : 'Log Session')}
           </Button>
        </div>

      </form>
    </div>
  );
};