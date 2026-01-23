import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading: authLoading } = useAuth();
  const location = useLocation();

  const { isLoading: profileLoading, error, isError } = useQuery({
    queryKey: ['checkProfileExists'],
    queryFn: async () => {
      const { data } = await api.get('/profiles');
      return data;
    },
    retry: false,
    enabled: !!session,
  });

  if (authLoading || (!!session && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const isProfileMissing = isError && (error as any)?.response?.status === 404;
  const isOnProfilePage = location.pathname === '/profile';

  if (isProfileMissing && !isOnProfilePage) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};