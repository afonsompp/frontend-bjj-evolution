import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { updateMemberRole } from '../api/academyService';
import { AcademyMember } from '../types';
import { AcademyRole } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  academyId: string;
  member: AcademyMember;
}

const ROLES: AcademyRole[] = ['STUDENT', 'INSTRUCTOR', 'MANAGER', 'OWNER'];

export const EditRoleModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, academyId, member }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<AcademyRole>(member.role);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateMemberRole(academyId, member.user.id, role);
      onSuccess();
      onClose();
    } catch (error) { alert("Erro ao alterar papel."); } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-zinc-800 rounded-xl w-full max-w-xs shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Shield className="text-primary" /> Cargo</h3>
          <button onClick={onClose}><X className="text-zinc-400" /></button>
        </div>
        <div className="space-y-4">
          <p className="text-white text-center font-medium">{member.user.name}</p>
          <Select label="Novo Cargo" value={role} onChange={(e) => setRole(e.target.value as AcademyRole)}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
             <Button variant="ghost" onClick={onClose}>Cancelar</Button>
             <Button onClick={handleUpdate} isLoading={isLoading}>Salvar</Button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
};