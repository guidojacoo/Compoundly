'use client';

import { useState } from 'react';
import type { YearData } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface YearTableProps {
  data: YearData[];
  goalYear?: number | null;
  goalLabel?: string;
  showReal?: boolean;
}

export function YearTable({ data, goalYear, goalLabel, showReal = false }: YearTableProps) {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? data : data.slice(0, 8);

  return (
    <div className="table-container">
      <table className="year-table">
        <thead>
          <tr>
            <th>Año</th>
            <th className="text-right">Balance</th>
            <th className="text-right">Invertido</th>
            <th className="text-right">Ganancias</th>
            <th className="text-right">Retorno</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => {
            const balance = showReal ? (row.realBalance ?? row.balance) : row.balance;
            const invested = showReal ? (row.realInvested ?? row.invested) : row.invested;
            const interest = showReal ? (row.realInterest ?? row.interest) : row.interest;
            const returnPct = invested > 0 ? ((balance - invested) / invested) * 100 : 0;
            const isGoalYear = goalYear != null && Math.round(goalYear) === row.year;

            return (
              <tr key={row.year} className={isGoalYear ? 'goal-row' : ''}>
                <td>
                  {row.year === 0 ? 'Inicio' : `Año ${row.year}`}
                  {isGoalYear && <span className="goal-badge">★ {goalLabel}</span>}
                </td>
                <td className="text-right balance">{formatCurrency(balance)}</td>
                <td className="text-right invested">{formatCurrency(invested)}</td>
                <td className="text-right interest">{interest >= 0 ? '+' : ''}{formatCurrency(interest)}</td>
                <td className="text-right return">{formatPercent(returnPct)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length > 8 && (
        <button onClick={() => setExpanded(!expanded)} className="expand-btn">
          {expanded ? '▲ MOSTRAR MENOS' : `▼ VER TODOS LOS ${data.length - 1} AÑOS`}
        </button>
      )}
    </div>
  );
}
