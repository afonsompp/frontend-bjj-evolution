import { api } from '@/lib/api';
import { Page } from '@/features/training/domain/page.type';
import { Academy, AcademyMember, CreateAcademyDTO, ScheduledClass, CreateClassDTO } from '../types';

export const getMyAcademies = async (page = 0, size = 10) => {
  // Assume que o backend tem um endpoint para listar academias onde sou membro
  // Se não tiver, use o /academies com algum filtro
  const { data } = await api.get<Page<Academy>>('/academies', { params: { page, size } });
  return data;
};

export const createAcademy = async (data: CreateAcademyDTO) => {
  const { data: academy } = await api.post<Academy>('/academies', data);
  return academy;
};

export const getAcademyMembers = async (academyId: string, page = 0) => {
  const { data } = await api.get<Page<AcademyMember>>(`/academies/${academyId}/members`, {
    params: { page }
  });
  return data;
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