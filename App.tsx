import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { TrainingList } from './features/training/TrainingList';
import { TrainingForm } from './features/training/TrainingForm';
import { Profile } from './features/profile/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trainings" element={<TrainingList />} />
              <Route path="/trainings/new" element={<TrainingForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trainings/:id" element={<TrainingForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
