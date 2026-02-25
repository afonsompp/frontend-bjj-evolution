import { api } from '@/lib/api';
import { UserProfile, CreateUpdateProfileDTO } from '@/types';
import { ProfileFormData } from '../schemas/profile.schema';
import { Page } from '@/features/training/domain/page.type';

export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data } = await api.get<UserProfile>('/profiles');
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const saveProfile = async (data: ProfileFormData) => {
  return api.post('/profiles', data);
};

export const searchUsers = async (query: string) => {
  const { data } = await api.get<Page<UserProfile>>('/profiles/search', {
    params: { query, size: 5 }
  });
  return data.content;
};