import React from 'react';
import { useRegister } from '../hooks/useAuth';
import { RegisterForm } from '../components/RegisterForm';
import { AuthLayout } from '../components/AuthLayout';

export const Register: React.FC = () => {
  const { registerUser, isLoading, error } = useRegister();

  return (
    <AuthLayout title="Crie sua conta">
      <RegisterForm 
        onSubmit={registerUser} 
        isLoading={isLoading} 
        serverError={error} 
      />
    </AuthLayout>
  );
};