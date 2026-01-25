import React from 'react';
import { Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend: number; 
  inverseLogic?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, label, value, suffix, trend, inverseLogic = false 
}) => {
  let trendColor = 'text-zinc-500';
  let TrendIcon = Minus;

  if (trend > 0) {
    trendColor = inverseLogic ? 'text-rose-400' : 'text-emerald-400';
    TrendIcon = ArrowUpRight;
  } else if (trend < 0) {
    trendColor = inverseLogic ? 'text-emerald-400' : 'text-rose-400';
    TrendIcon = ArrowDownRight;
  }

  return (
    <div className="bg-surface p-5 rounded-xl border border-zinc-800 flex flex-col justify-between h-full shadow-sm hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-100">{icon}</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value} <span className="text-sm font-normal text-zinc-500">{suffix}</span>
        </h3>
        {trend !== 0 ? (
           <div className={`inline-flex items-center text-xs font-medium mt-1 ${trendColor}`}>
             <TrendIcon className="w-3 h-3 mr-1" />
             {trend > 0 ? '+' : ''}{new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(trend)}
           </div>
        ) : <span className="text-xs text-zinc-600 mt-1 block">Sem alteração</span>}
      </div>
    </div>
  );
};