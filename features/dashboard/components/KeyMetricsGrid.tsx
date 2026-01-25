import React from 'react';
import { 
  Activity, Clock, Crosshair, ShieldAlert, HeartPulse, Zap 
} from 'lucide-react';
import { StatCard } from './StatCard';
import { cn } from '@/lib/utils';

interface KeyMetricsGridProps {
  current: any; 
  previous: any;
}

// --- NOVO COMPONENTE INTERNO: CARD COM BARRA DE PROGRESSO ---
interface ProgressCardProps {
  label: string;
  value: number; // Esperado entre 0 e 5
  icon: React.ReactNode;
  colorClass: string; // ex: 'bg-red-500'
  trend?: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ label, value, icon, colorClass, trend }) => {
  const percentage = Math.min(Math.max((value / 5) * 100, 0), 100);
  const safeValue = (value || 0).toFixed(1);

  return (
    <div className="bg-surface p-5 rounded-xl border border-zinc-800 flex flex-col justify-between h-full shadow-sm hover:border-zinc-700 transition-colors">
      
      {/* Cabeçalho igual ao StatCard */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-100">{icon}</div>
      </div>

      {/* Corpo com Barra */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
           <span className="text-2xl font-bold text-white">{safeValue} <span className="text-sm text-zinc-600 font-normal">/ 5.0</span></span>
           
           {/* Pequeno indicador de tendência (opcional) */}
           {trend !== undefined && trend !== 0 && (
             <span className={cn("text-xs font-medium", trend > 0 ? "text-emerald-400" : "text-rose-400")}>
               {trend > 0 ? '+' : ''}{trend.toFixed(1)}
             </span>
           )}
        </div>

        {/* A Barra de Progresso */}
        <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

// --- GRID PRINCIPAL ---

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ current, previous }) => {
  // Helpers
  const safeFixed = (val: number | undefined, digits: number) => (val || 0).toFixed(digits);
  const safeTrend = (curr: number | undefined, prev: number | undefined) => (curr || 0) - (prev || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Sessões */}
      <StatCard 
        icon={<Activity className="w-5 h-5 text-blue-400" />} 
        label="Sessões" 
        value={current.totalSessions || 0} 
        trend={safeTrend(current.totalSessions, previous.totalSessions)} 
      />
      
      {/* 2. Horas */}
      <StatCard 
        icon={<Clock className="w-5 h-5 text-orange-400" />} 
        label="Horas de Tatame" 
        value={safeFixed(current.totalHours, 1)} suffix="h" 
        trend={safeTrend(current.totalHours, previous.totalHours)} 
      />
      
      {/* 3. Sub Rate */}
      <StatCard 
        icon={<Crosshair className="w-5 h-5 text-indigo-400" />} 
        label="Taxa de Finalização" 
        value={safeFixed(current.subRate, 2)} suffix="/rola" 
        trend={safeTrend(current.subRate, previous.subRate)} 
      />

      {/* 4. Defesa */}
      <StatCard 
        icon={<ShieldAlert className="w-5 h-5 text-emerald-400" />} 
        label="Índice de Defesa" 
        value={safeFixed(current.defenseIndex, 1)} suffix="esc/tap" 
        trend={safeTrend(current.defenseIndex, previous.defenseIndex)} 
      />
      
      {/* 5. Cardio (USANDO PROGRESS CARD) */}
      <ProgressCard 
        icon={<HeartPulse className="w-5 h-5 text-rose-500" />} 
        label="Média Cardio" 
        value={current.avgCardio} 
        colorClass="bg-rose-500"
        trend={safeTrend(current.avgCardio, previous.avgCardio)}
      />
      
      {/* 6. Intensidade (USANDO PROGRESS CARD) */}
      <ProgressCard 
        icon={<Zap className="w-5 h-5 text-yellow-500" />} 
        label="Média Intensidade" 
        value={current.avgIntensity} 
        colorClass="bg-yellow-500"
        trend={safeTrend(current.avgIntensity, previous.avgIntensity)}
      />
    </div>
  );
};