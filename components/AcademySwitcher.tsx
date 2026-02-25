import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Adicionado useLocation
import { useQuery } from '@tanstack/react-query';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  ChevronsUpDown, Check, Plus, User, Building2, Loader2, Search 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMyAcademies } from '@/features/academy/api/academyService';

export const AcademySwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para pegar a URL atual
  const { academyId } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-academies'],
    queryFn: () => getMyAcademies(0, 50),
  });

  const isPersonalMode = !academyId;
  const currentAcademy = data?.content.find(a => String(a.id) === academyId);

  const handleSwitch = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-700 outline-none group">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors",
              isPersonalMode ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            )}>
              {isPersonalMode ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-zinc-100 line-clamp-1">
                {isPersonalMode ? 'Minha Evolução' : (currentAcademy?.name || 'Academia')}
              </p>
              <p className="text-xs text-zinc-500 font-medium">
                {isPersonalMode ? 'Conta Pessoal' : 'Gestão Administrativa'}
              </p>
            </div>
          </div>
          <ChevronsUpDown size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align="start" 
          sideOffset={10} 
          className="w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Seção Pessoal */}
          <DropdownMenu.Item 
            onClick={() => handleSwitch('/')}
            className={cn(
                "flex items-center justify-between px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                location.pathname === '/' ? "bg-primary/10 text-primary" : "text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800"
            )}
          >
            <div className="flex items-center gap-2.5 font-medium">
              <User size={16} /> 
              Minha Evolução
            </div>
            {isPersonalMode && <Check size={16} />}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-zinc-800 my-1.5" />

          {/* Cabeçalho Seção */}
          <div className="px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Minhas Academias</span>
          </div>

          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-zinc-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
              </div>
            ) : (
              data?.content.map(academy => {
                const isActive = academyId === String(academy.id); // Definindo isActive manualmente
                return (
                  <DropdownMenu.Item
                    key={academy.id}
                    onClick={() => handleSwitch(`/academies/${academy.id}`)}
                    className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5 font-medium line-clamp-1">
                      <Building2 size={16} /> 
                      {academy.name}
                    </div>
                    {isActive && <Check size={16} />}
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>

          <DropdownMenu.Separator className="h-px bg-zinc-800 my-1.5" />

          {/* Ações Inferiores */}
          <DropdownMenu.Item 
            onClick={() => handleSwitch('/academies/search')}
            className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                location.pathname === '/academies/search' ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800"
            )}
          >
            <Search size={16} /> Explorar Academias
          </DropdownMenu.Item>

          <DropdownMenu.Item 
            onClick={() => handleSwitch('/academies/new')}
            className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                location.pathname === '/academies/new' ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800"
            )}
          >
            <Plus size={16} /> Nova Academia
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};