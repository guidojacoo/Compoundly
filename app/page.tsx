"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Slider } from "@/components/Slider";
import { Card, SectionLabel, StatCard } from "@/components/Card";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Toggle } from "@/components/Toggle";
import { YearTable } from "@/components/YearTable";
import { GoalFinder } from "@/components/GoalFinder";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ExportModal } from "@/components/ExportModal";
import { calculateCompoundInterest, calculateYearsToGoal, calculateYearsToDouble } from "@/lib/calculations";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/formatters";
import { exportToCSV, generateShareableUrl, parseUrlParams } from "@/lib/export";
import type { Scenario, Goal, CalculationResult } from "@/types";

const PRESETS: Scenario[] = [
  { name: "S&P 500", emoji: "📈", return: 10.5, desc: "Promedio histórico anual", color: "#4f9eff" },
  { name: "Bitcoin", emoji: "₿", return: 60, desc: "Promedio 2015–2024", color: "#f5c842" },
  { name: "Nasdaq 100", emoji: "💻", return: 15.2, desc: "Promedio histórico anual", color: "#a78bfa" },
  { name: "Bonos USD", emoji: "🏛️", return: 4.5, desc: "Bonos del Tesoro 10Y", color: "#fb923c" },
  { name: "Plazo Fijo AR", emoji: "🇦🇷", return: 90, desc: "Tasa anual promedio 2024", color: "#f87171" },
  { name: "Índice Global", emoji: "🌍", return: 9.2, desc: "MSCI World promedio", color: "#34d399" },
];

const GOALS: Goal[] = [
  { label: "100K", value: 100_000 },
  { label: "500K", value: 500_000 },
  { label: "1M", value: 1_000_000 },
  { label: "5M", value: 5_000_000 },
];

export default function Home() {
  // Main parameters
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(20);

  // Advanced settings
  const [inflationRate, setInflationRate] = useState(0);
  const [monthlyIncrease, setMonthlyIncrease] = useState(0);
  const [monthlyIncreaseType, setMonthlyIncreaseType] = useState<'percent' | 'fixed'>('percent');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // UI state
  const [activePreset, setActivePreset] = useState(0);
  const [goalTarget, setGoalTarget] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    const params = parseUrlParams(window.location.search);
    if (params) {
      if (params.initial) setInitial(params.initial);
      if (params.monthly) setMonthly(params.monthly);
      if (params.rate) setRate(params.rate);
      if (params.years) setYears(params.years);
      if (params.inflationRate) setInflationRate(params.inflationRate);
      if (params.monthlyIncrease) setMonthlyIncrease(params.monthlyIncrease);
    }
  }, []);

  // Calculate results
  const result: CalculationResult = calculateCompoundInterest({
    initial,
    monthly,
    rate,
    years,
    inflationRate,
    monthlyIncrease,
    monthlyIncreaseType,
  });

  const data = result.data;
  const finalData = data[data.length - 1];
  const totalInvested = initial + monthly * 12 * years + (monthlyIncrease > 0
    ? calculateTotalIncreases(monthly, monthlyIncrease, monthlyIncreaseType, years)
    : 0);
  const totalReturn = finalData.balance - totalInvested;
  const multiplier = totalInvested > 0 ? finalData.balance / totalInvested : 1;
  const yearsToDouble = calculateYearsToDouble(initial, monthly, rate);
  const cagr = calculateCAGR(initial, finalData.balance, years);

  // Goal calculation
  const goalRefYear = goalTarget != null
    ? calculateYearsToGoal(initial, monthly, rate, goalTarget, monthlyIncrease, monthlyIncreaseType)
    : null;

  const applyPreset = (i: number) => {
    setActivePreset(i);
    setRate(PRESETS[i].return);
  };

  const handleShare = () => {
    const url = generateShareableUrl({ initial, monthly, rate, years, inflationRate, monthlyIncrease });
    navigator.clipboard.writeText(url);
  };

  const handleExportCSV = () => {
    exportToCSV(data, `compoundly-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const showRealValues = inflationRate > 0;
  const displayBalance = showRealValues ? (result.realFinalBalance ?? result.finalBalance) : result.finalBalance;
  const displayInvested = showRealValues ? (result.realTotalInvested ?? result.totalInvested) : result.totalInvested;
  const displayInterest = showRealValues ? (result.realTotalInterest ?? result.totalInterest) : result.totalInterest;

  return (
    <main className="main-container">
      {/* Background */}
      <div className="background-gradient" />

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-badge">
            <span>◇</span> SIMULADOR DE INTERÉS COMPUESTO
          </div>
          <h1 className="header-title">
            <span className="text-white">compound</span>
            <span className="text-accent">ly</span>
          </h1>
          <p className="header-description">
            El dinero que no trabajás gana más que vos. Descubrí cuánto.
          </p>
          <div className="header-actions">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showAdvanced)}>
              {showAdvanced ? '◀' : '⚙'} {showAdvanced ? 'Ocultar' : 'Ajustes'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowExportModal(true)}>
              📥 Exportar
            </Button>
          </div>
        </header>

        {/* Settings Panel */}
        <SettingsPanel
          inflationRate={inflationRate}
          onInflationRateChange={setInflationRate}
          monthlyIncrease={monthlyIncrease}
          onMonthlyIncreaseChange={setMonthlyIncrease}
          monthlyIncreaseType={monthlyIncreaseType}
          onMonthlyIncreaseTypeChange={setMonthlyIncreaseType}
          showAdvanced={showAdvanced}
          onShowAdvancedChange={setShowAdvanced}
        />

        {/* Main Grid */}
        <div className="main-grid">
          {/* Inputs Card */}
          <Card title="PARÁMETROS" className="inputs-card">
            <div className="sliders-group">
              <Slider
                label="Capital inicial"
                value={initial}
                onChange={setInitial}
                min={0}
                max={500000}
                step={500}
                decimals={0}
                prefix="$"
                color="#00e5a0"
                icon="💰"
              />
              <Slider
                label="Aporte mensual"
                value={monthly}
                onChange={setMonthly}
                min={0}
                max={20000}
                step={50}
                decimals={0}
                prefix="$"
                color="#4f9eff"
                icon="📅"
              />
              <Slider
                label="Retorno anual"
                value={rate}
                onChange={(v) => { setRate(v); setActivePreset(-1); }}
                min={0.1}
                max={150}
                step={0.1}
                decimals={2}
                suffix="%"
                color="#f5c842"
                icon="📊"
              />
              <Slider
                label="Horizonte temporal"
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                step={1}
                decimals={0}
                suffix=" años"
                color="#a78bfa"
                icon="⏱"
              />
            </div>
          </Card>

          {/* Results Card */}
          <Card className="results-card">
            <div className="results-header">
              <SectionLabel>RESULTADO EN {years} AÑOS</SectionLabel>
              {inflationRate > 0 && (
                <span className="inflation-badge">ajustado por inflación</span>
              )}
            </div>

            <div className="result-amount">{formatCompact(displayBalance)}</div>
            <div className="result-amount-full">{formatCurrency(displayBalance)}</div>

            <div className="stats-grid">
              <StatCard
                label={showRealValues ? "Invertido (real)" : "Invertido"}
                value={formatCompact(displayInvested)}
                color="#9090a8"
              />
              <StatCard
                label={showRealValues ? "Ganaste (real)" : "Ganaste"}
                value={formatCompact(Math.max(0, displayInterest))}
                color="#00e5a0"
              />
              <StatCard
                label="Multiplicás"
                value={`${multiplier.toFixed(2)}x`}
                color="#f5c842"
              />
              {yearsToDouble && (
                <StatCard
                  label="Dobla en"
                  value={`${yearsToDouble.toFixed(1)} años`}
                  color="#34d399"
                />
              )}
            </div>

            {/* Goal Finder */}
            <GoalFinder
              initial={initial}
              monthly={monthly}
              rate={rate}
              goalTarget={goalTarget}
              onGoalSelect={setGoalTarget}
              goals={GOALS}
            />
          </Card>
        </div>

        {/* Presets */}
        <Card title="INVERSIONES POPULARES">
          <div className="scenario-grid">
            {PRESETS.map((preset, i) => (
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
                <div
                  className="scenario-name"
                  style={{ color: activePreset === i ? preset.color : undefined }}
                >
                  {preset.name}
                </div>
                <div className="scenario-desc">{preset.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chart */}
        <Card title="PROYECCIÓN DE CRECIMIENTO">
          <div className="chart-info">
            <div className="chart-title">
              {years} años · {rate}% anual
              {monthly > 0 && (
                <span className="chart-monthly"> · ${monthly.toLocaleString()} / mes</span>
              )}
              {monthlyIncrease > 0 && (
                <span className="chart-increase">
                  {' '}· +{monthlyIncrease}{monthlyIncreaseType === 'percent' ? '%' : '$'} anual
                </span>
              )}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#9090a8' }} />
                <span>Invertido</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#00e5a0' }} />
                <span>Ganancias</span>
              </div>
              {inflationRate > 0 && (
                <div className="legend-item">
                  <span style={{ fontSize: 10, color: '#ff8a65' }}>(valores reales)</span>
                </div>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                tickFormatter={(v) => `${v}y`}
              />
              <YAxis
                stroke="none"
                tick={{ fill: '#5a5a72', fontSize: 11, fontFamily: 'DM Mono' }}
                tickFormatter={(v) => formatCompact(v)}
                width={56}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={showRealValues ? 'realInvested' : 'invested'}
                stackId="1"
                stroke="#9090a8"
                strokeWidth={2}
                fill="url(#inv)"
              />
              <Area
                type="monotone"
                dataKey={showRealValues ? 'realInterest' : 'interest'}
                stackId="1"
                stroke="#00e5a0"
                strokeWidth={2.5}
                fill="url(#int)"
              />
              {goalTarget != null && goalRefYear !== null && goalRefYear > 0 && (
                <ReferenceLine
                  x={Math.round(goalRefYear)}
                  stroke="#f5c842"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: GOALS.find((g) => g.value === goalTarget)?.label || '',
                    fill: '#f5c842',
                    fontSize: 10,
                    fontFamily: 'DM Mono',
                    position: 'top',
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Year Table */}
        <Card title="RESUMEN AÑO A AÑO">
          <YearTable
            data={data}
            goalYear={goalRefYear}
            goalLabel={goalTarget ? GOALS.find((g) => g.value === goalTarget)?.label : undefined}
            showReal={showRealValues}
          />
        </Card>

        {/* Footer */}
        <footer className="footer">
          <div>compoundly · simulador de interés compuesto</div>
          <div className="footer-disclaimer">
            Los retornos pasados no garantizan resultados futuros. Solo educacional.
          </div>
        </footer>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={data}
        params={{ initial, monthly, rate, years }}
      />
    </main>
  );
}

/* ─────────────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const invested = payload.find((p: any) => p.dataKey === 'invested' || p.dataKey === 'realInvested')?.value || 0;
  const interest = payload.find((p: any) => p.dataKey === 'interest' || p.dataKey === 'realInterest')?.value || 0;
  const total = invested + interest;

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

// Helper functions
function calculateTotalIncreases(
  monthly: number,
  increase: number,
  type: 'percent' | 'fixed',
  years: number
): number {
  let total = 0;
  let contribution = monthly;
  for (let year = 1; year <= years; year++) {
    if (type === 'percent') {
      contribution = contribution * (1 + increase / 100);
    } else {
      contribution = contribution + increase;
    }
    total += contribution * 12;
  }
  return total - monthly * 12 * years;
}

function calculateCAGR(initial: number, final: number, years: number): number {
  if (years <= 0 || initial <= 0) return 0;
  return (Math.pow(final / initial, 1 / years) - 1) * 100;
}
