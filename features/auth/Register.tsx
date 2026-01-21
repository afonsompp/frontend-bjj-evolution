import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Flame } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
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

    // Auto login or redirect to login (Supabase default behavior might require email confirm)
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-zinc-800 shadow-xl">
        <div className="text-center">
          <Flame className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create an account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Email address</label>
              <input
                type="email"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                {...register('email')}
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
              <input
                type="password"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                {...register('password')}
              />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Confirm Password</label>
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
            Register
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-text-muted">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
