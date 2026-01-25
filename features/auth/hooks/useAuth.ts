import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, isLoading, error };
};