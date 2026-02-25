import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, MapPin, Save } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createAcademy } from '../api/academyService';
import { CreateAcademyDTO } from '../types';
import { useAuth } from '@/context/AuthContext';

export const AcademyCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateAcademyDTO>();

  const mutation = useMutation({
    mutationFn: (data: CreateAcademyDTO) => createAcademy(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-academies'] });
      navigate(`/academies/${data.id}`);
    }
  });

  const onSubmit = (data: CreateAcademyDTO) => {
    if (user) {
      // O ownerId vem do usuário logado
      mutation.mutate({ ...data, ownerId: user.id });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Criar Nova Academia</h1>
        <p className="text-zinc-400">Configure o espaço para seus alunos.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-zinc-800 rounded-xl p-6 space-y-6">
        <Input 
          label="Nome da Academia" 
          placeholder="Ex: Gracie Barra Centro" 
          {...register('name', { required: 'Nome é obrigatório' })}
          error={errors.name?.message}
        />

        <Input 
          label="Endereço" 
          placeholder="Rua, Número, Bairro..." 
          {...register('address', { required: 'Endereço é obrigatório' })}
          error={errors.address?.message}
        />

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Criar Academia
          </Button>
        </div>
      </form>
    </div>
  );
};