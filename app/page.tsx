"use client";
import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

const PRESETS = [
  { name: "S&P 500",      emoji: "📈", return: 10.5, desc: "Promedio histórico anual",  color: "#4f9eff" },
  { name: "Bitcoin",      emoji: "₿",  return: 60,   desc: "Promedio 2015–2024",        color: "#f5c842" },
  { name: "Nasdaq 100",   emoji: "💻", return: 15.2, desc: "Promedio histórico anual",  color: "#a78bfa" },
  { name: "Bonos USD",    emoji: "🏛️", return: 4.5,  desc: "Bonos del Tesoro 10Y",     color: "#fb923c" },
  { name: "Plazo Fijo AR",emoji: "🇦🇷",return: 90,   desc: "Tasa anual promedio 2024", color: "#f87171" },
  { name: "Índice Global",emoji: "🌍", return: 9.2,  desc: "MSCI World promedio",       color: "#34d399" },
];

const GOALS = [
  { label: "100K", value: 100_000 },
  { label: "500K", value: 500_000 },
  { label: "1M",   value: 1_000_000 },
  { label: "5M",   value: 5_000_000 },
];

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  }).format(n);
}

function yearsToGoal(initial: number, monthly: number, rate: number, goal: number): number | null {
  if (initial >= goal) return 0;
  if (rate <= 0 && monthly <= 0) return null;
  let balance = initial;
  let r = rate / 100 / 12;
  for (let m = 1; m <= 1200; m++) {
    balance = balance * (1 + r) + monthly;
    if (balance >= goal) return m / 12;
  }
  return null;
}

function calcData(initial: number, monthly: number, rate: number, years: number) {
  let balance = initial;
  let invested = initial;
  let r = rate / 100 / 12;
  let data = [{ year: 0, balance: initial, invested: initial, interest: 0 }];
  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + r) + monthly;
    invested += monthly;
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        balance: Math.round(balance),
        invested: Math.round(invested),
        interest: Math.round(balance - invested),
      });
    }
  }
  return data;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  let total = (payload[0]?.value || 0) + (payload[1]?.value || 0);
  return (
    <div style={{
      background: "#1a1a24", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, padding: "12px 16px",
      fontFamily: "DM Mono, monospace", fontSize: 12, minWidth: 180
    }}>
      <div style={{ color: "#5a5a72", marginBottom: 8 }}>Año {label}</div>
      <div style={{ color: "#00e5a0", marginBottom: 4 }}>Total: {fmtFull(total)}</div>
      <div style={{ color: "#9090a8", marginBottom: 4 }}>Invertido: {fmtFull(payload[0]?.value || 0)}</div>
      <div style={{ color: "#00e5a0" }}>Ganancias: {fmtFull(payload[1]?.value || 0)}</div>
    </div>
  );
};

export default function Home() {
  let [initial, setInitial] = useState(10000);
  let [monthly, setMonthly] = useState(500);
  let [rate,    setRate]    = useState(10.5);
  let [years,   setYears]   = useState(20);
  let [activePreset, setActivePreset] = useState(0);
  let [goalTarget,   setGoalTarget]   = useState<number | null>(null);
  let [expanded,     setExpanded]     = useState(false);

  let data      = calcData(initial, monthly, rate, years);
  let finalData = data[data.length - 1];
  let totalInvested = initial + monthly * years * 12;
  let totalReturn   = finalData.balance - totalInvested;
  let multiplier    = totalInvested > 0 ? finalData.balance / totalInvested : 1;

  let applyPreset = (i: number) => {
    setActivePreset(i);
    setRate(PRESETS[i].return);
  };

  let goalRefYear = goalTarget != null
    ? yearsToGoal(initial, monthly, rate, goalTarget)
    : null;

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(0,229,160,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(79,158,255,0.05) 0%, transparent 60%),
          #0a0a0f
        `
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Header ── */}
        <header style={{ paddingTop: 52, paddingBottom: 44, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
            borderRadius: 100, padding: "5px 14px", marginBottom: 20,
            fontSize: 11, color: "#00e5a0", fontFamily: "DM Mono, monospace", letterSpacing: "0.1em"
          }}>
            ◆ SIMULADOR DE INTERÉS COMPUESTO
          </div>
          <h1 style={{
            fontSize: "clamp(42px, 7vw, 76px)", fontWeight: 800,
            lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 14
          }}>
            <span style={{ color: "#f0f0f8" }}>compound</span>
            <span style={{ color: "#00e5a0" }}>ly</span>
          </h1>
          <p style={{ color: "#9090a8", fontSize: 15, maxWidth: 440, margin: "0 auto" }}>
            El dinero que no trabajás gana más que vos. Descubrí cuánto.
          </p>
        </header>

        {/* ── Main 2-col ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

          {/* Inputs */}
          <div style={card}>
            <SectionLabel>PARÁMETROS</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 20 }}>
              <NumSlider label="Capital inicial"   value={initial} onChange={setInitial}
                min={0}   max={500000} step={500}  decimals={0} prefix="$" color="#00e5a0" />
              <NumSlider label="Aporte mensual"    value={monthly} onChange={setMonthly}
                min={0}   max={20000}  step={50}   decimals={0} prefix="$" color="#4f9eff" />
              <NumSlider label="Retorno anual"     value={rate}    onChange={(v) => { setRate(v); setActivePreset(-1); }}
                min={0.1} max={150}    step={0.1}  decimals={2} suffix="%" color="#f5c842" />
              <NumSlider label="Horizonte temporal" value={years}  onChange={setYears}
                min={1}   max={50}     step={1}    decimals={0} suffix=" años" color="#a78bfa" />
            </div>
          </div>

          {/* Results */}
          <div style={{ ...card, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <SectionLabel>RESULTADO EN {years} AÑOS</SectionLabel>
              <div style={{
                fontSize: "clamp(30px, 4.5vw, 50px)", fontWeight: 800, color: "#00e5a0",
                lineHeight: 1.1, letterSpacing: "-0.03em",
                marginTop: 16, marginBottom: 4, fontFamily: "DM Mono, monospace"
              }}>
                {fmt(finalData.balance)}
              </div>
              <div style={{ color: "#5a5a72", fontSize: 12, fontFamily: "DM Mono, monospace", marginBottom: 20 }}>
                {fmtFull(finalData.balance)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <MiniStat label="Invertiste" value={fmt(totalInvested)}         color="#9090a8" />
                <MiniStat label="Ganaste"    value={fmt(Math.max(0,totalReturn))} color="#00e5a0" />
                <MiniStat label="Multiplicás" value={`${multiplier.toFixed(1)}x`} color="#f5c842" />
              </div>
            </div>

            {/* Goal finder */}
            <div style={{
              marginTop: 20, background: "#0a0a0f",
              borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.07)"
            }}>
              <div style={{ fontSize: 10, color: "#5a5a72", fontFamily: "DM Mono, monospace", letterSpacing: "0.08em", marginBottom: 10 }}>
                ¿CUÁNTO PARA LLEGAR A...?
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {GOALS.map(g => {
                  let yrs    = yearsToGoal(initial, monthly, rate, g.value);
                  let active = goalTarget === g.value;
                  return (
                    <button key={g.label} onClick={() => setGoalTarget(active ? null : g.value)}
                      style={{
                        padding: "7px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                        fontFamily: "DM Mono, monospace",
                        background: active ? "rgba(0,229,160,0.08)" : "transparent",
                        border: `1px solid ${active ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.07)"}`,
                        color: active ? "#00e5a0" : "#9090a8", transition: "all 0.15s"
                      }}>
                      {g.label}
                      {yrs === 0    && <span style={{ marginLeft: 6, color: "#00e5a0" }}>✓ ya</span>}
                      {yrs !== null && yrs > 0 &&
                        <span style={{ marginLeft: 6, color: active ? "#00e5a0" : "#5a5a72" }}>→ {yrs.toFixed(1)}y</span>}
                      {yrs === null && <span style={{ marginLeft: 6, color: "#ff5f7e", fontSize: 10 }}>∞</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Presets ── */}
        <div style={{ ...card, marginBottom: 14 }}>
          <SectionLabel>INVERSIONES POPULARES</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 16 }}>
            {PRESETS.map((p, i) => (
              <button key={p.name} onClick={() => applyPreset(i)}
                style={{
                  padding: "14px 12px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                  background: activePreset === i ? `${p.color}12` : "#0a0a0f",
                  border: `1px solid ${activePreset === i ? `${p.color}50` : "rgba(255,255,255,0.07)"}`,
                  transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 6
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, fontWeight: 500, color: activePreset === i ? p.color : "#9090a8" }}>
                    {p.return}%
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activePreset === i ? p.color : "#f0f0f8" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#5a5a72", lineHeight: 1.3 }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chart ── */}
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <SectionLabel>PROYECCIÓN DE CRECIMIENTO</SectionLabel>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                {years} años · {rate}% anual
                {monthly > 0 && <span style={{ color: "#5a5a72", fontWeight: 400, fontSize: 13 }}> · ${monthly.toLocaleString()} / mes</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, fontFamily: "DM Mono, monospace" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a5a72" }} />
                <span style={{ color: "#5a5a72" }}>Invertido</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5a0" }} />
                <span style={{ color: "#9090a8" }}>Ganancias</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="inv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#9090a8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#9090a8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="int" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" stroke="none"
                tick={{ fill: "#5a5a72", fontSize: 11, fontFamily: "DM Mono" }}
                tickFormatter={v => `${v}y`} />
              <YAxis stroke="none"
                tick={{ fill: "#5a5a72", fontSize: 11, fontFamily: "DM Mono" }}
                tickFormatter={v => fmt(v)} width={64} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="invested" stackId="1"
                stroke="#9090a8" strokeWidth={1.5} fill="url(#inv)" />
              <Area type="monotone" dataKey="interest" stackId="1"
                stroke="#00e5a0" strokeWidth={2} fill="url(#int)" />
              {goalTarget != null && goalRefYear !== null && goalRefYear > 0 && (
                <ReferenceLine
                  x={Math.round(goalRefYear)}
                  stroke="#f5c842" strokeDasharray="4 4" strokeWidth={1.5}
                  label={{
                    value: GOALS.find(g => g.value === goalTarget)?.label || "",
                    fill: "#f5c842", fontSize: 11, fontFamily: "DM Mono", position: "top"
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Year table ── */}
        <div style={{ ...card, overflow: "hidden", padding: 0 }}>
          <div style={{
            padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <SectionLabel>RESUMEN AÑO A AÑO</SectionLabel>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "DM Mono, monospace", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["Año","Balance","Invertido","Ganancias","Retorno acum."].map((h, hi) => (
                    <th key={h} style={{
                      padding: "12px 24px", textAlign: hi === 0 ? "left" : "right",
                      color: "#5a5a72", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(expanded ? data : data.slice(0, 6)).map((row, i) => {
                  let returnPct  = row.invested > 0 ? ((row.balance - row.invested) / row.invested * 100) : 0;
                  let isGoalYear = goalTarget != null && goalRefYear !== null && Math.round(goalRefYear) === row.year;
                  return (
                    <tr key={row.year} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: isGoalYear ? "rgba(245,200,66,0.04)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"
                    }}>
                      <td style={{ padding: "13px 24px", color: isGoalYear ? "#f5c842" : "#9090a8" }}>
                        {row.year === 0 ? "Inicio" : `Año ${row.year}`}
                        {isGoalYear && <span style={{ marginLeft: 8, fontSize: 10, color: "#f5c842" }}>★ META</span>}
                      </td>
                      <td style={{ padding: "13px 24px", textAlign: "right", color: "#00e5a0", fontWeight: 500 }}>
                        {fmtFull(row.balance)}
                      </td>
                      <td style={{ padding: "13px 24px", textAlign: "right", color: "#9090a8" }}>
                        {fmtFull(row.invested)}
                      </td>
                      <td style={{ padding: "13px 24px", textAlign: "right", color: row.interest >= 0 ? "#00e5a0" : "#ff5f7e" }}>
                        {row.interest >= 0 ? "+" : ""}{fmtFull(row.interest)}
                      </td>
                      <td style={{ padding: "13px 24px", textAlign: "right", color: "#f5c842" }}>
                        {returnPct >= 0 ? "+" : ""}{returnPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {data.length > 6 && (
            <button onClick={() => setExpanded(!expanded)}
              style={{
                width: "100%", padding: 14, background: "#0a0a0f",
                border: "none", borderTop: "1px solid rgba(255,255,255,0.07)",
                color: "#9090a8", cursor: "pointer",
                fontFamily: "DM Mono, monospace", fontSize: 11, letterSpacing: "0.08em", transition: "color 0.15s"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00e5a0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9090a8")}
            >
              {expanded ? "▲ MOSTRAR MENOS" : `▼ VER TODOS LOS ${data.length - 1} AÑOS`}
            </button>
          )}
        </div>

        <footer style={{ textAlign: "center", paddingTop: 48, color: "#5a5a72", fontSize: 11, fontFamily: "DM Mono, monospace" }}>
          <div style={{ marginBottom: 6 }}>compoundly · simulador de interés compuesto</div>
          <div style={{ opacity: 0.6 }}>Los retornos pasados no garantizan resultados futuros. Solo educacional.</div>
        </footer>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────── */

const card: React.CSSProperties = {
  background: "#111118",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: 28,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: "#5a5a72", fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}>
      {children}
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#0a0a0f", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: 10, color: "#5a5a72", fontFamily: "DM Mono, monospace", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "DM Mono, monospace" }}>{value}</div>
    </div>
  );
}

/* ── NumSlider: slider + free-text input, sin conflictos ── */
function NumSlider({
  label, value, onChange,
  min, max, step, decimals,
  prefix = "", suffix = "", color
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; decimals: number;
  prefix?: string; suffix?: string; color: string;
}) {
  /* El input de texto guarda su propio string para no interferir mientras se tipea */
  let [text, setText] = useState(value.toString());
  let focused = useRef(false);

  /* Cuando el valor externo cambia (slider, preset) y el input no está enfocado, sincronizamos */
  useEffect(() => {
    if (!focused.current) {
      setText(value % 1 === 0 ? value.toString() : value.toString());
    }
  }, [value]);

  let pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  let commitText = (raw: string) => {
    /* acepta punto o coma como separador decimal */
    let normalized = raw.replace(",", ".");
    let parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      let clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setText(clamped.toString());
    } else {
      setText(value.toString());
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "#5a5a72", fontFamily: "DM Mono, monospace", letterSpacing: "0.08em" }}>
          {label.toUpperCase()}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {prefix && <span style={{ color, fontFamily: "DM Mono, monospace", fontSize: 15, fontWeight: 500 }}>{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onFocus={() => { focused.current = true; }}
            onBlur={() => { focused.current = false; commitText(text); }}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            style={{
              background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "5px 10px", color,
              fontFamily: "DM Mono, monospace", fontSize: 16, fontWeight: 500,
              width: suffix ? 100 : 120, outline: "none", textAlign: "right"
            }}
          />
          {suffix && <span style={{ color, fontFamily: "DM Mono, monospace", fontSize: 13 }}>{suffix}</span>}
        </div>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 4, background: "#1a1a24", borderRadius: 4, cursor: "pointer" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`, background: color, borderRadius: 4,
          transition: "width 0.06s", pointerEvents: "none"
        }} />
        {/* Thumb dot */}
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: color, border: "2px solid #111118",
          pointerEvents: "none", transition: "left 0.06s",
          boxShadow: `0 0 8px ${color}80`
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => {
            let v = parseFloat(e.target.value);
            onChange(v);
            setText(decimals > 0 ? v.toString() : Math.round(v).toString());
          }}
          style={{
            position: "absolute", inset: "-10px 0",
            opacity: 0, cursor: "pointer", width: "100%", height: 24, margin: 0
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, color: "#3a3a50", fontFamily: "DM Mono, monospace" }}>
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}
