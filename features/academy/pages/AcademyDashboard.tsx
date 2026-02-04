import React from 'react';
import { useParams } from 'react-router-dom';
import { useAcademyPermissions } from '../hooks/useAcademyPermissions';
import { Calendar, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AcademyDashboard: React.FC = () => {
  const { academyId } = useParams();
  const { isStaff, canManageClasses } = useAcademyPermissions(academyId);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-white">Painel da Academia</h1>
           <p className="text-zinc-400">Visão geral e aulas do dia</p>
        </div>
        {canManageClasses && (
           <Button>
             <Plus className="w-4 h-4 mr-2" /> Nova Aula
           </Button>
        )}
      </header>

      {/* Placeholder da Grade de Horários */}
      <div className="grid gap-4">
         <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Grade de horários será listada aqui</p>
            {/* Aqui você implementará a listagem usando getAcademyClasses */}
         </div>
      </div>
    </div>
  );
};