import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Check, Filter, Loader2, Plus, X, ChevronRight, List, Keyboard } from 'lucide-react'; // Importei Keyboard
import { clsx } from 'clsx';
import { Technique, TechniqueType } from '../../../lib/types';
import { TechniqueCreateModal } from './TechniqueCreateModal';
import { getTechniques } from '../api/trainingService';

interface TechniqueSelectorProps {
  selectedIds: number[];
  onToggle: (id: number) => void;
  themeColor?: string;
}

export const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({ 
  selectedIds, 
  onToggle,
  themeColor = "text-primary"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TechniqueType | 'ALL'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
      if (!isOpen) return;

      if (!searchTerm.trim()) {
          setTechniques([]);
          return;
      }

      setIsLoading(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const data = await getTechniques(searchTerm);
          setTechniques(data.content);
        } catch (error) {
          console.error("Erro ao buscar técnicas", error);
          setTechniques([]);
        } finally {
          setIsLoading(false);
        }
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  const handleCreateSuccess = (newTechnique: Technique) => {
    setTechniques((prev) => [newTechnique, ...prev]);
    if (!selectedIds.includes(newTechnique.id)) {
        onToggle(newTechnique.id);
    }
    setSearchTerm(''); 
  };

  const safeTechniques = Array.isArray(techniques) ? techniques : [];
  
  const filteredTechniques = safeTechniques.filter((t) => 
     activeFilter === 'ALL' || t.type === activeFilter
  );

  const selectedTechniquesPreview = safeTechniques.filter(t => selectedIds.includes(t.id));
  
  const filters: { label: string; value: TechniqueType | 'ALL' }[] = [
      { label: 'All', value: 'ALL' },
      { label: 'Finalizações', value: 'SUBMISSION' },
      { label: 'Raspagens', value: 'SWEEP' },
      { label: 'Passagens', value: 'GUARD_PASS' },
      { label: 'Quedas', value: 'TAKEDOWN' },
      { label: 'Escapes', value: 'SCAPE' },
      { label: 'Posicionamentos', value: 'POSITION' },
  ];

  // --- MODO FECHADO (RESUMO) ---
  if (!isOpen) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md bg-zinc-800 group-hover:bg-zinc-700 transition-colors ${themeColor}`}>
               <List className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-zinc-200">Selecionar Técnicas</span>
                <span className="text-xs text-zinc-500">
                    {selectedIds.length === 0 
                        ? "Toque para adicionar" 
                        : `${selectedIds.length} selecionada(s)`}
                </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
        </button>
        {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
                {selectedTechniquesPreview.map(tech => (
                    <span key={tech.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 border border-zinc-700 text-xs text-zinc-300 animate-in fade-in zoom-in duration-200">
                        {tech.name}
                        <button 
                            type="button"
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onToggle(tech.id); 
                            }}
                            className="hover:text-red-400 ml-1 p-0.5 rounded-full hover:bg-zinc-700"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                
                {/* Fallback caso tenhamos IDs selecionados que ainda não foram carregados no cache */}
                {selectedIds.length > selectedTechniquesPreview.length && (
                    <span className="text-xs text-zinc-500 py-1 px-2">
                        + {selectedIds.length - selectedTechniquesPreview.length} outros...
                    </span>
                )}
            </div>
        )}
        {/* Chips removidos ou simplificados aqui se não tiver o objeto completo */}
      </div>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full h-full md:max-w-3xl md:h-[85vh] md:rounded-xl border-x md:border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className={`w-5 h-5 ${themeColor}`} /> 
                Selecionar Técnicas
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {selectedIds.length}
                </span>
            </h3>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            
            {/* Search Bar */}
            <div className="flex gap-2 shrink-0">
                <div className="relative flex-1">
                    <div className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 flex items-center justify-center">
                        {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <Search className="h-4 w-4" />}
                    </div>
                    <input 
                        type="text"
                        placeholder="Ex: Armlock, Kimura..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-colors text-white"
                    title="Criar nova"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar shrink-0">
                {filters.map((f) => (
                <button
                    key={f.label}
                    type="button"
                    onClick={() => setActiveFilter(f.value)}
                    className={clsx(
                    "whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-colors border",
                    activeFilter === f.value
                        ? "bg-primary text-white border-primary"
                        : "bg-zinc-950 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                    )}
                >
                    {f.label}
                </button>
                
                ))}
            </div>

            {/* --- ALTERAÇÃO 2: Renderização Condicional da Lista --- */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start pb-20 md:pb-0">
                
                {!searchTerm.trim() ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center opacity-50">
                        <div className="p-4 bg-zinc-800/50 rounded-full">
                            <Keyboard className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-zinc-300 font-medium">Comece a digitar</p>
                            <p className="text-zinc-500 text-xs max-w-[200px]">
                                Digite o nome da técnica ou posição para buscar no catálogo.
                            </p>
                        </div>
                    </div>
                ) : 
                
                filteredTechniques.length === 0 && !isLoading ? (
                    <div className="col-span-full py-12 flex flex-col items-center gap-3 text-center">
                        <span className="text-zinc-500 text-sm">Nenhuma técnica encontrada.</span>
                        <button 
                            type="button" 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                            <Plus className="w-4 h-4" /> Criar "{searchTerm}"
                        </button>
                    </div>
                ) : (
                
                    filteredTechniques.map((tech) => {
                        const isSelected = selectedIds.includes(tech.id);
                        return (
                        <div 
                            key={tech.id}
                            onClick={() => onToggle(tech.id)}
                            className={clsx(
                            "cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all select-none active:scale-[0.98]",
                            isSelected 
                                ? "bg-primary/10 border-primary text-white" 
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                            )}
                        >
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-medium truncate text-base md:text-sm">{tech.name}</span>
                                <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 mt-0.5">
                                    {tech.type} 
                                    {tech.alternativeName && <span className="text-zinc-600 truncate max-w-[150px]">• {tech.alternativeName}</span>}
                                </span>
                            </div>
                            {isSelected && <Check className={`w-5 h-5 ${themeColor} shrink-0 ml-2`} />}
                        </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/95 flex justify-end shrink-0">
             <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-white text-black px-6 py-3 md:py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors w-full sm:w-auto shadow-lg"
             >
                Confirmar ({selectedIds.length})
             </button>
        </div>

        {/* Modal Create */}
        <TechniqueCreateModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
            prefilledName={searchTerm}
        />
      </div>
    </div>,
    document.body
  );
};