import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Dumbbell, 
  LogOut, 
  Menu, 
  X,
  Flame
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trainings', label: 'My Trainings', icon: Dumbbell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-surface border-b border-zinc-800 z-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Flame className="w-6 h-6" />
          <span>BJJ Evo</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-surface border-r border-zinc-800 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-2 font-bold text-2xl text-primary border-b border-zinc-800 h-20">
           <Flame className="w-8 h-8" />
           <span>BJJ Evolution</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-muted hover:bg-zinc-800 hover:text-text"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-w-0 overflow-y-auto h-screen scroll-smooth">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
