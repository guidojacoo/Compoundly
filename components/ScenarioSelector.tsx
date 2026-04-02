'use client';

import type { Scenario } from '@/types';

interface ScenarioSelectorProps {
  presets: Scenario[];
  activePreset: number;
  onSelect: (index: number) => void;
  onRateChange: (rate: number) => void;
}

export function ScenarioSelector({ presets, activePreset, onSelect, onRateChange }: ScenarioSelectorProps) {
  const applyPreset = (i: number) => {
    onSelect(i);
    onRateChange(presets[i].return);
  };

  return (
    <div className="scenario-grid">
      {presets.map((preset, i) => (
        <button
          key={preset.name}
          onClick={() => applyPreset(i)}
          className={`scenario-card ${activePreset === i ? 'active' : ''}`}
          style={{
            borderColor: activePreset === i ? preset.color : undefined,
            background: activePreset === i ? `${preset.color}12` : undefined,
          }}
        >
          <div className="scenario-header">
            <span className="scenario-emoji">{preset.emoji}</span>
            <span
              className="scenario-rate"
              style={{ color: activePreset === i ? preset.color : undefined }}
            >
              {preset.return}%
            </span>
          </div>
          <div className="scenario-name" style={{ color: activePreset === i ? preset.color : undefined }}>
            {preset.name}
          </div>
          <div className="scenario-desc">{preset.desc}</div>
        </button>
      ))}
    </div>
  );
}
