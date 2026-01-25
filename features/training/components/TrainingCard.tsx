import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, AlertCircle, Calendar, Pencil, Trash2, 
  ChevronDown, BookOpen, Zap, HeartPulse 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate, cn } from '@/lib/utils';
import { TrainingResponse } from '@/types'; // Adjust import path as needed

// --- SUBCOMPONENTES VISUAIS ---

// 1. Box de Estatística
interface StatBoxProps {
  label: string;
  value: number;
  subLabel?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, subLabel }) => (
  <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg py-4 px-2 flex flex-col items-center justify-center min-h-[80px]">
    <span className="text-2xl font-bold text-white leading-none mb-1">{value}</span>
    <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
      {label} {subLabel && <span className="text-zinc-600">({subLabel})</span>}
    </span>
  </div>
);

// 2. Barra de Progresso
interface StatusBarProps {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass?: string;
  barColor: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ label, value, icon: Icon, barColor }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-1.5">
      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wide">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <span className="text-xs text-zinc-500 font-mono">{value}/5</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all duration-500", barColor)} 
        style={{ width: `${(value / 5) * 100}%` }} 
      />
    </div>
  </div>
);

// 3. Badge de Técnica
interface TechPillProps {
  name: string;
  type: 'attack' | 'defense';
}

const TechPill: React.FC<TechPillProps> = ({ name, type }) => {
  const styles = type === 'attack' 
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : "border-red-500/30 bg-red-500/10 text-red-400";

  return (
    <span className={cn("text-xs px-2.5 py-1 rounded border font-medium truncate max-w-full", styles)}>
      {name}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---

interface TrainingCardProps {
  training: TrainingResponse;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: number) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ training, isExpanded, onToggle, onDelete }) => {
  const classTypeLabel = training.classType.replace('_', ' ');
  const trainingTypeLabel = training.trainingType === 'GI' ? 'De Kimono' : 'Sem Kimono';
  
  return (
    <div className={cn(
      'overflow-hidden border rounded-xl transition-all duration-300',
      isExpanded 
        ? 'border-zinc-700 bg-zinc-900 shadow-xl' 
        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
    )}>
      
      {/* HEADER */}
      <div className="p-5 flex justify-between items-start cursor-pointer group" onClick={onToggle}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-blue-600/10 text-blue-400 border-blue-600/20 tracking-wider">
              {classTypeLabel}
            </span>
            <h3 className="font-bold text-lg text-white tracking-tight">
              {trainingTypeLabel}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-300 font-medium">{formatDate(training.sessionDate)}</span>
            </div>

            {training.submissions > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs font-bold uppercase">
                <Trophy className="w-3 h-3" />
                {training.submissions} Finalizou
              </div>
            )}
            
            {training.taps > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-bold uppercase">
                <AlertCircle className="w-3 h-3" />
                {training.taps} Bateu
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <Link to={`/trainings/${training.id}`}>
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className=" text-red-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            onClick={() => onDelete(training.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <div className="ml-2 pl-2 border-l border-zinc-800">
             <ChevronDown className={cn('w-5 h-5 text-zinc-500 transition-transform duration-300', isExpanded && 'rotate-180')} />
          </div>
        </div>
      </div>

      {/* ÁREA EXPANDIDA */}
      {isExpanded && (
        <div className="border-t border-zinc-800/50 bg-zinc-950/30 p-6 animate-in slide-in-from-top-2 duration-300">
           
           {/* Técnicas */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500 tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    Posição / Técnica do Dia
                 </div>
                 <div className="min-h-[30px]">
                    {training.technique && training.technique.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                          {training.technique.map(t => (
                             <span key={t.id} className="text-zinc-300 text-sm font-medium">{t.name}</span>
                          ))}
                       </div>
                    ) : <span className="text-zinc-600 text-sm italic">Nenhuma registrada</span>}
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-500 tracking-wider">
                    <Trophy className="w-3.5 h-3.5" />
                    Ataques (Finalizei)
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {training.submissionTechniques && training.submissionTechniques.length > 0 
                       ? training.submissionTechniques.map(t => <TechPill key={t.id} name={t.name} type="attack" />)
                       : <span className="text-zinc-700 text-xs italic">---</span>
                    }
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-semibold uppercase text-red-500 tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Defesas (Bati)
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {training.submissionTechniquesAllowed && training.submissionTechniquesAllowed.length > 0 
                       ? training.submissionTechniquesAllowed.map(t => <TechPill key={t.id} name={t.name} type="defense" />)
                       : <span className="text-zinc-700 text-xs italic">---</span>
                    }
                 </div>
              </div>
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              <StatBox label="Rounds" value={training.totalRounds} />
              <StatBox label="Rolas" value={training.totalRolls} />
              <StatBox label="Bateu" subLabel="Qtd" value={training.taps} />
              <StatBox label="Finalizou" subLabel="Qtd" value={training.submissions} />
              <StatBox label="Raspagens" value={training.sweeps} />
              <StatBox label="Passagens" value={training.guardPasses} />
           </div>

           {/* Barras de Rodapé */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-800/50">
              <StatusBar 
                 icon={Zap} 
                 label="Intensidade" 
                 value={training.intensityRating} 
                 barColor="bg-yellow-500" 
              />
              <StatusBar 
                 icon={HeartPulse} 
                 label="Gás / Cardio" 
                 value={training.cardioRating} 
                 barColor="bg-red-500" 
              />
           </div>

        </div>
      )}
    </div>
  );
};