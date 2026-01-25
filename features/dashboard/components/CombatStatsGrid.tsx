import React from 'react';
import { Trophy, Medal, Footprints, ArrowUpRight, RotateCw, DoorOpen } from 'lucide-react';

interface StatRowProps {
    label: string;
    value: number;
    prevValue: number;
    icon: any;
    colorClass: string;
}

const TechStatRow: React.FC<StatRowProps> = ({ label, value, prevValue, icon: Icon, colorClass }) => {
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

export const CombatStatsGrid: React.FC<{ current: any, previous: any }> = ({ current, previous }) => {
    return (
        <div className="bg-surface rounded-xl border border-zinc-800 p-6">
            <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <Footprints className="w-5 h-5 text-zinc-400" /> Consolidado de Combate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TechStatRow label="Finalizações Feitas" value={current.totalSubs} prevValue={previous.totalSubs} icon={Trophy} colorClass="text-yellow-400 bg-yellow-400" />
                <TechStatRow label="Finalizações Sofridas" value={current.totalTaps} prevValue={previous.totalTaps} icon={Medal} colorClass="text-rose-500 bg-rose-500" />
                <TechStatRow label="Quedas (Takedowns)" value={current.totalTakedowns} prevValue={previous.totalTakedowns} icon={Footprints} colorClass="text-blue-400 bg-blue-400" />
                <TechStatRow label="Passagens de Guarda" value={current.totalPasses} prevValue={previous.totalPasses} icon={ArrowUpRight} colorClass="text-green-400 bg-green-400" />
                <TechStatRow label="Raspagens (Sweeps)" value={current.totalSweeps} prevValue={previous.totalSweeps} icon={RotateCw} colorClass="text-orange-400 bg-orange-400" />
                <TechStatRow label="Escapes / Reposições" value={current.totalEscapes} prevValue={previous.totalEscapes} icon={DoorOpen} colorClass="text-zinc-400 bg-zinc-400" />
            </div>
        </div>
    );
};