import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TopTechnique } from '../lib/dashboard.utils';

interface TechniqueListProps {
    title: string;
    techniques: TopTechnique[];
    icon: LucideIcon;
    colorBar: string; 
    emptyMessage: string;
}

export const TechniqueList: React.FC<TechniqueListProps> = ({ 
    title, techniques, colorBar, emptyMessage, icon: Icon 
}) => (
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
                techniques.map((tech, index) => (
                    <div key={tech.name} className="group">
                        <div className="flex justify-between text-sm mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-zinc-500 w-4">#{index + 1}</span>
                                <span className="text-zinc-200 font-medium group-hover:text-white transition-colors">{tech.name}</span>
                            </div>
                            <span className="text-zinc-400 font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{tech.count}x</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
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