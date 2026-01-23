import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TrainingResponse, Technique } from '../training/types';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { 
  Plus, Trophy, Clock, Activity, Medal, 
  ArrowUpRight, ArrowDownRight, Minus, 
  ShieldAlert, Swords, Footprints, RotateCw, 
  DoorOpen, Crosshair, Skull
} from 'lucide-react';

/* =========================
   1. Helpers & Calculators
========================= */

const PERIOD_OPTIONS = [7, 14, 30, 45, 60, 90, 180, 365];
const DAY_MS = 24 * 60 * 60 * 1000;

const formatNumber = (num: number) => 
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(num);

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

const toLocalDateTimeParam = (date: Date) => date.toISOString().slice(0, 19);

const fetchTrainings = async (start: Date, end: Date): Promise<TrainingResponse[]> => {
  const { data } = await api.get('/trainings', {
    params: {
      startDate: toLocalDateTimeParam(start),
      endDate: toLocalDateTimeParam(end),
      sort: 'sessionDate,desc',
      size: 300,
    },
  });
  return data.content ?? [];
};

// --- ESTATÍSTICAS GERAIS ---
const calculateStats = (trainings: TrainingResponse[]) => {
  const stats = trainings.reduce(
    (acc, curr) => ({
      totalSessions: acc.totalSessions + 1,
      totalHours: acc.totalHours + curr.durationMinutes / 60,
      totalRounds: acc.totalRounds + (curr.totalRounds || 0),
      totalSubs: acc.totalSubs + (curr.submissions || 0),
      totalTaps: acc.totalTaps + (curr.taps || 0),
      totalSweeps: acc.totalSweeps + (curr.sweeps || 0),
      totalTakedowns: acc.totalTakedowns + (curr.takedowns || 0),
      totalPasses: acc.totalPasses + (curr.guardPasses || 0),
      totalEscapes: acc.totalEscapes + (curr.escapes || 0),
    }),
    { 
      totalSessions: 0, totalHours: 0, totalRounds: 0,
      totalSubs: 0, totalTaps: 0, totalSweeps: 0,
      totalTakedowns: 0, totalPasses: 0, totalEscapes: 0
    }
  );

  const avgDuration = stats.totalSessions > 0 ? (stats.totalHours * 60) / stats.totalSessions : 0;
  const subRate = stats.totalRounds > 0 ? (stats.totalSubs / stats.totalRounds) : 0;
  const defenseIndex = stats.totalTaps > 0 ? (stats.totalEscapes / stats.totalTaps) : stats.totalEscapes;

  return { ...stats, avgDuration, subRate, defenseIndex };
};

// --- TOP TÉCNICAS (TOP 3) ---
interface TopTechnique {
    name: string;
    count: number;
    percentage: number;
}

const calculateTopTechniques = (trainings: TrainingResponse[], field: 'submissionTechniques' | 'submissionTechniquesAllowed'): TopTechnique[] => {
    const counts: Record<string, number> = {};
    let maxCount = 0;

    trainings.forEach(t => {
        const list = t[field];
        if (list && Array.isArray(list)) {
            list.forEach((tech: Technique) => {
                if (tech?.name) {
                    const newCount = (counts[tech.name] || 0) + 1;
                    counts[tech.name] = newCount;
                    if (newCount > maxCount) maxCount = newCount;
                }
            });
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({ 
            name, 
            count, 
            percentage: maxCount > 0 ? (count / maxCount) * 100 : 0 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // TOP 3
};

/* =========================
   2. Subcomponents
========================= */

const StatCard = ({ icon, label, value, currentVal, prevVal, inverseLogic = false, suffix }: any) => {
    const diff = currentVal - prevVal;
    let trendColor = 'text-zinc-500';
    let TrendIcon = Minus;
  
    if (diff > 0) {
      trendColor = inverseLogic ? 'text-rose-400' : 'text-emerald-400';
      TrendIcon = ArrowUpRight;
    } else if (diff < 0) {
      trendColor = inverseLogic ? 'text-emerald-400' : 'text-rose-400';
      TrendIcon = ArrowDownRight;
    }
  
    return (
      <div className="bg-surface p-5 rounded-xl border border-zinc-800 flex flex-col justify-between h-full shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-text-muted">{label}</span>
          <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-100">{icon}</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value} <span className="text-sm font-normal text-zinc-500">{suffix}</span></h3>
          {diff !== 0 ? (
             <div className={`inline-flex items-center text-xs font-medium mt-1 ${trendColor}`}>
               <TrendIcon className="w-3 h-3 mr-1" />
               {diff > 0 ? '+' : ''}{formatNumber(diff)}
             </div>
          ) : <span className="text-xs text-zinc-600 mt-1 block">Sem alteração</span>}
        </div>
      </div>
    );
};

const TechStatRow = ({ label, value, prevValue, icon: Icon, colorClass }: any) => {
    const diff = value - prevValue;
    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-sm font-medium text-zinc-300">{label}</span>
            </div>
            <div className="text-right">
                <div className="font-bold text-white text-lg">{value}</div>
                {diff !== 0 && (
                    <div className={`text-xs ${diff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {diff > 0 ? '+' : ''}{diff}
                    </div>
                )}
            </div>
        </div>
    );
};

const TechniqueList = ({ title, techniques, colorBar, emptyMessage, icon: Icon }: any) => (
    <div className="bg-surface rounded-xl border border-zinc-800 p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
            <Icon className={`w-5 h-5 ${colorBar.replace('bg-', 'text-')}`} />
            <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        
        <div className="space-y-5 flex-1">
            {techniques.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic py-4 border-2 border-dashed border-zinc-800 rounded-lg">
                    {emptyMessage}
                </div>
            ) : (
                techniques.map((tech: TopTechnique, index: number) => (
                    <div key={tech.name} className="group">
                        <div className="flex justify-between text-sm mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-zinc-500 w-4">#{index + 1}</span>
                                <span className="text-zinc-200 font-medium group-hover:text-white transition-colors">{tech.name}</span>
                            </div>
                            <span className="text-zinc-400 font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{tech.count}x</span>
                        </div>
                        {/* Barra de Fundo */}
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            {/* Barra de Progresso */}
                            <div 
                                className={`h-full rounded-full ${colorBar} opacity-80 group-hover:opacity-100 transition-all duration-500`} 
                                style={{ width: `${tech.percentage}%` }} 
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

/* =========================
   3. Main Dashboard
========================= */

export const Dashboard: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const { current, previous } = useMemo(() => buildPeriods(days), [days]);

  // Queries
  const { data: currentTrainings = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'current', days],
    queryFn: () => fetchTrainings(current.start, current.end),
  });
  
  const { data: previousTrainings = [] } = useQuery({
    queryKey: ['dashboard', 'previous', days],
    queryFn: () => fetchTrainings(previous.start, previous.end),
  });

  // Calculos Stats
  const currentStats = useMemo(() => calculateStats(currentTrainings), [currentTrainings]);
  const previousStats = useMemo(() => calculateStats(previousTrainings), [previousTrainings]);

  // Calculos Top 3 (Ataque vs Defesa)
  const topAttacks = useMemo(() => calculateTopTechniques(currentTrainings, 'submissionTechniques'), [currentTrainings]);
  const topDefenses = useMemo(() => calculateTopTechniques(currentTrainings, 'submissionTechniquesAllowed'), [currentTrainings]);

  if (isLoading) return <div className="p-8 text-zinc-400 animate-pulse">Carregando métricas...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Performance</h1>
            <p className="text-zinc-400 mt-1">Visão geral dos últimos {days} dias</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
            <select 
                value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="bg-surface border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-colors cursor-pointer w-full md:w-auto"
            >
                {PERIOD_OPTIONS.map(d => <option key={d} value={d}>Últimos {d} dias</option>)}
            </select>
            <Link to="/trainings/new">
                <Button className="whitespace-nowrap shadow-lg shadow-primary/10"><Plus className="w-4 h-4 mr-2" /> Novo Treino</Button>
            </Link>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* 1. VOLUME E EFICIÊNCIA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <StatCard icon={<Activity className="w-5 h-5 text-blue-400" />} label="Sessões" value={currentStats.totalSessions} currentVal={currentStats.totalSessions} prevVal={previousStats.totalSessions} />
             <StatCard icon={<Clock className="w-5 h-5 text-orange-400" />} label="Horas de Tatame" value={currentStats.totalHours.toFixed(1)} suffix="h" currentVal={currentStats.totalHours} prevVal={previousStats.totalHours} />
             <StatCard icon={<Crosshair className="w-5 h-5 text-indigo-400" />} label="Sub Rate" value={currentStats.subRate.toFixed(2)} suffix="/roll" currentVal={currentStats.subRate} prevVal={previousStats.subRate} />
             <StatCard icon={<ShieldAlert className="w-5 h-5 text-emerald-400" />} label="Índice de Defesa" value={currentStats.defenseIndex.toFixed(1)} suffix="esc/tap" currentVal={currentStats.defenseIndex} prevVal={previousStats.defenseIndex} />
        </div>

        {/* 2. RAIO-X DE FINALIZAÇÕES (Top 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TechniqueList 
                title="Top 3 Ataques" 
                techniques={topAttacks} 
                icon={Swords}
                colorBar="bg-emerald-500"
                emptyMessage="Nenhuma finalização registrada. Hora de afiar o ataque!"
            />

            <TechniqueList 
                title="Top 3 Defesas (Pontos de Atenção)" 
                techniques={topDefenses} 
                icon={Skull}
                colorBar="bg-rose-500"
                emptyMessage="Nenhuma finalização sofrida. Defesa impenetrável!"
            />
        </div>

        {/* 3. CONSOLIDADO DE COMBATE (Unificado e Compacto) */}
        <div className="bg-surface rounded-xl border border-zinc-800 p-6">
            <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <Footprints className="w-5 h-5 text-zinc-400" /> Consolidado de Combate
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Finalizações (Compactas) */}
                <TechStatRow 
                    label="Finalizações Feitas" 
                    value={currentStats.totalSubs} 
                    prevValue={previousStats.totalSubs} 
                    icon={Trophy} 
                    colorClass="text-yellow-400 bg-yellow-400" 
                />
                <TechStatRow 
                    label="Finalizações Sofridas" 
                    value={currentStats.totalTaps} 
                    prevValue={previousStats.totalTaps} 
                    icon={Medal} 
                    colorClass="text-rose-500 bg-rose-500" 
                />

                {/* Pontuação Técnica */}
                <TechStatRow 
                    label="Quedas (Takedowns)" 
                    value={currentStats.totalTakedowns} 
                    prevValue={previousStats.totalTakedowns} 
                    icon={Footprints} 
                    colorClass="text-blue-400 bg-blue-400" 
                />
                <TechStatRow 
                    label="Passagens de Guarda" 
                    value={currentStats.totalPasses} 
                    prevValue={previousStats.totalPasses} 
                    icon={ArrowUpRight} 
                    colorClass="text-green-400 bg-green-400" 
                />
                <TechStatRow 
                    label="Raspagens (Sweeps)" 
                    value={currentStats.totalSweeps} 
                    prevValue={previousStats.totalSweeps} 
                    icon={RotateCw} 
                    colorClass="text-orange-400 bg-orange-400" 
                />
                <TechStatRow 
                    label="Escapes / Reposições" 
                    value={currentStats.totalEscapes} 
                    prevValue={previousStats.totalEscapes} 
                    icon={DoorOpen} 
                    colorClass="text-zinc-400 bg-zinc-400" 
                />
            </div>
        </div>

      </div>
    </div>
  );
};