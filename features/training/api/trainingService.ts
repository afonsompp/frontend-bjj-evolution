import { api } from '@/lib/api';
import { TrainingFormData } from '../domain/training.schema';
import { Technique, TrainingResponse } from '../types';
import { Page } from '../domain/page.type';

export const getTechniques = async (query = '', page = 0, size = 20) => {
  const params: any = { page, size, sort: 'name,asc' };
  
  if (query) {
    params.query = query;
  }

  const { data } = await api.get<Page<Technique>>('/techniques', { params });
  return data;
};

export const createTechnique = async (data: {
  name: string;
  alternativeName?: string;
  type: string;
  target: string;
}) => {
  const { data: newTechnique } = await api.post('/techniques', data);
  return newTechnique;
};

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