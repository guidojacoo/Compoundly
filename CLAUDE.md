# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Compoundly** — Aplicación web de simulación de interés compuesto. Permite proyectar inversiones con aportes mensuales, tasas personalizadas, ajuste por inflación e incremento de aportes.

**Demo:** https://compoundlyy.vercel.app/

## Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture

- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS custom properties + Tailwind CSS v4
- **Charts:** Recharts
- **Path Alias:** `@/*` → root directory

## Project Structure

```
invex/
├── app/
│   ├── page.tsx          # Main page, orchestrates all components
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Design system, component styles
├── components/           # Reusable UI components
│   ├── Slider.tsx        # Numeric slider + input
│   ├── Card.tsx          # Card, StatCard, SectionLabel
│   ├── Toggle.tsx        # Boolean toggle switch
│   ├── Button.tsx        # Button with variants
│   ├── Modal.tsx         # Modal dialog
│   ├── YearTable.tsx     # Year-by-year breakdown table
│   ├── GoalFinder.tsx    # Goal target selector
│   ├── SettingsPanel.tsx # Advanced settings (inflation, increases)
│   └── ExportModal.tsx   # Export/share modal
├── lib/                  # Pure functions, utilities
│   ├── calculations.ts   # Compound interest, years-to-goal, CAGR
│   ├── formatters.ts     # Currency, percent, compact number formatting
│   └── export.ts         # CSV export, URL share generation/parsing
├── hooks/                # React hooks
│   ├── useCompoundCalculation.ts  # Memoized calculation hook
│   └── useGoalCalculation.ts      # Memoized goal calculation hook
└── types/                # TypeScript types
    └── index.ts          # Shared interfaces
```

## Key Features

### Core Calculations (`lib/calculations.ts`)
- `calculateCompoundInterest()` — Main projection with inflation & contribution increases
- `calculateYearsToGoal()` — Years to reach a target amount
- `calculateYearsToDouble()` — Rule of 72-style doubling time
- `calculateCAGR()` — Compound annual growth rate

### Advanced Settings
- **Inflation adjustment:** Real vs nominal values
- **Contribution increases:** Annual % or fixed amount bumps

### Export & Share
- CSV export with full year-by-year data
- Shareable URLs with encoded parameters

## Design System

**Colors:**
- Background: `#0a0a0f`
- Accent: `#00e5a0` (teal), `#f5c842` (gold)
- Secondary: `#4f9eff` (blue), `#a78bfa` (purple)

**Fonts:**
- Headings: Syne
- Data/Numbers: DM Mono

**Key CSS Classes:**
- `.card`, `.btn`, `.slider-group`, `.toggle`, `.modal`
- `.scenario-grid`, `.goal-buttons`, `.year-table`

## Development Notes

- All components are `"use client"` (interactive UI)
- Calculations are memoized via hooks to avoid recomputation
- URL params are parsed on mount for shareable links
- Responsive: breaks to single column at 900px, scenario cards stack at 480px
