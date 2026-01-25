import React from 'react';
import { useLogin } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export const Login: React.FC = () => {
  const { login, isLoading, error } = useLogin();

  return (
    <AuthLayout 
      title="Entre no Nosso BJJ" 
      subtitle="Acompanhe sua evolução nos tatames"
    >
      <LoginForm 
        onSubmit={login} 
        isLoading={isLoading} 
        serverError={error} 
      />
    </AuthLayout>
  );
};