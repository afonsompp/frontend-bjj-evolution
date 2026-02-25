import React, { useState, useEffect } from 'react';
import { X, UserPlus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { searchUsers } from '@/features/profile/api/profileService';
import { useDebounce } from '@/features/training/hooks/useDebounce';
import { AcademyRole } from '@/lib/types';
import { BeltType, UserProfile } from '@/types';
import { AddMemberDTO } from '../types';
import { addMember } from '../api/academyService';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  academyId: string;
}

const ROLES: AcademyRole[] = ['STUDENT', 'INSTRUCTOR', 'MANAGER'];
const BELTS: BeltType[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];

export const AddMemberModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, academyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddMemberDTO>({ userId: '', role: 'STUDENT', belt: 'WHITE', stripe: 0 });
  
  // Estados de Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch.length < 3) {
        setSearchResults([]);
        return;
    }
    searchUsers(debouncedSearch).then(setSearchResults).catch(console.error);
  }, [debouncedSearch]);

  const handleSubmit = async () => {
    if(!formData.userId) return alert("Selecione um usuário.");
    setIsLoading(true);
    try {
      await addMember(academyId, formData);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao adicionar membro.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-zinc-800 rounded-xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="text-primary" /> Adicionar Aluno
          </h3>
          <button onClick={onClose}><X className="text-zinc-400" /></button>
        </div>

        <div className="space-y-4">
          {/* BUSCA DE USUÁRIO */}
          <div className="relative space-y-2">
             <label className="text-sm font-medium text-zinc-400">Usuário</label>
             {!selectedUser ? (
                 <>
                   <div className="relative">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                     <Input 
                        placeholder="Buscar por nome ou nickname..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                     />
                   </div>
                   {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-800 rounded-md mt-1 shadow-xl max-h-48 overflow-auto">
                          {searchResults.map(user => (
                              <button
                                  key={user.id}
                                  onClick={() => { setSelectedUser(user); setFormData(p => ({...p, userId: user.id})); setSearchResults([]); }}
                                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 border-b border-zinc-800/50"
                              >
                                  <span className="block text-white font-medium">
                                    {user.name} {user.secondName}
                                  </span>
                                  {/* @ts-ignore */}
                                  {user.nickname && <span className="text-xs text-primary">@{user.nickname}</span>}
                              </button>
                          ))}
                      </div>
                   )}
                 </>
             ) : (
                <div className="flex justify-between items-center p-3 bg-zinc-900 border border-zinc-800 rounded">
                    <div>
                        <p className="text-white font-medium">{selectedUser.name}</p>
                         {/* @ts-ignore */}
                        <p className="text-xs text-zinc-500">{selectedUser.nickname ? `@${selectedUser.nickname}` : 'Selecionado'}</p>
                    </div>
                    <Button variant="ghost" onClick={() => { setSelectedUser(null); setFormData(p => ({...p, userId: ''})); }}>Alterar</Button>
                </div>
             )}
          </div>

          <Select label="Papel" value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value as AcademyRole }))}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Faixa" value={formData.belt} onChange={e => setFormData(p => ({ ...p, belt: e.target.value as BeltType }))}>
              {BELTS.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Input label="Graus" type="number" min={0} max={4} value={formData.stripe} onChange={e => setFormData(p => ({ ...p, stripe: Number(e.target.value) }))} />
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <Button variant="ghost" onClick={onClose}>Cancelar</Button>
             <Button onClick={handleSubmit} isLoading={isLoading} disabled={!formData.userId}>Adicionar</Button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
};