import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

import { profileSchema, ProfileFormData } from '../schemas/profile.schema';
import { UserProfile } from '@/types';

interface ProfileFormProps {
  initialData: UserProfile | null;
  onSubmit: (data: ProfileFormData) => void;
  isSubmitting: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isDirty } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      belt: 'WHITE',
      stripe: 0,
      startsIn: new Date().toISOString().split('T')[0] 
    }
  });

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.startsIn 
        ? new Date(initialData.startsIn).toISOString().split('T')[0] 
        : '';

      reset({
        name: initialData.name,
        secondName: initialData.secondName,
        belt: initialData.belt,
        stripe: Number(initialData.stripe),
        startsIn: formattedDate,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* LINHA 1: Nome e Sobrenome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Nome" 
          placeholder="Seu primeiro nome"
          {...register('name')} 
          error={errors.name?.message} 
        />
        
        <Input 
          label="Sobrenome" 
          placeholder="Seu sobrenome"
          {...register('secondName')} 
          error={errors.secondName?.message} 
        />
      </div>

      {/* LINHA 2: Detalhes da Graduação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select 
          label="Faixa" 
          {...register('belt')} 
          error={errors.belt?.message}
        >
          <option value="WHITE">Branca</option>
          <option value="BLUE">Azul</option>
          <option value="PURPLE">Roxa</option>
          <option value="BROWN">Marrom</option>
          <option value="BLACK">Preta</option>
        </Select>
        
        <Select 
          label="Graus" 
          {...register('stripe')} 
          error={errors.stripe?.message}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>

        <Input 
          type="date" 
          label="Início dos Treinos" 
          {...register('startsIn')} 
          error={errors.startsIn?.message} 
        />
      </div>

      {/* FOOTER: Ações */}
      <div className="pt-4 border-t border-zinc-800 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !isDirty}
          isLoading={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};