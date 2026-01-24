# AI Infrastructure Investment Dashboard - Project Documentation

**Last Updated:** January 24, 2026
**Status:** Complete - Deployed
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [All Sectors & Assets](#all-sectors--assets)
6. [Stock Detail System](#stock-detail-system)
7. [How to Run](#how-to-run)
8. [Deployment](#deployment)

---

## Project Overview

### Purpose
A comprehensive investment research dashboard for tracking AI infrastructure opportunities across multiple sectors. The dashboard provides deep analysis of 80+ assets including stocks, ETFs, commodities, and crypto related to the AI revolution.

### Key Features
- Track 80+ assets across 13 AI-related sectors
- Clickable stock cards with slide-out quick view panel
- Full detail pages with 5 analysis tabs per stock
- Opportunity and risk analysis for each asset
- Investment scores, catalysts, and red flags
- Peer comparison tools
- Responsive design with dark theme

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 7.3.1 | Build Tool / Dev Server |
| Tailwind CSS | 4.x | Styling |
| Recharts | 2.x | Charts (Radar, Bar, Scatter, etc.) |
| Lucide React | Latest | Icons |
| React Router DOM | 7.x | Page Navigation |

---

## Project Structure

```
/Users/hieuc./AI Research Dashboard/
├── CLAUDE.md                         # Claude Code context file
├── PROJECT_DOCUMENTATION.md          # This file
├── QUICK_REFERENCE.md                # Quick reference cheat sheet
├── ai-stocks-dashboard.jsx           # Original component (backup)
└── dashboard-preview/                # Main Vite React project
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .gitignore
    └── src/
        ├── main.jsx                  # App entry point with React Router
        ├── App.jsx                   # Root component
        ├── AIDashboard.jsx           # Main dashboard (~890 lines)
        ├── index.css                 # Tailwind CSS imports
        ├── App.css
        ├── components/
        │   └── StockDetailPanel.jsx  # Slide-out panel (280 lines)
        ├── pages/
        │   └── StockDetailPage.jsx   # Full detail page (520 lines)
        └── data/
            └── stocksData.js         # Shared stock data (200 lines)
```

---

## Features

### Dashboard Tabs
1. **Overview** - Key metrics, top opportunities, radar chart, scatter plot
2. **Sectors** - Browse 80+ assets by 13 sectors (clickable cards)
3. **Opportunities** - Highest growth, best value, highest upside lists
4. **Analysis** - Investment themes, market context, risk factors

### Stock Detail Panel (Quick View)
When clicking a stock card, a slide-out panel shows:
- Header with price, score, analyst rating
- Key metrics grid (Market Cap, P/E, Forward P/E, Revenue Growth)
- AI Revenue exposure bar
- Opportunity & Risk summaries
- Quick Assessment (Valuation, Growth, Upside ratings)
- "View Full Analysis" button

### Stock Detail Page (Full Analysis)
Navigate to `/stock/:ticker` for comprehensive analysis with 5 tabs:

| Tab | Contents |
|-----|----------|
| **Overview** | Investment profile radar chart, opportunity/risk, key metrics, AI exposure |
| **Financials** | Valuation metrics, growth metrics, data limitations note |
| **Catalysts** | Potential catalysts, bullish signals, bearish signals to watch |
| **Risks** | Primary risk, detailed risk analysis, red flags to monitor |
| **Compare** | Peer comparison table, score comparison bar chart |

### Key Metrics Displayed
- Total Market Cap: $19.1T
- Assets Tracked: 80+
- Sectors: 13
- Average Revenue Growth: 28%
- Average Upside: 23%

---

## All Sectors & Assets

### Sector Summary (13 Total)

| # | Sector | Key | Assets | Color |
|---|--------|-----|--------|-------|
| 1 | Chip Manufacturers | chipManufacturers | 10 | Purple |
| 2 | Data Centers | dataCenters | 7 | Cyan |
| 3 | Data Storage | dataStorage | 7 | Green |
| 4 | Cooling | cooling | 7 | Amber |
| 5 | Energy | energy | 9 | Red |
| 6 | AI Software | aiSoftware | 6 | Blue |
| 7 | Robotics | robotics | 6 | Pink |
| 8 | Autonomous Vehicles | autonomousVehicles | 4 | Orange |
| 9 | Cybersecurity | cybersecurity | 5 | Teal |
| 10 | Healthcare AI | healthcareAI | 5 | Rose |
| 11 | Commodities | commodities | 6 | Violet |
| 12 | AI ETFs | etfs | 5 | Indigo |
| 13 | AI Crypto | crypto | 4 | Yellow |

### Top Opportunities
1. NVIDIA (NVDA) - Score: 95
2. SK Hynix (000660.KS) - Score: 92
3. Vertiv (VRT) - Score: 90
4. TSMC (TSM) - Score: 90
5. CrowdStrike (CRWD) - Score: 88
6. Intuitive Surgical (ISRG) - Score: 88
7. Palantir (PLTR) - Score: 88
8. Broadcom (AVGO) - Score: 88

---

## Stock Detail System

### Architecture: Hybrid Approach

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (/)                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stock Cards Grid                                    │   │
│  │  [Click any card]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Slide-Out Panel (Quick View)                       │   │
│  │  • Price, Score, Rating                             │   │
│  │  • Key Metrics                                      │   │
│  │  • Opportunity/Risk                                 │   │
│  │  • [View Full Analysis] button                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Full Detail Page (/stock/:ticker)                  │   │
│  │  Tabs: Overview | Financials | Catalysts | Risks    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `App.jsx` → `AIDashboard.jsx` | Main dashboard |
| `/stock/:ticker` | `StockDetailPage.jsx` | Individual stock analysis |

---

## How to Run

### Development Server
```bash
cd "/Users/hieuc./AI Research Dashboard/dashboard-preview"
npm run dev
```
**Access at:** http://localhost:5173/

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Deployment

### Vercel
- **URL:** [To be added after deployment]
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### GitHub
- **Repository:** [To be added after push]

---

## Investment Themes (2026)

1. **Memory Supercycle** - DRAM/NAND surge, HBM demand
2. **Humanoid Robot Revolution** - $38B market by 2035
3. **AI Cybersecurity Arms Race** - $520B+ spending
4. **Copper Supply Crunch** - 30% gap by 2035
5. **Enterprise AI Platform Wars** - Palantir, Microsoft, Salesforce
6. **Autonomous Trucking Commercialization** - Aurora, Mobileye

---

## Data Sources

- Public filings (10-K, 10-Q)
- Analyst reports (Morgan Stanley, Goldman Sachs, etc.)
- Market research (Gartner, Forrester, IDC)
- Company investor presentations
- Industry publications

---

## Disclaimer

This dashboard is for informational purposes only and does not constitute investment advice. Always do your own research before making investment decisions.

---

*Documentation last updated: January 24, 2026*
