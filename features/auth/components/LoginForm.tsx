import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, LoginFormData } from '../schemas/auth.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  serverError: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, serverError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input
          label="Email"
          placeholder="seuemailaqui@exemplo.com"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Senha"
          placeholder="••••••"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {serverError && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-900/50">
          <p className="text-sm text-red-300 text-center">{serverError}</p>
        </div>
      )}

      <div>
        <Button type="submit" isLoading={isLoading} className="w-full">
          Entrar
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-text-muted">Não tem uma conta? </span>
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover transition-colors">
          Registre-se
        </Link>
      </div>
    </form>
  );
};