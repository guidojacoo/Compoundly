'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import type { YearData, Scenario } from '@/types';
import { formatCompact } from '@/lib/formatters';

interface CompoundChartProps {
  data: YearData[];
  years: number;
  rate: number;
  showInflation?: boolean;
  scenarios?: Array<{ data: YearData[]; scenario: Scenario }>;
  goalYear?: number | null;
  goalLabel?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
  const invested = payload.find((p: any) => p.dataKey === 'invested')?.value || 0;
  const interest = payload.find((p: any) => p.dataKey === 'interest')?.value || 0;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-year">Año {label}</div>
      <div className="chart-tooltip-total">{formatCompact(total)}</div>
      <div className="chart-tooltip-row" style={{ color: '#9090a8' }}>
        Invertido: {formatCompact(invested)}
      </div>
      <div className="chart-tooltip-row" style={{ color: '#00e5a0' }}>
        Ganancias: {formatCompact(interest)}
      </div>
    </div>
  );
};

export function CompoundChart({
  data,
  years,
  rate,
  showInflation = false,
  scenarios = [],
  goalYear,
  goalLabel,
}: CompoundChartProps) {
  const displayData = data.map(d => ({
    year: d.year,
    invested: showInflation ? (d.realInvested ?? d.invested) : d.invested,
    interest: showInflation ? (d.realInterest ?? d.interest) : d.interest,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="inv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9090a8" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#9090a8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="int" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="year"
            stroke="none"
            tick={{ fill: '#5a5a72', fontSize: 11, fontFamily: 'DM Mono' }}
            tickFormatter={v => `${v}y`}
          />
          <YAxis
            stroke="none"
            tick={{ fill: '#5a5a72', fontSize: 11, fontFamily: 'DM Mono' }}
            tickFormatter={v => formatCompact(v)}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="invested"
            stackId="1"
            stroke="#9090a8"
            strokeWidth={2}
            fill="url(#inv)"
            name="Invertido"
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#00e5a0"
            strokeWidth={2.5}
            fill="url(#int)"
            name="Ganancias"
          />
          {goalYear && goalYear > 0 && goalYear <= years && (
            <ReferenceLine
              x={Math.round(goalYear)}
              stroke="#f5c842"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: goalLabel || 'META',
                fill: '#f5c842',
                fontSize: 10,
                fontFamily: 'DM Mono',
                position: 'top',
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
