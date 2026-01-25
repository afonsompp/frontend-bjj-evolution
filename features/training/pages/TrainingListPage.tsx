import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';

// Hooks & Types
import { useTrainingsList } from '../hooks/useTrainingQueries';
import { useDeleteTraining } from '../hooks/useTrainingMutations';
import { EmptyState } from '../components/EmptyState';
import { TrainingCard } from '../components/TrainingCard';
import { TrainingResponse } from '../types';

export const TrainingListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Hook de Data Fetching (já configurado com keepPreviousData)
  const { data, isLoading, isError } = useTrainingsList(page);
  
  // Hook de Mutação
  const deleteMutation = useDeleteTraining();

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      deleteMutation.mutate(id);
    }
  };

  // --- Estados de Carregamento e Erro ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
        <p>Carregando seu histórico...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-center bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        Erro ao carregar os treinos. Tente recarregar a página.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Diário de Treino</h1>
          <p className="text-zinc-400 mt-1">Seu histórico de evolução no tatame.</p>
        </div>
        <Link to="/trainings/new">
          <Button className="shadow-lg shadow-primary/10">
            <Plus className="w-5 h-5 mr-2" /> Novo Treino
          </Button>
        </Link>
      </div>

      {/* LISTA DE CARDS */}
      <div className="grid gap-4">
        {data.content.length === 0 ? (
           <EmptyState />
        ) : (
          data.content.map((training: TrainingResponse) => (
            <TrainingCard 
              key={training.id} 
              training={training} 
              isExpanded={expandedId === training.id}
              onToggle={() => setExpandedId(expandedId === training.id ? null : training.id)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* PAGINAÇÃO (Só exibe se houver dados) */}
      {data.totalElements > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
          <Button 
            variant="ghost" 
            disabled={page === 0} 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="text-zinc-400 hover:text-white"
          >
             <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
          
          <span className="text-sm font-medium text-zinc-500">
            Página <span className="text-white">{data.number + 1}</span> de {data.totalPages}
          </span>
          
          <Button 
            variant="ghost" 
            disabled={page + 1 >= data.totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="text-zinc-400 hover:text-white"
          >
             Próxima <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};