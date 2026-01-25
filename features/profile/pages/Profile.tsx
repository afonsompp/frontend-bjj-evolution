// src/features/profile/pages/ProfilePage.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useProfile, useProfileMutation } from '../hooks/useProfile';
import { ProfileForm } from '../components/ProfileForm';

export const Profile: React.FC = () => {
  const { data: profile, isLoading, isError } = useProfile();
  const mutation = useProfileMutation();

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Erro ao carregar perfil. Tente recarregar a página.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="text-zinc-400 mt-2">Gerencie suas informações pessoais e graduação.</p>
      </header>

      <div className="bg-surface rounded-xl p-6 border border-zinc-800">
        <ProfileForm 
            initialData={profile || null} 
            onSubmit={(data) => mutation.mutate(data)}
            isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
};