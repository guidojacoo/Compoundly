'use client';

import { useState, useRef, useEffect } from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon?: React.ReactNode;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  decimals,
  prefix = '',
  suffix = '',
  color,
  icon,
}: SliderProps) {
  const [text, setText] = useState(value.toString());
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setText(decimals > 0 ? value.toFixed(decimals) : value.toString());
    }
  }, [value, decimals]);

  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const commitText = (raw: string) => {
    const normalized = raw.replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setText(decimals > 0 ? clamped.toFixed(decimals) : clamped.toString());
    } else {
      setText(decimals > 0 ? value.toFixed(decimals) : value.toString());
    }
  };

  return (
    <div className="slider-group">
      <div className="slider-header">
        <span className="slider-label">
          {icon && <span className="slider-icon">{icon}</span>}
          {label.toUpperCase()}
        </span>
        <div className="slider-input-wrapper">
          {prefix && <span className="slider-prefix" style={{ color }}>{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onFocus={() => { focused.current = true; }}
            onBlur={() => { focused.current = false; commitText(text); }}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            className="slider-input"
            style={{ color }}
          />
          {suffix && <span className="slider-suffix" style={{ color }}>{suffix}</span>}
        </div>
      </div>

      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${pct}%`, background: color }} />
        <div className="slider-thumb" style={{ left: `${pct}%`, background: color, boxShadow: `0 0 12px ${color}60` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => {
            const v = parseFloat(e.target.value);
            onChange(v);
            setText(decimals > 0 ? v.toFixed(decimals) : v.toString());
          }}
          className="slider-range"
        />
      </div>

      <div className="slider-range-labels">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}
