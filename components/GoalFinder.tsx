'use client';

import { useGoalCalculation } from '@/hooks/useGoalCalculation';
import { formatYears } from '@/lib/formatters';

interface GoalFinderProps {
  initial: number;
  monthly: number;
  rate: number;
  goalTarget: number | null;
  onGoalSelect: (goal: number | null) => void;
  goals: Array<{ label: string; value: number }>;
}

export function GoalFinder({ initial, monthly, rate, goalTarget, onGoalSelect, goals }: GoalFinderProps) {
  const goalYears = useGoalCalculation(initial, monthly, rate, goals.map(g => g.value));

  return (
    <div className="goal-finder">
      <div className="goal-finder-title">¿CUÁNTO PARA LLEGAR A...?</div>
      <div className="goal-buttons">
        {goals.map((g, index) => {
          const years = goalYears[index];
          const active = goalTarget === g.value;

          return (
            <button
              key={g.label}
              onClick={() => onGoalSelect(active ? null : g.value)}
              className={`goal-btn ${active ? 'active' : ''}`}
            >
              {g.label}
              {years === 0 && <span className="goal-check">✓ ya</span>}
              {years != null && years > 0 && (
                <span className="goal-years">{formatYears(years)}</span>
              )}
              {years === null && <span className="goal-infinity">∞</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
