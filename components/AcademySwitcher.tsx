import React, { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Check, Plus, User, Building2, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMyAcademies } from '@/features/academy/api/academyService';
import { useAuth } from '@/context/AuthContext';

export const AcademySwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { academyId } = useParams(); // Pega da URL
  const { user } = useAuth(); // Pega do Contexto (precisa ter o profile carregado)
  const [isOpen, setIsOpen] = useState(false);

  // Busca as academias do usuário
  const { data, isLoading } = useQuery({
    queryKey: ['my-academies'],
    queryFn: () => getMyAcademies(0, 50),
  });

  const isPersonalMode = !academyId;
  const currentAcademy = data?.content.find(a => a.id === academyId);

  // Verifica se pode criar academia (baseado no UserRole do Profile)
  // IMPORTANTE: Você precisa garantir que o objeto 'user' do AuthContext 
  // tenha o campo 'role' atualizado ou buscar o profile separadamente.
  // Vou assumir que você tem acesso ao profile. Se não, use um hook useProfile().
  const canCreate = true; // Substitua por: profile?.role === 'ACADEMY_OWNER' || profile?.role === 'ADMIN'

  const handleSwitch = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center",
            isPersonalMode ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
          )}>
            {isPersonalMode ? <User size={16} /> : <Building2 size={16} />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white line-clamp-1">
              {isPersonalMode ? 'Minha Evolução' : (currentAcademy?.name || 'Academia')}
            </p>
            <p className="text-xs text-zinc-500">
              {isPersonalMode ? 'Conta Pessoal' : 'Gestão'}
            </p>
          </div>
        </div>
        <ChevronsUpDown size={16} className="text-zinc-500" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
            
            <div className="px-2 pb-2 border-b border-zinc-800 mb-2">
               <button onClick={() => handleSwitch('/')} className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 text-sm text-zinc-300">
                 <div className="flex items-center gap-2"><User size={14} /> Minha Evolução</div>
                 {isPersonalMode && <Check size={14} className="text-primary" />}
               </button>
            </div>

            <div className="px-2">
               <span className="text-xs font-semibold text-zinc-500 px-2">Minhas Academias</span>
               {isLoading ? (
                 <div className="p-2"><Loader2 className="w-4 h-4 animate-spin text-zinc-500"/></div>
               ) : (
                 data?.content.map(academy => (
                   <button
                     key={academy.id}
                     onClick={() => handleSwitch(`/academies/${academy.id}`)}
                     className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 text-sm text-zinc-300"
                   >
                     <div className="flex items-center gap-2"><Building2 size={14} /> {academy.name}</div>
                     {academyId === academy.id && <Check size={14} className="text-primary" />}
                   </button>
                 ))
               )}

               <NavLink 
                  onClick={() => setIsOpen(!isOpen)}
                  to="/academies/search" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  <Search size={14} />
                  Explorar Academias
                </NavLink>
               
               {canCreate && (
                 <button
                   onClick={() => handleSwitch('/academies/new')}
                   className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white mt-1"
                 >
                   <Plus size={14} /> Nova Academia
                 </button>
               )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};