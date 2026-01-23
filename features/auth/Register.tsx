import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Flame } from 'lucide-react';

// Esquema de validação traduzido
const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-zinc-800 shadow-xl">
        <div className="text-center">
          <Flame className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Crie sua conta</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">E-mail</label>
              <input
                type="email"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                {...register('email')}
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Senha</label>
              <input
                type="password"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                {...register('password')}
              />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Confirmar Senha</label>
              <input
                type="password"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-900/20 p-4 border border-red-900">
               <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Cadastrar
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-text-muted">Já tem uma conta? </span>
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};