'use client';

import { useMemo } from 'react';
import { calculateYearsToGoal, calculateYearsToDouble } from '@/lib/calculations';

export function useGoalCalculation(
  initial: number,
  monthly: number,
  rate: number,
  goals: number[]
): (number | null)[] {
  return useMemo(() => {
    return goals.map(goal => calculateYearsToGoal(initial, monthly, rate, goal));
  }, [initial, monthly, rate, goals]);
}

export function useYearsToDouble(initial: number, monthly: number, rate: number): number | null {
  return useMemo(
    () => calculateYearsToDouble(initial, monthly, rate),
    [initial, monthly, rate]
  );
}
