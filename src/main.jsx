import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StockDetailPage from './pages/StockDetailPage.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import PrivateCompanyPage from './pages/PrivateCompanyPage.jsx'
import ScreenerPage from './pages/ScreenerPage.jsx'
import EarningsPage from './pages/EarningsPage.jsx'
import ComparisonPage from './pages/ComparisonPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/company/:id" element={<PrivateCompanyPage />} />
        <Route path="/screener" element={<ScreenerPage />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/compare" element={<ComparisonPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
