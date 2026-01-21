import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TrainingResponse } from '../../types';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Trophy, 
  Clock, 
  Activity, 
  Medal, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus 
} from 'lucide-react';

/* =========================
   Helpers & Types
========================= */

const PERIOD_OPTIONS = [7, 14, 30, 45, 60, 90];
const DAY_MS = 24 * 60 * 60 * 1000;

const formatNumber = (num: number) => 
  new Intl.NumberFormat('pt-BR').format(num);

const buildPeriods = (days: number) => {
  const now = new Date();
  const currentStart = new Date(now.getTime() - days * DAY_MS);
  const previousEnd = new Date(currentStart.getTime());
  const previousStart = new Date(previousEnd.getTime() - days * DAY_MS);

  return {
    current: { start: currentStart, end: now },
    previous: { start: previousStart, end: previousEnd },
  };
};

const toLocalDateTimeParam = (date: Date) =>
  date.toISOString().slice(0, 19);

const fetchTrainings = async (start: Date, end: Date): Promise<TrainingResponse[]> => {
  const { data } = await api.get('/trainings', {
    params: {
      startDate: toLocalDateTimeParam(start),
      endDate: toLocalDateTimeParam(end),
      sort: 'sessionDate,desc',
      size: 200,
    },
  });
  return data.content ?? [];
};

const calculateStats = (trainings: TrainingResponse[]) => {
  return trainings.reduce(
    (acc, curr) => ({
      totalSessions: acc.totalSessions + 1,
      totalHours: acc.totalHours + curr.durationMinutes / 60,
      totalSubs: acc.totalSubs + curr.submissions,
      totalTaps: acc.totalTaps + curr.taps,
    }),
    { totalSessions: 0, totalHours: 0, totalSubs: 0, totalTaps: 0 }
  );
};

/* =========================
   Subcomponents
========================= */

// Skeleton para loading suave
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-surface rounded-xl border border-zinc-800 p-6 h-32 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-8 w-8 bg-zinc-800 rounded" />
        </div>
        <div className="h-8 w-16 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-32 bg-zinc-800 rounded" />
      </div>
    ))}
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  currentVal: number;
  prevVal: number;
  inverseLogic?: boolean; // Se true, "aumentar" é ruim (ex: Taps)
}

const StatCard = ({ icon, label, value, currentVal, prevVal, inverseLogic = false }: StatCardProps) => {
  const diff = currentVal - prevVal;
  const percentage = prevVal > 0 ? ((diff / prevVal) * 100) : 0;
  const hasChanged = prevVal !== 0 || currentVal !== 0;

  // Lógica de Cores: 
  // Normal: Subir = Verde, Descer = Vermelho.
  // Inversa (Taps): Subir = Vermelho, Descer = Verde.
  let trendColor = 'text-zinc-400 bg-zinc-400/10';
  let TrendIcon = Minus;

  if (diff > 0) {
    trendColor = inverseLogic ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10';
    TrendIcon = ArrowUpRight;
  } else if (diff < 0) {
    trendColor = inverseLogic ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10';
    TrendIcon = ArrowDownRight;
  }

  return (
    <div className="bg-surface p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between h-full shadow-sm">
      {/* Topo: Label e Icone */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-100">
          {icon}
        </div>
      </div>

      {/* Meio: Valor Principal */}
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
        
        {/* Rodapé: Variação */}
        {hasChanged ? (
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${trendColor}`}>
            <TrendIcon className="w-3 h-3 mr-1" />
            <span>
              {diff > 0 ? '+' : ''}{formatNumber(diff)} ({Math.abs(percentage).toFixed(0)}%)
            </span>
            <span className="ml-1 opacity-60"> vs anterior</span>
          </div>
        ) : (
          <span className="text-xs text-zinc-500">Sem dados suficientes</span>
        )}
      </div>
    </div>
  );
};

/* =========================
   Main Component
========================= */

export const Dashboard: React.FC = () => {
  const [days, setDays] = useState<number>(7);

  const { current, previous } = useMemo(() => buildPeriods(days), [days]);

  // Queries
  const { data: currentTrainings = [], isLoading: isLoadingCurr } = useQuery({
    queryKey: ['dashboard', 'current', days],
    queryFn: () => fetchTrainings(current.start, current.end),
  });

  const { data: previousTrainings = [], isLoading: isLoadingPrev } = useQuery({
    queryKey: ['dashboard', 'previous', days],
    queryFn: () => fetchTrainings(previous.start, previous.end),
  });

  const isLoading = isLoadingCurr || isLoadingPrev;

  // Stats Calculations
  const currentStats = useMemo(() => calculateStats(currentTrainings), [currentTrainings]);
  const previousStats = useMemo(() => calculateStats(previousTrainings), [previousTrainings]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Visão Geral</h1>
          <p className="text-text-muted mt-1">
            Métricas de performance dos últimos {days} dias
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-surface border border-zinc-700 hover:border-zinc-600 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
          >
            {PERIOD_OPTIONS.map((d) => (
              <option key={d} value={d}>
                Últimos {d} dias
              </option>
            ))}
          </select>

          <Link to="/trainings/new">
            <Button className="whitespace-nowrap shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Novo Treino
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<Activity className="w-5 h-5 text-blue-400" />} 
            label="Sessões Totais" 
            value={currentStats.totalSessions} 
            currentVal={currentStats.totalSessions}
            prevVal={previousStats.totalSessions}
          />
          
          <StatCard 
            icon={<Clock className="w-5 h-5 text-orange-400" />} 
            label="Horas de Tatame" 
            value={`${currentStats.totalHours.toFixed(1)}h`} 
            currentVal={currentStats.totalHours}
            prevVal={previousStats.totalHours}
          />
          
          <StatCard 
            icon={<Trophy className="w-5 h-5 text-yellow-400" />} 
            label="Finalizações (Feitas)" 
            value={currentStats.totalSubs} 
            currentVal={currentStats.totalSubs}
            prevVal={previousStats.totalSubs}
          />
          
          <StatCard 
            icon={<Medal className="w-5 h-5 text-red-400" />} 
            label="Finalizações (Sofridas)" 
            value={currentStats.totalTaps} 
            currentVal={currentStats.totalTaps}
            prevVal={previousStats.totalTaps}
            inverseLogic={true} // Aqui inverte: se aumentar, fica vermelho (ruim)
          />
        </div>
      )}
    </div>
  );
};