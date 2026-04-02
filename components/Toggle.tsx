'use client';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ enabled, onChange, label, description }: ToggleProps) {
  return (
    <label className="toggle">
      <div className="toggle-content">
        <span className="toggle-label">{label}</span>
        {description && <span className="toggle-description">{description}</span>}
      </div>
      <div className={`toggle-switch ${enabled ? 'active' : ''}`} onClick={() => onChange(!enabled)}>
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
      </div>
    </label>
  );
}
