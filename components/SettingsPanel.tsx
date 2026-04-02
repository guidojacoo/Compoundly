'use client';

import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { Card, SectionLabel } from './Card';

interface SettingsPanelProps {
  inflationRate: number;
  onInflationRateChange: (rate: number) => void;
  monthlyIncrease: number;
  onMonthlyIncreaseChange: (increase: number) => void;
  monthlyIncreaseType: 'percent' | 'fixed';
  onMonthlyIncreaseTypeChange: (type: 'percent' | 'fixed') => void;
  showAdvanced: boolean;
  onShowAdvancedChange: (show: boolean) => void;
}

export function SettingsPanel({
  inflationRate,
  onInflationRateChange,
  monthlyIncrease,
  onMonthlyIncreaseChange,
  monthlyIncreaseType,
  onMonthlyIncreaseTypeChange,
  showAdvanced,
  onShowAdvancedChange,
}: SettingsPanelProps) {
  if (!showAdvanced) return null;

  return (
    <Card title="CONFIGURACIÓN AVANZADA" className="settings-panel">
      <Toggle
        label="Ajustar por inflación"
        description="Mostrar valores reales"
        enabled={inflationRate > 0}
        onChange={enabled => onInflationRateChange(enabled ? 3 : 0)}
      />

      {inflationRate > 0 && (
        <Slider
          label="Tasa de inflación anual"
          value={inflationRate}
          onChange={onInflationRateChange}
          min={0.1}
          max={20}
          step={0.1}
          decimals={1}
          suffix="%"
          color="#ff8a65"
        />
      )}

      <div className="settings-divider" />

      <Toggle
        label="Incremento de aportes"
        description="Aumentar aportes anualmente"
        enabled={monthlyIncrease > 0}
        onChange={enabled => onMonthlyIncreaseChange(enabled ? 5 : 0)}
      />

      {monthlyIncrease > 0 && (
        <>
          <div className="increase-type-selector">
            <button
              className={monthlyIncreaseType === 'percent' ? 'active' : ''}
              onClick={() => onMonthlyIncreaseTypeChange('percent')}
            >
              Porcentual
            </button>
            <button
              className={monthlyIncreaseType === 'fixed' ? 'active' : ''}
              onClick={() => onMonthlyIncreaseTypeChange('fixed')}
            >
              Fijo
            </button>
          </div>
          <Slider
            label={`Incremento ${monthlyIncreaseType === 'percent' ? 'anual' : 'mensual'}`}
            value={monthlyIncrease}
            onChange={onMonthlyIncreaseChange}
            min={1}
            max={50}
            step={1}
            decimals={0}
            suffix={monthlyIncreaseType === 'percent' ? '%' : '$'}
            color="#a78bfa"
          />
        </>
      )}
    </Card>
  );
}
