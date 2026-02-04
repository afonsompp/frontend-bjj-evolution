import { TrainingResponse, Technique } from '../../../lib/types';
export const PERIOD_OPTIONS = [7, 14, 30, 45, 60, 90, 180, 365];
const DAY_MS = 24 * 60 * 60 * 1000;

export const buildPeriods = (days: number) => {
  const now = new Date();
  const currentStart = new Date(now.getTime() - days * DAY_MS);
  const previousEnd = new Date(currentStart.getTime());
  const previousStart = new Date(previousEnd.getTime() - days * DAY_MS);

  return {
    current: { start: currentStart, end: now },
    previous: { start: previousStart, end: previousEnd },
  };
};

export const calculateStats = (trainings: TrainingResponse[]) => {
  const stats = trainings.reduce(
    (acc, curr) => ({
      totalSessions: acc.totalSessions + 1,
      totalHours: acc.totalHours + curr.durationMinutes / 60,
      totalRounds: acc.totalRounds + (curr.totalRounds || 0),
      totalSubs: acc.totalSubs + (curr.submissions || 0),
      totalTaps: acc.totalTaps + (curr.taps || 0),
      totalSweeps: acc.totalSweeps + (curr.sweeps || 0),
      totalTakedowns: acc.totalTakedowns + (curr.takedowns || 0),
      totalPasses: acc.totalPasses + (curr.guardPasses || 0),
      totalEscapes: acc.totalEscapes + (curr.escapes || 0),
      totalCardio: acc.totalCardio + (curr.cardioRating || 0),
      totalIntensity: acc.totalIntensity + (curr.intensityRating || 0)
    }),
    { 
      totalSessions: 0, totalHours: 0, totalRounds: 0,
      totalSubs: 0, totalTaps: 0, totalSweeps: 0,
      totalTakedowns: 0, totalPasses: 0, totalEscapes: 0,
      totalCardio: 0, totalIntensity: 0
    }
  );

  const avgDuration = stats.totalSessions > 0 ? (stats.totalHours * 60) / stats.totalSessions : 0;
  const subRate = stats.totalRounds > 0 ? (stats.totalSubs / stats.totalRounds) : 0;
  const defenseIndex = stats.totalTaps > 0 ? (stats.totalEscapes / stats.totalTaps) : stats.totalEscapes;
  const avgCardio = stats.totalSessions > 0 ? (stats.totalCardio / stats.totalSessions) : 0;
  const avgIntensity = stats.totalSessions > 0 ? (stats.totalIntensity / stats.totalSessions) : 0;
  
  return { ...stats, avgDuration, subRate, defenseIndex , avgCardio, avgIntensity};
};

export interface TopTechnique {
    name: string;
    count: number;
    percentage: number;
}

export const calculateTopTechniques = (trainings: TrainingResponse[], field: 'submissionTechniques' | 'submissionTechniquesAllowed'): TopTechnique[] => {
    const counts: Record<string, number> = {};
    let maxCount = 0;

    trainings.forEach(t => {
        const list = t[field];
        if (list && Array.isArray(list)) {
            list.forEach((tech: Technique) => {
                if (tech?.name) {
                    const newCount = (counts[tech.name] || 0) + 1;
                    counts[tech.name] = newCount;
                    if (newCount > maxCount) maxCount = newCount;
                }
            });
        }
    });

    return Object.entries(counts)
        .map(([name, count]) => ({ 
            name, 
            count, 
            percentage: maxCount > 0 ? (count / maxCount) * 100 : 0 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
};