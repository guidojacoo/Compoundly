'use client';

import { Modal } from './Modal';
import { Button } from './Button';
import { exportToCSV, generateShareableUrl } from '@/lib/export';
import type { YearData } from '@/types';
import { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: YearData[];
  params: {
    initial: number;
    monthly: number;
    rate: number;
    years: number;
  };
}

export function ExportModal({ isOpen, onClose, data, params }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(data, `compoundly-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleShare = () => {
    const url = generateShareableUrl(params);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar y Compartir">
      <div className="export-content">
        <div className="export-section">
          <h4>Exportar Datos</h4>
          <p>Descarga los resultados completos en formato CSV para analizar en Excel o Google Sheets.</p>
          <Button onClick={handleExportCSV} icon="📥">
            Exportar CSV
          </Button>
        </div>

        <div className="export-section">
          <h4>Compartir</h4>
          <p>Genera un enlace con tu configuración actual para compartir con otros.</p>
          <Button onClick={handleShare} variant="secondary" icon="🔗">
            {copied ? '¡Copiado!' : 'Copiar Enlace'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
