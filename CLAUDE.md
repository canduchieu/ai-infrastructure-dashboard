# CLAUDE.md - AI Infrastructure Investment Dashboard

This file provides context for Claude Code when working on this project.

## Project Overview

This is an **AI Infrastructure Investment Dashboard** built with React + Vite. It tracks 80+ assets across 13 sectors related to AI infrastructure investments, including stocks, ETFs, commodities, and crypto.

**Status:** Complete v1.0.0
**Last Updated:** January 24, 2026

## Quick Commands

```bash
# Start development server
cd "/Users/hieuc./AI Research Dashboard/dashboard-preview"
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Dev server URL:** http://localhost:5173/

## Project Structure

```
/Users/hieuc./AI Research Dashboard/
├── CLAUDE.md                         # This file (Claude context)
├── PROJECT_DOCUMENTATION.md          # Full project documentation
├── QUICK_REFERENCE.md                # Quick reference cheat sheet
├── ai-stocks-dashboard.jsx           # Original component (backup)
└── dashboard-preview/                # Main Vite React project
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                  # App entry point with React Router
        ├── App.jsx                   # Root component
        ├── AIDashboard.jsx           # Main dashboard (~890 lines)
        ├── index.css                 # Tailwind CSS
        ├── App.css
        ├── components/
        │   └── StockDetailPanel.jsx  # Slide-out panel for quick view
        ├── pages/
        │   └── StockDetailPage.jsx   # Full detail page (5 tabs)
        └── data/
            └── stocksData.js         # Shared stock data
```

## Tech Stack

- **React 19** - UI framework
- **Vite 7.3** - Build tool / dev server
- **Tailwind CSS 4** - Styling (utility-first)
- **Recharts** - Charts (RadarChart, BarChart, ScatterChart, etc.)
- **Lucide React** - Icons
- **React Router DOM 7** - Page navigation

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `AIDashboard.jsx` | Main dashboard |
| `/stock/:ticker` | `StockDetailPage.jsx` | Individual stock analysis |

## Code Style & Conventions

### React Components
- Functional components with hooks (useState, useMemo)
- Single file components (no separate CSS files)
- Tailwind classes for all styling (no custom CSS)

### Naming Conventions
- **Components:** PascalCase (e.g., `StockDetailPanel`)
- **Files:** PascalCase for components (e.g., `StockDetailPanel.jsx`)
- **Variables:** camelCase (e.g., `stocksData`, `activeSector`)
- **Sector keys:** camelCase (e.g., `chipManufacturers`, `aiSoftware`)

### Data Structure
Stock objects follow this schema:
```javascript
{
  name: 'NVIDIA',
  ticker: 'NVDA',
  marketCap: 4530,           // In billions
  price: 186,
  peRatio: 47,
  forwardPE: 25,
  revenueGrowth: 66,         // Percentage
  analystRating: 'Strong Buy',
  priceTarget: 256,
  upside: 37,                // Percentage
  opportunity: 'String describing the opportunity',
  risk: 'String describing risks',
  aiRevenue: 90,             // Percentage of revenue from AI
  score: 95                  // Investment score 0-100
}
```

### Color Palette (Sector Colors)
```javascript
'#8B5CF6' // Purple - Chip Manufacturers
'#06B6D4' // Cyan - Data Centers
'#10B981' // Green - Data Storage
'#F59E0B' // Amber - Cooling
'#EF4444' // Red - Energy
'#3B82F6' // Blue - AI Software
'#EC4899' // Pink - Robotics
'#F97316' // Orange - Autonomous Vehicles
'#14B8A6' // Teal - Cybersecurity
'#F43F5E' // Rose - Healthcare AI
'#A855F7' // Violet - Commodities
'#6366F1' // Indigo - AI ETFs
'#FBBF24' // Yellow - AI Crypto
```

### UI Patterns
- Dark theme (slate-900 background, slate-800 cards)
- Gradient backgrounds on cards (`bg-gradient-to-br from-slate-800/40 to-slate-900/40`)
- Rounded corners (`rounded-2xl` for cards, `rounded-xl` for inner elements)
- Border styling (`border border-slate-700/30`)
- Backdrop blur (`backdrop-blur-sm`)

## Key Features

### Stock Detail Panel (Slide-Out)
- Opens when clicking a stock card
- Shows price, score, rating, key metrics
- Has "View Full Analysis" button

### Stock Detail Page (Full)
5 tabs:
1. **Overview** - Radar chart, metrics, opportunity/risk
2. **Financials** - Valuation and growth metrics
3. **Catalysts** - Upcoming events, bullish/bearish signals
4. **Risks** - Risk analysis, red flags
5. **Compare** - Peer comparison table

## The 13 Sectors

1. Chip Manufacturers (chipManufacturers) - 10 assets
2. Data Centers (dataCenters) - 7 assets
3. Data Storage (dataStorage) - 7 assets
4. Cooling (cooling) - 7 assets
5. Energy (energy) - 9 assets
6. AI Software (aiSoftware) - 6 assets
7. Robotics (robotics) - 6 assets
8. Autonomous Vehicles (autonomousVehicles) - 4 assets
9. Cybersecurity (cybersecurity) - 5 assets
10. Healthcare AI (healthcareAI) - 5 assets
11. Commodities (commodities) - 6 assets
12. AI ETFs (etfs) - 5 assets
13. AI Crypto (crypto) - 4 assets

## Key Data Objects

Located in `src/data/stocksData.js`:
- `stocksData` - Main object containing all sector arrays
- `sectorSummary` - Aggregated stats per sector
- `topOpportunities` - Best investment picks

## Common Tasks

### Adding a New Stock
Add to the appropriate sector array in `src/data/stocksData.js`:
```javascript
{ name: 'Company', ticker: 'TICK', marketCap: 100, price: 50,
  peRatio: 25, forwardPE: 20, revenueGrowth: 15,
  analystRating: 'Buy', priceTarget: 60, upside: 20,
  opportunity: 'Description...', risk: 'Risks...',
  aiRevenue: 50, score: 75 }
```

### Adding a New Sector
1. Add data array to `stocksData` in `src/data/stocksData.js`
2. Add entry to `sectorSummary` array
3. Add entry to `sectors` array in `AIDashboard.jsx` (with icon)
4. Import new icon from lucide-react

## Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/AIDashboard.jsx` | ~890 | Main dashboard component |
| `src/components/StockDetailPanel.jsx` | ~280 | Slide-out panel |
| `src/pages/StockDetailPage.jsx` | ~520 | Full detail page |
| `src/data/stocksData.js` | ~200 | Shared stock data |
| `src/main.jsx` | ~17 | React entry with Router |

## Don't Forget

- Keep design consistent with existing dark theme
- Use Tailwind classes (no custom CSS)
- Follow existing data structure for stocks
- Test on http://localhost:5173/ after changes
- Stock cards are clickable - opens panel
- Panel has "View Full Analysis" → navigates to /stock/:ticker

## Documentation Files

- `PROJECT_DOCUMENTATION.md` - Complete project details
- `QUICK_REFERENCE.md` - One-page cheat sheet
- `CLAUDE.md` - This file (Claude context)
