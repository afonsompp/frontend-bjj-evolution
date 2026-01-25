// src/features/trainings/components/TrainingForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save, Activity, Timer, BookOpen, Trophy, AlertCircle, 
  Dumbbell, HeartPulse, Zap 
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TechniqueSelector } from './TechniqueSelector'; 

// Logic & Types
import { trainingSchema, TrainingFormData } from '../schemas/training.schema';
import { Technique, TrainingResponse } from './../types'; // Ajuste o caminho se necessário

interface TrainingFormProps {
  initialData?: TrainingResponse;
  techniques: Technique[];
  onSubmit: (data: TrainingFormData) => void;
  isSubmitting: boolean;
}

type TechField = 'techniqueIds' | 'submissionTechniqueIds' | 'submissionTechniqueAllowedIds';

export const TrainingForm: React.FC<TrainingFormProps> = ({ 
  initialData, techniques, onSubmit, isSubmitting 
}) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset, 
    formState: { errors, isDirty } 
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema) as any,
    defaultValues: {
      classType: 'REGULAR',
      trainingType: 'GI',
      durationMinutes: 90,
      totalRolls: 5,
      totalRounds: 5,
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

  // Preenche o formulário se for edição
  useEffect(() => {
    if (initialData) {
       const extractIds = (list: any[]) => list ? list.map((t: any) => t.id) : [];
       
       reset({
         ...initialData,
         sessionDate: new Date(initialData.sessionDate).toISOString().slice(0, 16),
         techniqueIds: extractIds(initialData.technique),
         submissionTechniqueIds: extractIds(initialData.submissionTechniques),
         submissionTechniqueAllowedIds: extractIds(initialData.submissionTechniquesAllowed),
       });
    }
  }, [initialData, reset]);

  // Função genérica para alternar IDs nos arrays
  const handleTechToggle = (field: TechField, id: number) => {
    const current = watch(field) || [];
    const updated = current.includes(id) 
      ? current.filter((x) => x !== id) 
      : [...current, id];
    setValue(field, updated, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      
      {/* 1. INFORMAÇÕES GERAIS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
           <Activity className="w-5 h-5 text-primary" />
           <h3 className="text-lg font-semibold text-white">Informações Gerais</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Input 
              label="Data e Hora" 
              type="datetime-local" 
              {...register('sessionDate')} 
              error={errors.sessionDate?.message} 
           />
           <Input 
              label="Duração (min)" 
              type="number" 
              {...register('durationMinutes')} 
              error={errors.durationMinutes?.message} 
           />
           <Select label="Tipo" {...register('trainingType')}>
              <option value="GI">De Kimono (Gi)</option>
              <option value="NO_GI">Sem Kimono (No-Gi)</option>
           </Select>
           <Select label="Tipo de Aula" {...register('classType')}>
              <option value="REGULAR">Aula Normal</option>
              <option value="OPEN_MAT">Open Mat / Livre</option>
              <option value="PRIVATE">Particular</option>
              <option value="COMPETITION">Competição</option>
              <option value="SEMINAR">Seminário</option>
              <option value="CAMP">Camp</option>
              <option value="TEACHING">Dando Aula</option>
           </Select>
        </div>
      </section>

      {/* 2. ESTRUTURA E INTENSIDADE */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Estrutura do Treino</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Input label="Rounds Totais" type="number" {...register('totalRounds')} />
           <Input label="Total de Rolas" type="number" {...register('totalRolls')} />
           
           <div className="relative">
             <Input label="Cardio (1-5)" type="number" min="1" max="5" {...register('cardioRating')} />
             <HeartPulse className="absolute right-3 top-9 w-4 h-4 text-rose-500 opacity-50" />
           </div>
           
           <div className="relative">
             <Input label="Intensidade (1-5)" type="number" min="1" max="5" {...register('intensityRating')} />
             <Zap className="absolute right-3 top-9 w-4 h-4 text-yellow-500 opacity-50" />
           </div>
        </div>
      </section>

      {/* 3. TÉCNICAS TREINADAS (Neutro/Azul) */}
      <section className="border-t border-zinc-800 pt-6 space-y-3">
         <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Posição do Dia / Drills</h3>
         </div>
         <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800">
            <TechniqueSelector 
               techniques={techniques}
               selectedIds={watch('techniqueIds')}
               onToggle={(id) => handleTechToggle('techniqueIds', id)}
            />
         </div>
      </section>

      {/* 4. MEUS ATAQUES (Verde) */}
      <section className="border-t border-zinc-800 pt-6 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Minhas Finalizações (Ataque)</h3>
        </div>
        <div className="bg-emerald-950/10 p-4 rounded-lg border border-emerald-900/30">
            <TechniqueSelector 
                techniques={techniques}
                selectedIds={watch('submissionTechniqueIds')}
                onToggle={(id) => handleTechToggle('submissionTechniqueIds', id)}
                className="theme-emerald" // Opcional: se quiser estilizar o selector internamente
            />
        </div>
      </section>

      {/* 5. MINHAS DEFESAS (Vermelho) */}
      <section className="border-t border-zinc-800 pt-6 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">Finalizações Sofridas (Defesa)</h3>
        </div>
        <div className="bg-rose-950/10 p-4 rounded-lg border border-rose-900/30">
            <TechniqueSelector 
                techniques={techniques}
                selectedIds={watch('submissionTechniqueAllowedIds')}
                onToggle={(id) => handleTechToggle('submissionTechniqueAllowedIds', id)}
                className="theme-rose"
            />
        </div>
      </section>

      {/* 6. PLACAR / CONTADORES */}
      <section className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 pb-2">
            <Timer className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Placar Geral</h3>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
           <Input label="Finalizou" type="number" containerClassName="bg-emerald-500/5 rounded-md" {...register('submissions')} />
           <Input label="Bateu" type="number" containerClassName="bg-rose-500/5 rounded-md" {...register('taps')} />
           <Input label="Quedas" type="number" {...register('takedowns')} />
           <Input label="Raspagens" type="number" {...register('sweeps')} />
           <Input label="Passagens" type="number" {...register('guardPasses')} />
           <Input label="Escapes" type="number" {...register('escapes')} />
        </div>
      </section>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end pt-4 border-t border-zinc-800">
         <Button 
            type="submit" 
            disabled={isSubmitting || !isDirty} 
            isLoading={isSubmitting}
            className="w-full md:w-auto font-bold shadow-lg shadow-primary/10"
         >
            <Save className="w-4 h-4 mr-2" /> 
            {initialData ? 'Atualizar Treino' : 'Registrar Treino'}
         </Button>
      </div>
    </form>
  );
};