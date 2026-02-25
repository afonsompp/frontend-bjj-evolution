import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, Users, MapPin, LogIn, 
  Calendar, Trophy, Activity, Share2 
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAcademyPermissions } from '../hooks/useAcademyPermissions';
import { joinAcademy } from '../api/academyService';
import { AcademySettingsModal } from '../components/AcademySettingsModal';
import { Academy } from '../types';
import { useAuth } from '@/context/AuthContext';

// Função auxiliar para buscar academia
const getAcademyById = async (id: string) => {
  const { data } = await api.get<Academy>(`/academies/${id}`);
  return data;
};

export const AcademyDashboard: React.FC = () => {
  const { academyId } = useParams() as { academyId: string };
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Hook de permissões
  const { role, isOwner, memberStatus, isStaff } = useAcademyPermissions(academyId);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // 1. Buscar Dados da Academia
  const { data: academy, isLoading } = useQuery({
    queryKey: ['academy', academyId],
    queryFn: () => getAcademyById(academyId),
  });

  // Determina se o usuário faz parte da academia (qualquer role)
  const isMember = !!role;
  const isPending = memberStatus === 'PENDING';

  // 2. Ação de Solicitar Entrada
  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinAcademy(academyId);
      alert('Solicitação enviada com sucesso! Aguarde a aprovação.');
      // Invalida a query do hook de permissões para atualizar o status na tela
      queryClient.invalidateQueries({ queryKey: ['academyMember'] });
    } catch (error) {
      console.error(error);
      alert('Erro ao solicitar entrada. Verifique se já não fez o pedido.');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse">Carregando academia...</div>;
  }

  if (!academy) {
    return <div className="p-8 text-center text-red-500">Academia não encontrada.</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* HEADER DA ACADEMIA */}
      <div className="bg-surface border border-zinc-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
        {/* Fundo decorativo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="space-y-4 z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{academy.name}</h1>
            <div className="flex items-center text-zinc-400 gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{academy.address}</span>
            </div>
          </div>

          {/* Badges de Status do Usuário */}
          <div className="flex gap-2">
            {role && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
                {role === 'OWNER' ? 'Dono' : role}
              </span>
            )}
            {isPending && (
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-500/20">
                Pendente
              </span>
            )}
            {!isMember && !isPending && (
              <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold uppercase tracking-wider">
                Visitante
              </span>
            )}
          </div>
        </div>

        {/* AÇÕES PRINCIPAIS */}
        <div className="flex flex-col sm:flex-row gap-3 z-10">
          
          {/* Botão para Visitantes */}
          {!isMember && !isPending && (
            <Button 
              onClick={handleJoin} 
              isLoading={isJoining}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              <LogIn className="w-4 h-4 mr-2" /> 
              Solicitar Entrada
            </Button>
          )}

          {/* Botão para Pendentes */}
          {isPending && (
            <Button variant="outline" disabled className="opacity-70 cursor-not-allowed">
              Aguardando Aprovação
            </Button>
          )}

          {/* Botões para Membros Ativos */}
          {isMember && !isPending && (
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Convidar
            </Button>
          )}

          {/* Botão para Dono */}
          {isOwner && (
            <Button 
              variant="secondary" 
              onClick={() => setIsSettingsOpen(true)}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <Settings className="w-4 h-4 mr-2" /> 
              Configurações
            </Button>
          )}
        </div>
      </div>

      {/* GRID DE ATALHOS / ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card: Membros */}
        {isStaff && (<Link 
          to={`/academies/${academyId}/members`}
          className="bg-surface border border-zinc-800 p-6 rounded-xl hover:border-primary/50 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Membros</h3>
          <p className="text-sm text-zinc-400">Gerencie alunos, aprovações e graduações.</p>
        </Link>)}

        {/* Card: Grade de Aulas (Futuro) */}
        <div className="bg-surface border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all group relative opacity-75">
          <div className="absolute top-4 right-4 text-xs font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Em Breve</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Grade de Aulas</h3>
          <p className="text-sm text-zinc-400">Confira os horários e faça check-in.</p>
        </div>

        {/* Card: Rankings (Futuro) */}
        <div className="bg-surface border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all group relative opacity-75">
          <div className="absolute top-4 right-4 text-xs font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Em Breve</div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Ranking</h3>
          <p className="text-sm text-zinc-400">Veja quem são os alunos mais ativos.</p>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL (Mural) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-zinc-800 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-white">Mural da Academia</h3>
            <p className="text-zinc-500 max-w-sm mt-2">
              Nenhuma atividade recente registrada. Quando as aulas começarem, o histórico aparecerá aqui.
            </p>
          </div>
        </div>

        {/* Coluna Lateral (Infos Rápidas) */}
        <div className="space-y-6">
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Informações</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Status</span>
                <span className="text-emerald-400 font-medium">Aberta</span>
              </div>
              <div className="pt-2">
                <span className="text-zinc-400 block mb-1">Endereço</span>
                <span className="text-white">{academy.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIGURAÇÕES */}
      {isOwner && (
        <AcademySettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['academy', academyId] })}
          academy={academy}
          ownerId={user?.id || ''}
        />
      )}
    </div>
  );
};