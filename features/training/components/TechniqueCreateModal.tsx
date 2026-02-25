import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Loader2 } from 'lucide-react';
import { Technique, TechniqueType, TechniqueTarget } from '../../../lib/types'; // Ajuste o import
import { createTechnique } from '../api/trainingService';

interface TechniqueCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTechnique: Technique) => void;
  prefilledName?: string;
}

// Opções para Dropdown
const TYPE_OPTIONS: { value: TechniqueType; label: string }[] = [
  { value: 'SUBMISSION', label: 'Submission (Finalização)' },
  { value: 'PIN', label: 'Pin (Imobilização)' },
  { value: 'POSITION', label: 'Position (Posição)' },
  { value: 'GUARD_PASS', label: 'Guard Pass (Passagem)' },
  { value: 'GUARD_POSITION', label: 'Guard Position (Guarda)' },
  { value: 'SCAPE', label: 'Escape (Saída/Defesa)' },
  { value: 'SWEEP', label: 'Sweep (Raspagem)' },
  { value: 'TAKEDOWN', label: 'Takedown (Queda)' },
  { value: 'GRIP', label: 'Grip (Pegada)' },
];

const TARGET_OPTIONS: { value: TechniqueTarget; label: string }[] = [
  { value: 'NECK', label: 'Neck (Pescoço)' },
  { value: 'ARM', label: 'Arm (Braço)' },
  { value: 'LEG', label: 'Leg (Perna)' },
  { value: 'JOINT', label: 'Joint (Articulação)' } as any, // Exemplo simplificado, adicione todos do enum
  { value: 'FULL_BODY', label: 'Full Body' } as any,
  { value: 'GUARD_PASS', label: 'Guard Pass' },
  { value: 'SWEEP', label: 'Sweep' },
  { value: 'TAKEDOWN', label: 'Takedown' },
  { value: 'ESCAPE', label: 'Escape' },
];

export const TechniqueCreateModal: React.FC<TechniqueCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  prefilledName = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: prefilledName,
    alternativeName: '',
    type: 'SUBMISSION' as TechniqueType,
    target: 'NECK' as TechniqueTarget
  });

  useEffect(() => {
    if (isOpen) setFormData(prev => ({ ...prev, name: prefilledName }));
  }, [isOpen, prefilledName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Previne que o submit suba para o form principal
    
    setIsLoading(true);
    try {
      const newTech = await createTechnique(formData);
      onSuccess(newTech);
      onClose();
      setFormData({ name: '', alternativeName: '', type: 'SUBMISSION', target: 'NECK' });
    } catch (error) {
      console.error("Erro ao criar técnica", error);
      // Aqui você pode usar um Toast notification
      alert("Erro ao salvar técnica.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // USO DO PORTAL PARA EVITAR <form> DENTRO DE <form>
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md shadow-2xl p-6 relative">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Nova Técnica</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Nome *</label>
            <input
              required
              minLength={3}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:border-primary focus:outline-none placeholder:text-zinc-700"
              placeholder="Ex: Armlock"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Nome Alternativo</label>
            <input
              value={formData.alternativeName}
              onChange={e => setFormData({...formData, alternativeName: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:border-primary focus:outline-none placeholder:text-zinc-700"
              placeholder="Ex: Juji Gatame"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Tipo *</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as TechniqueType})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Alvo *</label>
              <select
                value={formData.target}
                onChange={e => setFormData({...formData, target: e.target.value as TechniqueTarget})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
              >
                {TARGET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-800 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // <--- RENDERIZA NO BODY
  );
};