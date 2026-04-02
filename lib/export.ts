import type { YearData } from '@/types';

export function exportToCSV(data: YearData[], filename: string = 'compound-interest.csv'): void {
  const headers = ['Year', 'Balance', 'Invested', 'Interest', 'Real Balance', 'Real Invested', 'Real Interest'];
  const rows = data.map(row => [
    row.year.toString(),
    row.balance.toString(),
    row.invested.toString(),
    row.interest.toString(),
    (row.realBalance ?? row.balance).toString(),
    (row.realInvested ?? row.invested).toString(),
    (row.realInterest ?? row.interest).toString(),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function generateShareableUrl(params: {
  initial: number;
  monthly: number;
  rate: number;
  years: number;
  inflationRate?: number;
  monthlyIncrease?: number;
}): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const searchParams = new URLSearchParams({
    initial: params.initial.toString(),
    monthly: params.monthly.toString(),
    rate: params.rate.toString(),
    years: params.years.toString(),
    ...(params.inflationRate && { inflationRate: params.inflationRate.toString() }),
    ...(params.monthlyIncrease && { monthlyIncrease: params.monthlyIncrease.toString() }),
  });
  return `${baseUrl}?${searchParams.toString()}`;
}

export function parseUrlParams(search: string): Partial<{
  initial: number;
  monthly: number;
  rate: number;
  years: number;
  inflationRate: number;
  monthlyIncrease: number;
}> | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(search);
  const result: Record<string, number> = {};

  ['initial', 'monthly', 'rate', 'years', 'inflationRate', 'monthlyIncrease'].forEach(key => {
    const value = params.get(key);
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[key] = num;
    }
  });

  return Object.keys(result).length > 0 ? result as any : null;
}
