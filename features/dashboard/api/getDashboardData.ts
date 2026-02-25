import { api } from '@/lib/api';
import { TrainingResponse } from '../../../lib/types';

const toLocalDateTimeParam = (date: Date) => date.toISOString().slice(0, 19);

export const fetchTrainingsByDateRange = async (start: Date, end: Date): Promise<TrainingResponse[]> => {
  const { data } = await api.get('/trainings', {
    params: {
      startDate: toLocalDateTimeParam(start),
      endDate: toLocalDateTimeParam(end),
      sort: 'sessionDate,desc',
      size: 300,
    },
  });
  return data.content ?? [];
};