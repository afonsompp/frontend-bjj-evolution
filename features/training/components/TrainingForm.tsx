import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save, Activity, Timer, BookOpen, Trophy, AlertCircle, 
  Dumbbell, HeartPulse, Zap, FileText 
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TechniqueSelector } from './TechniqueSelector'; 
import { trainingSchema, TrainingFormData } from '../domain/training.schema';
import { Technique, TrainingResponse } from '../../../lib/types';

interface TrainingFormProps {
  initialData?: TrainingResponse;
  techniques: Technique[];
  onSubmit: (data: TrainingFormData) => void;
  isSubmitting: boolean;
}

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
    // O 'as any' aqui resolve o conflito de chaves que o TS reportou no erro
    resolver: zodResolver(trainingSchema) as any, 
    defaultValues: {
      classType: 'REGULAR',
      trainingType: 'GI',
      description: '',
      durationMinutes: 60,
      totalRolls: 5,
      techniqueIds: [],
      submissionTechniqueIds: [],
      submissionTechniqueAllowedIds: [],
      submissions: 0,
      taps: 0,
      escapes: 0,
      sweeps: 0,
      takedowns: 0,
      guardPasses: 0,
      roundLengthMinutes: 5,
      restLengthMinutes: 1,
      cardioRating: 3,
      intensityRating: 3
    }
  });

  useEffect(() => {
    if (initialData) {
      const extractIds = (list: any[] | undefined) => 
        Array.isArray(list) ? list.map((t: any) => (typeof t === 'number' ? t : t.id)) : [];

      // Mapeamento manual para garantir que o TS aceite os dados da API no Form
      const formData: TrainingFormData = {
        sessionDate: initialData.sessionDate ? new Date(initialData.sessionDate).toISOString().slice(0, 16) : "",
        durationMinutes: initialData.durationMinutes,
        totalRolls: initialData.totalRolls,
        classType: initialData.classType as any,
        trainingType: initialData.trainingType as any,
        description: initialData.description || "",
        roundLengthMinutes: initialData.roundLengthMinutes || 5,
        restLengthMinutes: initialData.restLengthMinutes || 1,
        cardioRating: initialData.cardioRating || 3,
        intensityRating: initialData.intensityRating || 3,
        techniqueIds: extractIds(initialData.technique),
        submissionTechniqueIds: extractIds(initialData.submissionTechniques),
        submissionTechniqueAllowedIds: extractIds(initialData.submissionTechniquesAllowed),
        submissions: initialData.submissions || 0,
        taps: initialData.taps || 0,
        escapes: initialData.escapes || 0,
        sweeps: initialData.sweeps || 0,
        takedowns: initialData.takedowns || 0,
        guardPasses: initialData.guardPasses || 0,
      };

      reset(formData);
    }
  }, [initialData, reset]);

  const handleTechToggle = (field: keyof TrainingFormData, id: number) => {
    const current = (watch(field) as number[]) || [];
    const updated = current.includes(id) 
      ? current.filter((x) => x !== id) 
      : [...current, id];
    setValue(field, updated as any, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
      
      {/* 1. INFO GERAL */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
           <Activity className="w-5 h-5 text-primary" />
           <h3 className="text-lg font-semibold text-white">Informações Gerais</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Input label="Data e Hora" type="datetime-local" {...register('sessionDate')} error={errors.sessionDate?.message} />
           <Input label="Duração (min)" type="number" {...register('durationMinutes')} />
           <Select label="Tipo" {...register('trainingType')}>
              <option value="GI">De Kimono (Gi)</option>
              <option value="NO_GI">Sem Kimono (No-Gi)</option>
           </Select>
           <Select label="Tipo de Aula" {...register('classType')}>
              <option value="REGULAR">Aula Normal</option>
              <option value="OPEN_MAT">Open Mat</option>
              <option value="PRIVATE">Particular</option>
              <option value="COMPETITION">Competição</option>
              <option value="SEMINAR">Seminário</option>
              <option value="CAMP">Camp</option>
              <option value="TEACHING">Dando Aula</option>
           </Select>
        </div>
      </section>

      

      {/* 3. ESTRUTURA E INTENSIDADE */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/50">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Esforço e Sparring</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Input label="Total de Rolas" type="number" {...register('totalRolls')} />
           
           <div className="relative">
             <Input label="Cardio (1-5)" type="number" {...register('cardioRating')} />
             <HeartPulse className="absolute right-3 top-9 w-4 h-4 text-rose-500 opacity-50" />
           </div>
           
           <div className="relative">
             <Input label="Intensidade (1-5)" type="number" {...register('intensityRating')} />
             <Zap className="absolute right-3 top-9 w-4 h-4 text-yellow-500 opacity-50" />
           </div>
        </div>
      </section>

      {/* 4. SELEÇÃO DE TÉCNICAS */}
      <div className="space-y-8 border-t border-zinc-800 pt-6">
        <section className="space-y-3">
           <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Técnicas Estudadas (Drills)</h3>
           </div>
           <TechniqueSelector 
              techniques={techniques}
              selectedIds={watch('techniqueIds') || []}
              onToggle={(id) => handleTechToggle('techniqueIds', id)}
           />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-white">Finalizações Aplicadas</h3>
          </div>
          <TechniqueSelector 
              techniques={techniques}
              selectedIds={watch('submissionTechniqueIds') || []}
              onToggle={(id) => handleTechToggle('submissionTechniqueIds', id)}
              className="theme-emerald"
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-semibold text-white">Defesas de Finalização</h3>
          </div>
          <TechniqueSelector 
              techniques={techniques}
              selectedIds={watch('submissionTechniqueAllowedIds') || []}
              onToggle={(id) => handleTechToggle('submissionTechniqueAllowedIds', id)}
              className="theme-rose"
          />
        </section>
      </div>

      {/* 5. SCORECARD */}
      <section className="grid grid-cols-3 md:grid-cols-6 gap-3 border-t border-zinc-800 pt-6">
           <Input label="Finalizou" type="number" containerClassName="bg-emerald-500/5" {...register('submissions')} />
           <Input label="Bateu" type="number" containerClassName="bg-rose-500/5" {...register('taps')} />
           <Input label="Quedas" type="number" {...register('takedowns')} />
           <Input label="Raspagens" type="number" {...register('sweeps')} />
           <Input label="Passagens" type="number" {...register('guardPasses')} />
           <Input label="Escapes" type="number" {...register('escapes')} />
      </section>

      {/* DESCRIÇÃO */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            <h3 className="text-lg font-semibold text-white">Resumo e Notas</h3>
        </div>
        <textarea 
          {...register('description')}
          className="w-full min-h-[80px] bg-zinc-950 border border-zinc-800 rounded-md p-3 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          placeholder="Como foi o treino?"
        />
      </section>

      {/* BOTÃO SALVAR */}
      <div className="flex justify-end pt-4 border-t border-zinc-800">
         <Button 
            type="submit" 
            disabled={isSubmitting || !isDirty} 
            isLoading={isSubmitting}
            className="w-full md:w-auto px-8"
         >
            <Save className="w-4 h-4 mr-2" /> 
            {initialData ? 'Atualizar Treino' : 'Registrar Treino'}
         </Button>
      </div>
    </form>
  );
};