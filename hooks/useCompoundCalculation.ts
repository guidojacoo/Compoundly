'use client';

import { useMemo } from 'react';
import { calculateCompoundInterest } from '@/lib/calculations';
import type { CalculationParams, CalculationResult } from '@/types';

export function useCompoundCalculation(params: CalculationParams): CalculationResult {
  return useMemo(() => calculateCompoundInterest(params), [
    params.initial,
    params.monthly,
    params.rate,
    params.years,
    params.inflationRate,
    params.monthlyIncrease,
    params.monthlyIncreaseType,
  ]);
}
