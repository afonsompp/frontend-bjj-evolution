import { api } from '@/lib/api';
import { Page } from '@/features/training/domain/page.type';
import { Academy, AcademyMember, CreateAcademyDTO, ScheduledClass, CreateClassDTO, GraduationRequest, AddMemberDTO } from '../types';
import { AcademyRole, MemberStatus } from '@/lib/types';

export const getMyAcademies = async (page = 0, size = 10) => {
  const { data } = await api.get<Page<Academy>>('/academies', { params: { page, size } });
  return data;
};

export const createAcademy = async (data: CreateAcademyDTO) => {
  const { data: academy } = await api.post<Academy>('/academies', data);
  return academy;
};

// [ATUALIZADO] Suporte a query e status
export const getAcademyMembers = async (
  academyId: string, 
  page = 0, 
  query = '', 
  status?: MemberStatus
) => {
  const params: any = { page, size: 20 };
  if (query) params.query = query;
  if (status) params.status = status;

  const { data } = await api.get<Page<AcademyMember>>(`/academies/${academyId}/members`, {
    params
  });
  return data;
};

// [NOVO] Solicitar entrada
export const joinAcademy = async (academyId: string) => {
  const { data } = await api.post<AcademyMember>(`/academies/${academyId}/members/join`);
  return data;
};

// [NOVO] Editar Academia
export const updateAcademy = async (academyId: string, data: { name: string; address: string; ownerId: string }) => {
  const { data: result } = await api.put<Academy>(`/academies/${academyId}`, data);
  return result;
};

// [NOVO] Adicionar Membro Manualmente

export const addMember = async (academyId: string, data: AddMemberDTO) => {
  const { data: result } = await api.post<AcademyMember>(`/academies/${academyId}/members`, data);
  return result;
};

// [NOVO] Atualizar Papel (Role)
export const updateMemberRole = async (academyId: string, userId: string, role: AcademyRole) => {
  // Backend exige o objeto AcademyMemberRequest completo, mas só usará o role no endpoint de update
  // Precisamos garantir que enviamos o userId também no corpo se o DTO exigir
  const payload = { userId, role }; 
  const { data } = await api.put<AcademyMember>(`/academies/${academyId}/members/${userId}`, payload);
  return data;
};

// [NOVO] Aprovar membro
export const approveMember = async (academyId: string, userId: string) => {
  const { data } = await api.patch<AcademyMember>(`/academies/${academyId}/members/${userId}/approve`);
  return data;
};

// [NOVO] Graduar membro
export const graduateMember = async (academyId: string, userId: string, payload: GraduationRequest) => {
  const { data } = await api.post<AcademyMember>(`/academies/${academyId}/members/${userId}/graduate`, payload);
  return data;
};

export const removeMember = async (academyId: string, userId: string) => {
  return api.delete(`/academies/${academyId}/members/${userId}`);
};

export const updateMemberStatus = async (academyId: string, userId: string, status: string) => {
    return api.put(`/academies/${academyId}/members/${userId}`, { status });
}

export const getAcademyClasses = async (academyId: string, start?: string, end?: string) => {
  const { data } = await api.get<Page<ScheduledClass>>(`/academies/${academyId}/classes`, {
    params: { start, end, size: 50 }
  });
  return data;
};

export const createAcademyClass = async (academyId: string, data: CreateClassDTO) => {
  return api.post(`/academies/${academyId}/classes`, data);
};

export const searchAcademies = async (query: string, page = 0) => {
  const { data } = await api.get<Page<Academy>>('/academies/search', {
    params: { query, page, size: 20 }
  });
  return data;
};