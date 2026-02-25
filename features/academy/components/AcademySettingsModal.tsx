import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Academy, AcademyMember } from '../types';
import { updateAcademy } from '../api/academyService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  academy: Academy;
  ownerId: string;
}

export const AcademySettingsModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, academy, ownerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: academy.name,
    address: academy.address
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAcademy(academy.id, { ...formData, ownerId });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update academy", error);
      alert("Erro ao atualizar academia.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="text-primary w-5 h-5" /> Configurações
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Input 
            label="Nome da Academia" 
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Input 
            label="Endereço" 
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />

          <div className="pt-4 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancelar</Button>
             <Button onClick={handleSave} isLoading={isLoading}>
               <Save className="w-4 h-4 mr-2" /> Salvar Alterações
             </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};