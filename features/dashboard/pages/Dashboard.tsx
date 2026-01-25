import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Swords, Skull } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Hooks e Utils
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { PERIOD_OPTIONS } from '../lib/dashboard.utils';

// Componentes da Feature (Agora bem organizados)
import { KeyMetricsGrid } from '../components/KeyMetricsGrid'; // <--- Novo
import { TechniqueList } from '../components/TechniqueList';
import { CombatStatsGrid } from '../components/CombatStatsGrid';

export const Dashboard: React.FC = () => {
  const { 
    days, setDays, 
    isLoading, 
    stats, topAttacks, topDefenses 
  } = useDashboardMetrics();

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
                value={days} 
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-surface border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary cursor-pointer w-full md:w-auto"
            >
                {PERIOD_OPTIONS.map(d => <option key={d} value={d}>Últimos {d} dias</option>)}
            </select>
            <Link to="/trainings/new">
                <Button className="whitespace-nowrap shadow-lg shadow-primary/10">
                    <Plus className="w-4 h-4 mr-2" /> Novo Treino
                </Button>
            </Link>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* 1. KPIs Principais */}
        <KeyMetricsGrid 
            current={stats.current} 
            previous={stats.previous} 
        />

        {/* 2. Top Técnicas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TechniqueList 
                title="Top 3 Ataques" 
                techniques={topAttacks} 
                icon={Swords}
                colorBar="bg-emerald-500"
                emptyMessage="Nenhuma finalização registrada."
            />
            <TechniqueList 
                title="Top 3 Finalizações sofridas" 
                techniques={topDefenses} 
                icon={Skull}
                colorBar="bg-rose-500"
                emptyMessage="Defesa impenetrável!"
            />
        </div>

        {/* 3. Consolidado */}
        <CombatStatsGrid current={stats.current} previous={stats.previous} />

      </div>
    </div>
  );
};