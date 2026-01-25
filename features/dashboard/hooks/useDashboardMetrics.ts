import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrainingsByDateRange } from '../api/getDashboardData';
import { buildPeriods, calculateStats, calculateTopTechniques } from '../lib/dashboard.utils';

export const useDashboardMetrics = () => {
  const [days, setDays] = useState<number>(7);
  const { current, previous } = useMemo(() => buildPeriods(days), [days]);

  const currentQuery = useQuery({
    queryKey: ['dashboard', 'current', days],
    queryFn: () => fetchTrainingsByDateRange(current.start, current.end),
  });
  
  const prevQuery = useQuery({
    queryKey: ['dashboard', 'previous', days],
    queryFn: () => fetchTrainingsByDateRange(previous.start, previous.end),
  });

  const currentTrainings = currentQuery.data || [];
  const previousTrainings = prevQuery.data || [];

  const stats = useMemo(() => ({
    current: calculateStats(currentTrainings),
    previous: calculateStats(previousTrainings),
  }), [currentTrainings, previousTrainings]);

  const topAttacks = useMemo(() => calculateTopTechniques(currentTrainings, 'submissionTechniques'), [currentTrainings]);
  const topDefenses = useMemo(() => calculateTopTechniques(currentTrainings, 'submissionTechniquesAllowed'), [currentTrainings]);

  return {
    days,
    setDays,
    isLoading: currentQuery.isLoading,
    stats,
    topAttacks,
    topDefenses
  };
};