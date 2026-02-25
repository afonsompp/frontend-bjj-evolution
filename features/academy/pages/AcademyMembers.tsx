import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Check, Shield, Trash2, Award, UserPlus 
} from 'lucide-react';

import { useAcademyPermissions } from '../hooks/useAcademyPermissions';
import { getAcademyMembers, approveMember, removeMember } from '../api/academyService';
import { MemberStatus } from '@/lib/types';
import { AcademyMember } from '../types';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GraduationModal } from '../components/GraduationModal';
import { AddMemberModal } from '../components/AddMemberModal';
import { EditRoleModal } from '../components/EditRoleModal';
import { cn } from '@/lib/utils';

export const AcademyMembers: React.FC = () => {
  const { academyId } = useParams() as { academyId: string };
  const queryClient = useQueryClient();
  
  // Hook de permissões
  const { isStaff, isOwner, role: myRole } = useAcademyPermissions(academyId);

  // Estados Locais
  const [activeTab, setActiveTab] = useState<MemberStatus>('ACTIVE');
  const [search, setSearch] = useState('');
  
  // Estados dos Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToGraduate, setMemberToGraduate] = useState<AcademyMember | null>(null);
  const [memberToEditRole, setMemberToEditRole] = useState<AcademyMember | null>(null);

  // Query de Busca
  const { data, isLoading } = useQuery({
    queryKey: ['academyMembers', academyId, activeTab, search],
    queryFn: () => getAcademyMembers(academyId, 0, search, activeTab),
  });

  // Ações
  const handleApprove = async (userId: string) => {
    if(!confirm('Aprovar a entrada deste aluno na academia?')) return;
    try {
      await approveMember(academyId, userId);
      queryClient.invalidateQueries({ queryKey: ['academyMembers'] });
      queryClient.invalidateQueries({ queryKey: ['academyStats'] }); 
    } catch(err) { 
      alert('Erro ao aprovar membro.'); 
    }
  };

  const handleRemove = async (userId: string) => {
    if(!confirm('Tem certeza que deseja remover este membro?')) return;
    try {
      await removeMember(academyId, userId);
      queryClient.invalidateQueries({ queryKey: ['academyMembers'] });
    } catch(err) { 
      alert('Erro ao remover membro.'); 
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* HEADER: Título + Botão de Adicionar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Membros</h1>
          <p className="text-zinc-400">Gerencie alunos, instrutores e solicitações de entrada.</p>
        </div>
        
        {isStaff && (
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
            <UserPlus className="w-4 h-4 mr-2" /> Adicionar Aluno
          </Button>
        )}
      </div>

      {/* CONTROLES: Abas e Busca */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-zinc-800 pb-1">
         <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('ACTIVE')}
              className={cn(
                "pb-3 text-sm font-medium transition-all border-b-2",
                activeTab === 'ACTIVE' 
                  ? "text-primary border-primary" 
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              )}
            >
              Alunos Ativos
            </button>
            <button 
              onClick={() => setActiveTab('PENDING')}
              className={cn(
                "pb-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2",
                activeTab === 'PENDING'
                  ? "text-primary border-primary" 
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              )}
            >
              Solicitações
            </button>
         </div>

         <div className="relative w-full md:w-64 pb-2 md:pb-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
               placeholder="Buscar por nome..." 
               className="pl-9 bg-zinc-900/50"
               value={search}
               onChange={e => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* LISTA DE MEMBROS */}
      {isLoading ? (
        <div className="p-8 text-center text-zinc-500 animate-pulse">Carregando lista...</div>
      ) : (
        <div className="grid gap-3">
           {data?.content.length === 0 && (
             <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
               {activeTab === 'ACTIVE' 
                 ? "Nenhum membro ativo encontrado." 
                 : "Nenhuma solicitação pendente."}
             </div>
           )}

           {data?.content.map((member) => (
             <div key={member.user.id} className="bg-surface border border-zinc-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-zinc-700 transition-all">
                
                {/* Info do Membro */}
                <div className="flex items-center gap-4 w-full">
                   <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 uppercase">
                      {member.user.name ? member.user.name.charAt(0) : '?'}
                   </div>
                   <div>
                      <h4 className="font-medium text-white">
                        {member.user.name} {member.user.secondName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded uppercase font-bold tracking-wider text-[10px]",
                          member.role === 'OWNER' ? 'bg-purple-500/10 text-purple-400' :
                          member.role === 'INSTRUCTOR' ? 'bg-blue-500/10 text-blue-400' : 
                          'bg-zinc-800 text-zinc-400'
                        )}>
                          {member.role === 'STUDENT' ? 'ALUNO' : member.role}
                        </span>
                        
                        {/* Exibe faixa apenas se for ativo */}
                        {activeTab === 'ACTIVE' && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                              {/* CORREÇÃO AQUI: Verificação de nulidade com fallback */}
                              {(member.belt || 'WHITE').replace('_', ' ')}
                            </span>
                            <span className="hidden md:inline">•</span>
                            <span>{member.stripe || 0} Graus</span>
                          </>
                        )}

                        {/* Nickname (se tiver implementado no backend) */}
                        {/* @ts-ignore - Caso o tipo ainda não esteja atualizado no frontend */}
                        {member.user.nickname && (
                           // @ts-ignore
                          <span className="text-zinc-600">@{member.user.nickname}</span>
                        )}
                      </div>
                   </div>
                </div>

                {/* Botões de Ação */}
                {isStaff && (
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0 mt-2 md:mt-0">
                    
                    {/* --- Ações para PENDENTES --- */}
                    {activeTab === 'PENDING' && (
                       <Button 
                         className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto" 
                         onClick={() => handleApprove(member.user.id.toString())}
                       >
                          <Check className="w-4 h-4 mr-1" /> Aprovar
                       </Button>
                    )}

                    {/* --- Ações para ATIVOS --- */}
                    {activeTab === 'ACTIVE' && (
                      <>
                        {/* Graduar (Instrutores e Donos) */}
                        <Button 
                          variant="ghost" 
                          className="text-primary hover:text-white hover:bg-primary/20"
                          onClick={() => setMemberToGraduate(member)}
                          title="Graduar Aluno"
                        >
                          <Award className="w-4 h-4 mr-1 md:mr-0" /> 
                          <span className="md:hidden">Graduar</span>
                        </Button>

                        {/* Alterar Cargo (Apenas Dono) */}
                        {isOwner && member.role !== 'OWNER' && (
                          <Button 
                             variant="ghost" 
                             className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                             onClick={() => setMemberToEditRole(member)}
                             title="Alterar Cargo"
                          >
                             <Shield className="w-4 h-4 mr-1 md:mr-0" />
                             <span className="md:hidden">Cargo</span>
                          </Button>
                        )}
                      </>
                    )}

                    {/* Remover (Dono ou Manager) */}
                    {(myRole === 'OWNER' || myRole === 'MANAGER') && member.role !== 'OWNER' && (
                       <Button 
                         variant="ghost" 
                         className="text-zinc-600 hover:text-red-400 hover:bg-red-950/20"
                         onClick={() => handleRemove(member.user.id.toString())}
                         title="Remover"
                       >
                         <Trash2 className="w-4 h-4 mr-1 md:mr-0" />
                         <span className="md:hidden">Remover</span>
                       </Button>
                    )}
                  </div>
                )}
             </div>
           ))}
        </div>
      )}

      {/* --- MODAIS --- */}
      
      {/* 1. Modal de Adicionar Manualmente */}
      <AddMemberModal 
         isOpen={isAddModalOpen}
         onClose={() => setIsAddModalOpen(false)}
         onSuccess={() => queryClient.invalidateQueries({ queryKey: ['academyMembers'] })}
         academyId={academyId}
      />

      {/* 2. Modal de Graduação */}
      {memberToGraduate && (
        <GraduationModal 
           isOpen={true}
           member={memberToGraduate}
           academyId={academyId}
           onClose={() => setMemberToGraduate(null)}
           onSuccess={() => {
             queryClient.invalidateQueries({ queryKey: ['academyMembers'] });
           }}
        />
      )}

      {/* 3. Modal de Editar Cargo */}
      {memberToEditRole && (
          <EditRoleModal
             isOpen={true}
             member={memberToEditRole}
             academyId={academyId}
             onClose={() => setMemberToEditRole(null)}
             onSuccess={() => queryClient.invalidateQueries({ queryKey: ['academyMembers'] })}
          />
      )}
    </div>
  );
};