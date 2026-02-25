import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AcademyMember } from '../types';
import { graduateMember } from '../api/academyService';
import { BeltType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  academyId: string;
  member: AcademyMember;
}

const BELT_OPTIONS: BeltType[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];

export const GraduationModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, academyId, member }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [belt, setBelt] = useState<BeltType>(member.belt);
  const [stripe, setStripe] = useState<number>(member.stripe);

  const handleGraduate = async () => {
    setIsLoading(true);
    try {
      await graduateMember(academyId, member.user.id.toString(), { newBelt: belt, newStripe: stripe });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to graduate", error);
      alert("Erro ao graduar aluno.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-zinc-800 rounded-xl w-full max-w-sm shadow-2xl p-6 relative">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="text-primary" /> Graduar Aluno
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 text-center">
             <p className="text-sm text-zinc-400">Aluno</p>
             <p className="text-white font-medium">{member.user.name} {member.user.secondName}</p>
             <p className="text-xs text-zinc-500 mt-1">Atual: {member.belt} ({member.stripe} graus)</p>
          </div>

          <Select 
            label="Nova Faixa" 
            value={belt} 
            onChange={(e) => setBelt(e.target.value as BeltType)}
          >
            {BELT_OPTIONS.map(b => (
              <option key={b} value={b}>{b.replace('_', ' ')}</option>
            ))}
          </Select>

          <div>
             <label className="block text-sm font-medium text-zinc-400 mb-2">Novos Graus</label>
             <div className="flex gap-2">
               {[0, 1, 2, 3, 4].map(s => (
                 <button
                   key={s}
                   onClick={() => setStripe(s)}
                   className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${
                     stripe === s 
                       ? 'bg-primary text-white border-primary' 
                       : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                   }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancelar</Button>
             <Button onClick={handleGraduate} isLoading={isLoading}>
               Confirmar
             </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};