export interface Scenario {
  name: string;
  emoji: string;
  return: number;
  desc: string;
  color: string;
}

export interface Goal {
  label: string;
  value: number;
}

export interface YearData {
  year: number;
  balance: number;
  invested: number;
  interest: number;
  realBalance?: number;
  realInvested?: number;
  realInterest?: number;
}

export interface CalculationParams {
  initial: number;
  monthly: number;
  rate: number;
  years: number;
  inflationRate?: number;
  monthlyIncrease?: number;
  monthlyIncreaseType?: 'percent' | 'fixed';
}

export interface CalculationResult {
  data: YearData[];
  finalBalance: number;
  totalInvested: number;
  totalInterest: number;
  multiplier: number;
  realFinalBalance?: number;
  realTotalInvested?: number;
  realTotalInterest?: number;
}
