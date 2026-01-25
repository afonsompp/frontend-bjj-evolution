import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTrainings, getTrainingById, getTechniques } from '../api/trainingService';

export const useTrainingsList = (page: number) => {
  return useQuery({
    queryKey: ['trainings', page],
    queryFn: () => getTrainings(page),
    placeholderData: keepPreviousData,
  });
};

export const useTrainingDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['training', id],
    queryFn: () => getTrainingById(id!),
    enabled: !!id,
  });
};

export const useTechniquesList = () => {
  return useQuery({
    queryKey: ['techniques'],
    queryFn: getTechniques,
  });
};