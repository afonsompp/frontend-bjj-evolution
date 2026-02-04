import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AcademyMember } from '../types';

export const useAcademyPermissions = (academyId?: string) => {
  const { user } = useAuth();
  
  // Busca o status do membro atual nesta academia específica
  const { data: member } = useQuery({
    queryKey: ['academyMember', academyId, user?.id],
    queryFn: async () => {
      if (!academyId || !user) return null;
      // Endpoint sugerido: GET /academies/{id}/members/{userId}
      const { data } = await api.get<AcademyMember>(`/academies/${academyId}/members/${user.id}`);
      return data;
    },
    enabled: !!academyId && !!user,
    retry: false
  });

  const role = member?.role;
  const isOwner = role === 'OWNER';
  const isManager = role === 'MANAGER';
  const isInstructor = role === 'INSTRUCTOR';

  return {
    role,
    isStaff: isOwner || isManager || isInstructor,
    canManageClasses: isOwner || isManager || isInstructor,
    canManageMembers: isOwner || isManager,
    canDeleteAcademy: isOwner,
    memberStatus: member?.status
  };
};