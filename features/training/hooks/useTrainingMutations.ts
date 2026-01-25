import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createTraining, updateTraining, deleteTraining } from '../api/trainingService';
import { TrainingFormData } from '../schemas/training.schema';

export const useTrainingFormMutation = (id?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: TrainingFormData) => 
      id ? updateTraining(id, data) : createTraining(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['training', id] });
      navigate('/trainings');
    },
    onError: () => alert('Erro ao salvar treino.'),
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTraining,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainings'] }),
  });
};