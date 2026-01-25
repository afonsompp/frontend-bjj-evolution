import { api } from '@/lib/api';
import { TrainingFormData } from '../schemas/training.schema';
import { Technique, TrainingResponse } from '../types';

export const getTrainings = async (page = 0, size = 10) => {
  const { data } = await api.get('/trainings', {
    params: { page, size, sort: 'sessionDate,desc' },
  });
  return data;
};

export const getTrainingById = async (id: string) => {
  const { data } = await api.get<TrainingResponse>(`/trainings/${id}`);
  return data;
};

export const getTechniques = async () => {
  const { data } = await api.get<Technique[]>('/techniques');
  return data;
};

export const createTraining = async (data: TrainingFormData) => {
  const payload = { ...data, sessionDate: new Date(data.sessionDate).toISOString() };
  return api.post('/trainings', payload);
};

export const updateTraining = async (id: string, data: TrainingFormData) => {
  const payload = { ...data, sessionDate: new Date(data.sessionDate).toISOString() };
  return api.put(`/trainings/${id}`, payload);
};

export const deleteTraining = async (id: number) => {
  return api.delete(`/trainings/${id}`);
};