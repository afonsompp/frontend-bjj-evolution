import React, { useState } from 'react';
import { Outlet, useNavigate, useParams, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Dumbbell, LogOut, Menu, X, Flame, Users, Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AcademySwitcher } from './AcademySwitcher';
import { useAcademyPermissions } from '../features/academy/hooks/useAcademyPermissions';

export const Layout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { academyId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isStaff } = useAcademyPermissions(academyId);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = academyId ? [
    { to: `/academies/${academyId}`, label: 'Visão Geral', icon: LayoutDashboard },
    { to: `/academies/${academyId}/schedule`, label: 'Grade', icon: Calendar },
    ...(isStaff ? [{ to: `/academies/${academyId}/members`, label: 'Membros', icon: Users }] : []),
  ] : [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trainings', label: 'Meus Treinos', icon: Dumbbell },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden">
      
      {/* Mobile Header - REDUZIDO para z-[30] */}
      <div className="lg:hidden fixed top-0 w-full h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-[30] px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Flame className="fill-primary w-6 h-6" />
          <span>Nosso BJJ</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - AUMENTADO para z-[100] no mobile para sobrepor o header */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 z-[100] h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-zinc-800 shrink-0">
          <AcademySwitcher />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === `/academies/${academyId}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? "text-primary" : "text-zinc-500"} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all font-medium">
            <LogOut size={18} /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Area - pt-16 corrige o corte no mobile */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto relative bg-[#09090b] pt-16 lg:pt-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay mobile - Entre o Header e a Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};