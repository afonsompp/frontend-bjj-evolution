import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AcademyMember } from '../types';

export const useAcademyPermissions = (academyId?: string) => {
  const { user } = useAuth();
  
  const { data: member } = useQuery({
    queryKey: ['academyMember', academyId, user?.id],
    queryFn: async () => {
      if (!academyId || !user) return null;
      const { data } = await api.get<AcademyMember>(`/academies/${academyId}/members/${user.id}`);
      return data;
    },
    enabled: !!academyId && !!user,
    retry: false,
    staleTime: 1000 * 60 * 5 // Cache de 5 min
  });

  const role = member?.role;
  
  return {
    // Dados do Membro (Novo)
    member, 
    belt: member?.belt,
    stripe: member?.stripe,

    // Permissões (Existentes)
    role,
    isOwner: role === 'OWNER',
    isManager: role === 'MANAGER',
    isStaff: ['OWNER', 'MANAGER', 'INSTRUCTOR'].includes(role || ''),
    isStudent: role === 'STUDENT',
    memberStatus: member?.status
  };
};