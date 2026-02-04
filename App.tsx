import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { Dashboard } from './features/dashboard/pages/Dashboard';
import { Profile } from './features/profile/pages/Profile';
import { TrainingListPage } from './features/training/pages/TrainingListPage';
import { TrainingFormPage } from './features/training/pages/TrainingFormPage';
import { AcademyDashboard } from './features/academy/pages/AcademyDashboard';
import { AcademyCreate } from './features/academy/pages/AcademyCreate';

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
              <Route path="/trainings" element={<TrainingListPage />} />
              <Route path="/trainings/new" element={<TrainingFormPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trainings/:id" element={<TrainingFormPage />} />
              <Route path="/academies/new" element={<AcademyCreate />} />
              <Route path="/academies/:academyId" element={<AcademyDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
