import React, { useState, useMemo } from 'react';
import { Search, Check, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { Technique, TechniqueType } from '../../types';

interface TechniqueSelectorProps {
  techniques: Technique[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({ 
  techniques, 
  selectedIds, 
  onToggle 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TechniqueType | 'ALL'>('ALL');

  const filteredTechniques = useMemo(() => {
    return techniques.filter((t) => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.alternativeName && t.alternativeName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = activeFilter === 'ALL' || t.type === activeFilter;

      return matchesSearch && matchesType;
    });
  }, [techniques, searchTerm, activeFilter]);

  const filters: { label: string; value: TechniqueType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Submissions', value: 'SUBMISSION' },
    { label: 'Sweeps', value: 'SWEEP' },
    { label: 'Passes', value: 'GUARD_PASS' },
    { label: 'Takedowns', value: 'TAKEDOWN' },
    { label: 'Escapes', value: 'SCAPE' },
    { label: 'Positions', value: 'POSITION' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" /> Select Techniques
        </h3>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
          {selectedIds.length} selected
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <input 
          type="text"
          placeholder="Search technique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setActiveFilter(f.value)}
            className={clsx(
              "whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors border",
              activeFilter === f.value
                ? "bg-primary text-white border-primary"
                : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="h-[200px] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start border border-zinc-800 rounded-md p-2 bg-zinc-900/30">
        {filteredTechniques.length === 0 ? (
          <div className="col-span-full text-center py-8 text-zinc-500 text-xs">No techniques found.</div>
        ) : (
          filteredTechniques.map((tech) => {
            const isSelected = selectedIds.includes(tech.id);
            return (
              <div 
                key={tech.id}
                onClick={() => onToggle(tech.id)}
                className={clsx(
                  "cursor-pointer flex items-center justify-between px-3 py-2 rounded-md border text-sm transition-all select-none group",
                  isSelected 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                )}
              >
                <div className="flex flex-col">
                    <span className="font-medium">{tech.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{tech.type}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};