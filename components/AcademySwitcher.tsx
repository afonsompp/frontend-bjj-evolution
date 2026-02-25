import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronsUpDown, Check, Plus, User, Building2, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMyAcademies } from '@/features/academy/api/academyService';
import { getProfile } from '@/features/profile/api/profileService'; 

export const AcademySwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { academyId } = useParams();
  const [open, setOpen] = useState(false);
  
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });

  const { data: academies, isLoading: isLoadingAcademies } = useQuery({
    queryKey: ['my-academies'],
    queryFn: () => getMyAcademies(0, 50),
  });

  const isPersonalMode = !academyId;
  const currentAcademy = academies?.content.find(a => String(a.id) === academyId);
  const canCreateAcademy = profile && profile.role !== 'CUSTOMER';

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      {/* O Trigger precisa ter um z-index para garantir que o clique não seja interceptado */}
      <DropdownMenu.Trigger asChild>
        <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-700 outline-none group relative z-[101]">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
              isPersonalMode ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            )}>
              {isPersonalMode ? <User size={16} /> : <Building2 size={16} />}
            </div>
            <div className="text-left">
              {isLoadingProfile ? (
                <div className="h-4 w-24 bg-zinc-800 animate-pulse rounded mb-1" />
              ) : (
                <p className="text-sm font-semibold text-zinc-100 line-clamp-1">
                  {isPersonalMode ? 'Minha Evolução' : (currentAcademy?.name || 'Academia')}
                </p>
              )}
              <p className="text-xs text-zinc-500 font-medium">
                {isPersonalMode ? 'Conta Pessoal' : 'Gestão Administrativa'}
              </p>
            </div>
          </div>
          <ChevronsUpDown size={16} className="text-zinc-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        {/* O segredo: fixed + z-[9999] + ignorar o stacking context do pai */}
        <DropdownMenu.Content 
          align="start" 
          sideOffset={10} 
          style={{ zIndex: 9999 }}
          className="w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 fixed animate-in fade-in zoom-in-95 duration-150 outline-none min-h-[160px] flex flex-col"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenu.Item 
            onClick={() => { navigate('/'); setOpen(false); }}
            className={cn(
                "flex items-center justify-between px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                location.pathname === '/' ? "bg-primary/10 text-primary" : "text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800"
            )}
          >
            <div className="flex items-center gap-2.5 font-medium">
              <User size={16} className={location.pathname === '/' ? "text-primary" : "text-zinc-500"} /> 
              Minha Evolução
            </div>
            {isPersonalMode && <Check size={16} />}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-zinc-800 my-1.5" />

          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Minhas Academias
          </div>

          <div className="flex-1 max-h-[200px] overflow-y-auto custom-scrollbar">
            {isLoadingAcademies || isLoadingProfile ? (
              <div className="space-y-2 p-2">
                <div className="h-8 w-full bg-zinc-800/40 animate-pulse rounded-md" />
                <div className="h-8 w-full bg-zinc-800/40 animate-pulse rounded-md" />
              </div>
            ) : (
              academies?.content.map(academy => {
                const isActive = academyId === String(academy.id);
                return (
                  <DropdownMenu.Item
                    key={academy.id}
                    onClick={() => { navigate(`/academies/${academy.id}`); setOpen(false); }}
                    className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm outline-none cursor-pointer rounded-lg transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5 font-medium line-clamp-1">
                      <Building2 size={16} className={isActive ? "text-primary" : "text-zinc-500"} /> 
                      {academy.name}
                    </div>
                    {isActive && <Check size={16} />}
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>

          {!isLoadingProfile && (
            <>
              <DropdownMenu.Separator className="h-px bg-zinc-800 my-1.5" />
              <DropdownMenu.Item 
                onClick={() => { navigate('/academies/search'); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-400 outline-none cursor-pointer rounded-lg hover:bg-zinc-800 hover:text-white"
              >
                <Search size={16} /> Explorar Academias
              </DropdownMenu.Item>

              {canCreateAcademy && (
                <DropdownMenu.Item 
                  onClick={() => { navigate('/academies/new'); setOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-400 outline-none cursor-pointer rounded-lg hover:bg-zinc-800 hover:text-white"
                >
                  <Plus size={16} /> Nova Academia
                </DropdownMenu.Item>
              )}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};