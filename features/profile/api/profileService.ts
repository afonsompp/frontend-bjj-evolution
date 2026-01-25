import { api } from '@/lib/api';
import { UserProfile, CreateUpdateProfileDTO } from '@/types';
import { ProfileFormData } from '../schemas/profile.schema';

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