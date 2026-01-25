import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTrainingFormMutation } from '../hooks/useTrainingMutations';
import { useTechniquesList, useTrainingDetails } from '../hooks/useTrainingQueries';
import { TrainingForm } from '../components/TrainingForm';

export const TrainingFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Queries
  const { data: trainingData, isLoading: isLoadingTraining } = useTrainingDetails(id);
  const { data: techniques = [], isLoading: isLoadingTechs } = useTechniquesList();
  
  // Mutation
  const mutation = useTrainingFormMutation(id);

  if (isEditing && isLoadingTraining) return <div>Carregando treino...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/trainings')}>
           <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Editar Treino' : 'Registrar Treino'}
        </h1>
      </div>

      <TrainingForm 
         initialData={trainingData}
         techniques={techniques}
         onSubmit={(data) => mutation.mutate(data)}
         isSubmitting={mutation.isPending}
      />
    </div>
  );
};