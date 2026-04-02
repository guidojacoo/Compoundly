import type { CalculationParams, CalculationResult, YearData } from '@/types';

export function calculateCompoundInterest(params: CalculationParams): CalculationResult {
  const {
    initial,
    monthly,
    rate,
    years,
    inflationRate = 0,
    monthlyIncrease = 0,
    monthlyIncreaseType = 'percent',
  } = params;

  let balance = initial;
  let invested = initial;
  let monthlyContribution = monthly;
  const monthlyRate = rate / 100 / 12;
  const monthlyInflation = inflationRate / 100 / 12;

  const data: YearData[] = [{
    year: 0,
    balance: Math.round(initial),
    invested: Math.round(initial),
    interest: 0,
    realBalance: Math.round(initial),
    realInvested: Math.round(initial),
    realInterest: 0,
  }];

  for (let month = 1; month <= years * 12; month++) {
    // Apply monthly increase to contribution
    if (monthlyIncrease > 0 && month > 1) {
      if (monthlyIncreaseType === 'percent') {
        monthlyContribution = monthlyContribution * (1 + monthlyIncrease / 100);
      } else {
        monthlyContribution = monthlyContribution + monthlyIncrease;
      }
    }

    // Calculate monthly balance
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    invested += monthlyContribution;

    // Calculate real values (adjusted for inflation)
    const inflationFactor = Math.pow(1 + monthlyInflation, month);
    const realBalance = balance / inflationFactor;
    const realInvested = invested / inflationFactor;
    const realInterest = realBalance - realInvested;

    // Add year-end data
    if (month % 12 === 0) {
      const year = month / 12;
      data.push({
        year,
        balance: Math.round(balance),
        invested: Math.round(invested),
        interest: Math.round(balance - invested),
        realBalance: Math.round(realBalance),
        realInvested: Math.round(realInvested),
        realInterest: Math.round(realInterest),
      });
    }
  }

  const finalData = data[data.length - 1];
  const totalInvested = initial + monthly * years * 12;
  const totalReturn = finalData.balance - totalInvested;
  const multiplier = totalInvested > 0 ? finalData.balance / totalInvested : 1;

  return {
    data,
    finalBalance: Math.round(finalData.balance),
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(totalReturn),
    multiplier,
    realFinalBalance: Math.round(finalData.realBalance ?? finalData.balance),
    realTotalInvested: Math.round(finalData.realInvested ?? finalData.invested),
    realTotalInterest: Math.round(finalData.realInterest ?? finalData.interest),
  };
}

export function calculateYearsToGoal(
  initial: number,
  monthly: number,
  rate: number,
  goal: number,
  monthlyIncrease: number = 0,
  monthlyIncreaseType: 'percent' | 'fixed' = 'percent'
): number | null {
  if (initial >= goal) return 0;
  if (rate <= 0 && monthly <= 0) return null;

  let balance = initial;
  let monthlyContribution = monthly;
  const monthlyRate = rate / 100 / 12;

  for (let month = 1; month <= 1200; month++) {
    if (monthlyIncrease > 0 && month > 1) {
      if (monthlyIncreaseType === 'percent') {
        monthlyContribution = monthlyContribution * (1 + monthlyIncrease / 100);
      } else {
        monthlyContribution = monthlyContribution + monthlyIncrease;
      }
    }

    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (balance >= goal) return month / 12;
  }

  return null;
}

export function calculateCAGR(initial: number, final: number, years: number): number {
  if (years <= 0 || initial <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}

export function calculateYearsToDouble(initial: number, monthly: number, rate: number): number | null {
  const target = initial * 2;
  if (initial >= target) return 0;
  if (rate <= 0 && monthly <= 0) return null;

  let balance = initial;
  const monthlyRate = rate / 100 / 12;

  for (let month = 1; month <= 1200; month++) {
    balance = balance * (1 + monthlyRate) + monthly;
    if (balance >= target) return month / 12;
  }

  return null;
}
