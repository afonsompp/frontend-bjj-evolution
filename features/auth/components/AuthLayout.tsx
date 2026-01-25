import React from 'react';
import { Flame } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-zinc-800 shadow-xl">
        <div className="text-center">
          <Flame className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};