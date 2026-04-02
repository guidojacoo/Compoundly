'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Card({ children, className = '', title, description, icon }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || description) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          <div className="card-title-group">
            {title && <span className="card-title">{title}</span>}
            {description && <span className="card-description">{description}</span>}
          </div>
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon" style={{ color }}>{icon}</div>}
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-label-icon">◇</span>
      {children}
    </div>
  );
}
