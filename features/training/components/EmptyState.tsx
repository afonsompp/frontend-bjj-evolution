import React from 'react';
import { Dumbbell } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-16 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
        <Dumbbell className="w-8 h-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">Sem treinos registrados</h3>
      <p className="text-zinc-500 max-w-sm">
        Comece registrando sua primeira aula ou rola para acompanhar sua evolução.
      </p>
    </div>
  );
};