# AI Dashboard - Quick Reference

## Quick Start
```bash
cd "/Users/hieuc./AI Research Dashboard/dashboard-preview"
npm run dev
# Open http://localhost:5173/
```

## Status: COMPLETE v1.0.0
**Last Updated:** January 24, 2026

## What's Built
- [x] Dashboard with 13 sectors, 80+ assets
- [x] Overview, Sectors, Opportunities, Analysis tabs
- [x] Clickable stock cards
- [x] Slide-out panel for quick view
- [x] Full detail pages with 5 tabs per stock
- [x] React Router for navigation
- [x] Peer comparison tools
- [x] Catalyst tracking
- [x] Risk analysis

## Routes
| Route | Description |
|-------|-------------|
| `/` | Main dashboard |
| `/stock/:ticker` | Stock detail page (e.g., `/stock/NVDA`) |

## Key Files
| File | Purpose |
|------|---------|
| `src/AIDashboard.jsx` | Main dashboard (~890 lines) |
| `src/components/StockDetailPanel.jsx` | Slide-out panel |
| `src/pages/StockDetailPage.jsx` | Full detail page |
| `src/data/stocksData.js` | Shared stock data |

## 13 Sectors (81 Assets)
1. Chip Manufacturers (10) - NVDA, AMD, AVGO, TSM...
2. Data Centers (7) - EQIX, DLR, DDOG, VRT...
3. Data Storage (7) - MU, SK Hynix, WDC...
4. Cooling (7) - VRT, MOD, TT...
5. Energy (9) - CEG, VST, NEE, CCJ...
6. AI Software (6) - PLTR, CRM, SNOW...
7. Robotics (6) - ISRG, SYM, TSLA...
8. Autonomous Vehicles (4) - MBLY, AUR, GOOGL...
9. Cybersecurity (5) - CRWD, PANW, ZS...
10. Healthcare AI (5) - TEM, RXRX, VEEV...
11. Commodities (6) - FCX, SCCO, ALB, MP...
12. AI ETFs (5) - AIQ, BOTZ, ROBO...
13. AI Crypto (4) - RNDR, FET, TAO...

## User Flow
```
Dashboard → Click Stock Card → Slide-Out Panel → Click "View Full Analysis" → Detail Page
```

## Build Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment
- **Platform:** Vercel
- **Build:** `npm run build`
- **Output:** `dist`

See `PROJECT_DOCUMENTATION.md` for complete details.
