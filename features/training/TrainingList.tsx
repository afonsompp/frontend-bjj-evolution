import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { TrainingResponse } from '../../types'; // Certifique-se que o tipo esteja atualizado!
import { Button } from '../../components/ui/Button';
import { formatDate, cn } from '../../lib/utils';
import {
  Plus,
  Trash2,
  Calendar,
  Trophy,
  Pencil,
  Dumbbell,
  ChevronDown,
  Zap,
  HeartPulse,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

/* =========================
   Types
========================= */

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

/* =========================
   Component
========================= */

export const TrainingList: React.FC = () => {
  const queryClient = useQueryClient();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError } = useQuery<PageResponse<TrainingResponse>>({
    queryKey: ['trainings', page],
    queryFn: async () => {
      const { data } = await api.get('/trainings', {
        params: {
          page,
          size,
          sort: 'sessionDate,desc',
        },
      });
      return data;
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/trainings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-zinc-500 animate-pulse">
        Carregando sessões...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar sessões.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Diário de Treino
          </h1>
          <p className="text-zinc-400 mt-1">
            Acompanhe seu progresso no tatame.
          </p>
        </div>

        <Link to="/trainings/new">
          <Button className="font-semibold shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" />
            Registrar Treino
          </Button>
        </Link>
      </div>

      {/* Lista */}
      <div className="grid gap-4">
        {data.content.length === 0 ? (
          <div className="text-center p-16 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center">
            <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
              <Dumbbell className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-400 text-lg">
              Nenhum treino registrado ainda.
            </p>
          </div>
        ) : (
          data.content.map(training => {
            const isExpanded = expandedId === training.id;

            return (
              <div
                key={training.id}
                className={cn(
                  'overflow-hidden border rounded-xl transition-all',
                  isExpanded
                    ? 'border-primary/50 bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900/50'
                )}
              >
                {/* CABEÇALHO DO CARD (Sempre Visível) */}
                <div
                  className="p-5 flex justify-between items-start gap-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : training.id)
                  }
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {training.classType.replace('_', ' ')}
                      </span>
                      <h3 className="font-semibold text-lg text-white">
                        {training.trainingType === 'GI' ? 'De Kimono' : 'Sem Kimono'}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(training.sessionDate)}
                      </div>
                      
                      {/* === BADGES DE SUBS E TAPS (Resumo) === */}
                      {training.submissions > 0 && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                          <Trophy className="w-3.5 h-3.5" />
                          {training.submissions} Finalizou
                        </div>
                      )}
                      
                      {training.taps > 0 && (
                        <div className="flex items-center gap-1.5 text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded-md border border-red-400/20">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {training.taps} Bateu
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div
                    className="flex items-center gap-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <Link to={`/trainings/${training.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Excluir este treino?')) {
                          deleteMutation.mutate(training.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>

                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-zinc-500 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </div>

                {/* DETALHES EXPANDIDOS */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 bg-black/20 p-5 space-y-6">
                    
                    {/* === SEÇÃO DE LISTAS DE TÉCNICAS === */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* 1. Conteúdo da Aula */}
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                            <BookOpen className="w-4 h-4" />
                            Posição / Técnica do Dia
                         </div>
                         {training.technique && training.technique.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                              {training.technique.map(tech => (
                                <span key={tech.id} className="px-2.5 py-1 text-xs rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                                  {tech.name}
                                </span>
                              ))}
                           </div>
                         ) : <span className="text-xs text-zinc-600 italic">Nenhuma registrada</span>}
                      </div>

                      {/* 2. Meus Ataques (Subs Do) */}
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                            <Trophy className="w-4 h-4" />
                            Ataques (Finalizei)
                         </div>
                         {training.submissionTechniques && training.submissionTechniques.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                              {training.submissionTechniques.map(tech => (
                                <span key={tech.id} className="px-2.5 py-1 text-xs rounded bg-emerald-950/40 border border-emerald-900 text-emerald-300">
                                  {tech.name}
                                </span>
                              ))}
                           </div>
                         ) : <span className="text-xs text-zinc-600 italic">Nenhuma registrada</span>}
                      </div>

                      {/* 3. Minhas Defesas (Allowed/Taps) */}
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            Defesas (Bati)
                         </div>
                         {training.submissionTechniquesAllowed && training.submissionTechniquesAllowed.length > 0 ? (
                           <div className="flex flex-wrap gap-2">
                              {training.submissionTechniquesAllowed.map(tech => (
                                <span key={tech.id} className="px-2.5 py-1 text-xs rounded bg-red-950/40 border border-red-900 text-red-300">
                                  {tech.name}
                                </span>
                              ))}
                           </div>
                         ) : <span className="text-xs text-zinc-600 italic">Nenhuma registrada</span>}
                      </div>

                    </div>

                    <div className="h-px bg-zinc-800 w-full" />

                    {/* Grid de Estatísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Stat label="Rounds" value={training.totalRounds} />
                      <Stat label="Rolas" value={training.totalRolls} />
                      <Stat label="Bateu (Qtd)" value={training.taps} bad />
                      <Stat label="Finalizou (Qtd)" value={training.submissions} good />
                      <Stat label="Raspagens" value={training.sweeps} />
                      <Stat label="Passagens" value={training.guardPasses} />
                    </div>

                    {/* Avaliações */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Rating
                        label="Intensidade"
                        value={training.intensityRating}
                        color="bg-yellow-500"
                        icon={<Zap className="w-3 h-3" />}
                      />
                      <Rating
                        label="Gás / Cardio"
                        value={training.cardioRating}
                        color="bg-red-500"
                        icon={<HeartPulse className="w-3 h-3" />}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="ghost"
          disabled={page === 0}
          onClick={() => setPage(p => Math.max(p - 1, 0))}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>

        <span className="text-sm text-zinc-500">
          Página {data.number + 1} de {data.totalPages}
        </span>

        <Button
          variant="ghost"
          disabled={page + 1 >= data.totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Próxima
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

/* =========================
   Subcomponentes
========================= */

const Stat = ({
  label,
  value,
  good,
  bad,
}: {
  label: string;
  value: number;
  good?: boolean;
  bad?: boolean;
}) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
    <div
      className={cn(
        'text-lg font-bold',
        good && 'text-emerald-400',
        bad && 'text-red-400',
        !good && !bad && 'text-white'
      )}
    >
      {value}
    </div>
    <div className="text-[10px] uppercase text-zinc-500">{label}</div>
  </div>
);

const Rating = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="flex items-center gap-1 text-zinc-300">
        {icon}
        {label}
      </span>
      <span className="text-zinc-500">{value}/5</span>
    </div>
    <div className="h-2 bg-zinc-800 rounded-full">
      <div
        className={cn('h-full rounded-full transition-all', color)}
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  </div>
);