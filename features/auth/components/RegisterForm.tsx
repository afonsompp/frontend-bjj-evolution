import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, RegisterFormData } from '../schemas/auth.schema';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
  serverError: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, serverError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Senha"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar Senha"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      {serverError && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-900/50">
           <p className="text-sm text-red-300 text-center">{serverError}</p>
        </div>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Cadastrar
      </Button>

      <div className="text-center text-sm">
        <span className="text-text-muted">Já tem uma conta? </span>
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
          Entrar
        </Link>
      </div>
    </form>
  );
};