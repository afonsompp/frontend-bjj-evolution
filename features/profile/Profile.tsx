import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { UserProfile, CreateUpdateProfileDTO, BeltType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Loader2, Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  secondName: z.string().min(1, 'Last name is required'),
  belt: z.enum(['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']),
  stripe: z.coerce.number().min(0).max(4),
  startsIn: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: 'Invalid date',
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data } = await api.get<UserProfile>('/profiles');
        return data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Return null or undefined for 404 to indicate no profile yet
          return null as any;
        }
        throw err;
      }
    },
    retry: false,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        secondName: profile.secondName,
        belt: profile.belt,
        stripe: profile.stripe,
        startsIn: profile.startsIn,
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateUpdateProfileDTO) => {
      return api.post('/profiles', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert("Profile updated successfully!"); // Replace with Toast in production
    },
    onError: () => {
      alert("Failed to update profile.");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;
  if (isError && (error as any)?.response?.status !== 404) return <div className="text-danger">Error loading profile</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-text-muted mt-2">Manage your personal information and rank.</p>
      </header>

      <div className="bg-surface rounded-xl p-6 border border-zinc-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">First Name</label>
              <input
                type="text"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('name')}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Last Name</label>
              <input
                type="text"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('secondName')}
              />
              {errors.secondName && <p className="text-danger text-xs mt-1">{errors.secondName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Belt</label>
              <select
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('belt')}
              >
                <option value="WHITE">White</option>
                <option value="BLUE">Blue</option>
                <option value="PURPLE">Purple</option>
                <option value="BROWN">Brown</option>
                <option value="BLACK">Black</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Stripes</label>
              <select
                 className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                 {...register('stripe')}
              >
                 <option value="0">0</option>
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Started Training On</label>
              <input
                type="date"
                className="block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('startsIn')}
              />
              {errors.startsIn && <p className="text-danger text-xs mt-1">{errors.startsIn.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty}
              isLoading={mutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
