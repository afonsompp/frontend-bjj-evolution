import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Users, ChevronRight, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { searchAcademies } from '../api/academyService';
import { useDebounce } from '@/features/training/hooks/useDebounce';

export const AcademySearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['academySearch', debouncedSearch],
    queryFn: () => searchAcademies(debouncedSearch),
    enabled: debouncedSearch.length > 0, // Só busca se tiver digitado algo (ou remova para listar todas de inicio)
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Encontre sua <span className="text-primary">Evolução</span>
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Busque por academias de Jiu-Jitsu parceiras, solicite sua entrada e comece a rastrear seus treinos.
        </p>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-zinc-500" />
          )}
        </div>
        <input 
          type="text"
          placeholder="Digite o nome da academia..."
          className="w-full bg-surface border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl shadow-black/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* RESULTADOS */}
      <div className="grid gap-4 pt-4">
        {/* Estado Inicial (Vazio) */}
        {!searchTerm && (
          <div className="text-center text-zinc-600 py-12">
            Digite o nome da academia acima para começar.
          </div>
        )}

        {/* Sem Resultados */}
        {searchTerm && !isLoading && data?.content.length === 0 && (
          <div className="text-center text-zinc-500 py-12 border border-dashed border-zinc-800 rounded-xl">
            Nenhuma academia encontrada com o nome "{searchTerm}".
          </div>
        )}

        {/* Lista de Cards */}
        {data?.content.map((academy) => (
          <div 
            key={academy.id}
            onClick={() => navigate(`/academies/${academy.id}`)}
            className="group bg-surface border border-zinc-800 p-5 rounded-xl hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 font-bold text-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {academy.name.charAt(0)}
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {academy.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{academy.address || 'Sem endereço'}</span>
                  </div>
                  {/* Se o backend retornasse contagem de membros, usariamos aqui */}
                  {/* <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>42 alunos</span>
                  </div> */}
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};