import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile } from '../api/profileService';
import { ProfileFormData } from '../schemas/profile.schema';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ProfileFormData) => saveProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.invalidateQueries({ queryKey: ['checkProfileExists'] }); 
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
      alert("Falha ao atualizar o perfil.");
    },
  });
};