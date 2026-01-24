import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, TrendingDown, Star, AlertTriangle, Target, Calendar,
  ChevronRight, DollarSign, BarChart2, Activity, Shield, Zap, Clock,
  CheckCircle, XCircle, AlertCircle, Building, Users, FileText, Globe,
  PieChart, Briefcase, TrendingUp as Growth, Bell, ExternalLink
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Import stock data - in a real app this would come from an API/context
import { stocksData } from '../data/stocksData';

const StockDetailPage = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the stock across all sectors
  const { stock, sectorInfo } = useMemo(() => {
    for (const [sectorKey, stocks] of Object.entries(stocksData)) {
      const found = stocks.find(s => s.ticker === ticker);
      if (found) {
        return { stock: found, sectorInfo: { key: sectorKey } };
      }
    }
    return { stock: null, sectorInfo: null };
  }, [ticker]);

  if (!stock) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Stock Not Found</h1>
          <p className="text-slate-400 mb-6">The ticker "{ticker}" was not found in our database.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'financials', label: 'Financials', icon: BarChart2 },
    { id: 'catalysts', label: 'Catalysts', icon: Calendar },
    { id: 'risks', label: 'Risks', icon: AlertTriangle },
    { id: 'comparison', label: 'Compare', icon: Users },
  ];

  // Helper functions
  const getRatingColor = (rating) => {
    if (rating?.includes('Strong Buy')) return 'text-emerald-400';
    if (rating?.includes('Buy')) return 'text-green-400';
    if (rating?.includes('Hold')) return 'text-yellow-400';
    if (rating?.includes('Sell')) return 'text-red-400';
    if (rating?.includes('Speculative')) return 'text-purple-400';
    return 'text-slate-400';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'from-emerald-500 to-green-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 55) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 55) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  // Generate radar chart data based on stock metrics
  const radarData = [
    { metric: 'Growth', value: Math.min(100, (stock.revenueGrowth || 0) * 1.5), fullMark: 100 },
    { metric: 'Value', value: stock.forwardPE ? Math.max(0, 100 - stock.forwardPE) : 50, fullMark: 100 },
    { metric: 'Upside', value: Math.min(100, Math.max(0, stock.upside * 2)), fullMark: 100 },
    { metric: 'AI Exposure', value: stock.aiRevenue || 50, fullMark: 100 },
    { metric: 'Score', value: stock.score || 50, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">{stock.name}</h1>
                <span className="px-2 py-0.5 bg-slate-700/50 rounded text-slate-300 text-sm font-mono">
                  {stock.ticker}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRatingColor(stock.analystRating)} bg-slate-800`}>
                  {stock.analystRating}
                </span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl border ${getScoreBg(stock.score)}`}>
              <div className={`text-xl font-bold bg-gradient-to-r ${getScoreColor(stock.score)} bg-clip-text text-transparent`}>
                {stock.score}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Price Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold text-white">${stock.price}</span>
                <span className={`flex items-center gap-1 text-lg ${stock.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.upside >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {stock.upside >= 0 ? '+' : ''}{stock.upside}%
                </span>
              </div>
              <p className="text-slate-400">
                Price Target: <span className="text-white font-semibold">${stock.priceTarget}</span>
                <span className="text-slate-500 ml-2">|</span>
                <span className="ml-2">Market Cap: <span className="text-white font-semibold">
                  {stock.marketCap >= 1000 ? `$${(stock.marketCap / 1000).toFixed(1)}T` : `$${stock.marketCap}B`}
                </span></span>
              </p>
            </div>
            <div className="flex gap-3">
              <QuickStat label="P/E" value={stock.peRatio || 'N/A'} />
              <QuickStat label="Fwd P/E" value={stock.forwardPE || 'N/A'} />
              <QuickStat label="Growth" value={stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A'} positive={stock.revenueGrowth > 0} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewTab stock={stock} radarData={radarData} />
        )}
        {activeTab === 'financials' && (
          <FinancialsTab stock={stock} />
        )}
        {activeTab === 'catalysts' && (
          <CatalystsTab stock={stock} />
        )}
        {activeTab === 'risks' && (
          <RisksTab stock={stock} />
        )}
        {activeTab === 'comparison' && (
          <ComparisonTab stock={stock} sectorKey={sectorInfo?.key} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          Data for informational purposes only. Not financial advice. Always do your own research.
        </div>
      </footer>
    </div>
  );
};

// Quick Stat Component
const QuickStat = ({ label, value, positive }) => (
  <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
    <div className="text-xs text-slate-400 mb-0.5">{label}</div>
    <div className={`font-semibold ${
      positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') : 'text-white'
    }`}>
      {value}
    </div>
  </div>
);

// Overview Tab
const OverviewTab = ({ stock, radarData }) => (
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Left Column - Main Info */}
    <div className="lg:col-span-2 space-y-6">
      {/* Opportunity & Risk */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
          <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Investment Opportunity
          </h3>
          <p className="text-slate-300 leading-relaxed">{stock.opportunity}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-2xl border border-red-500/20">
          <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Key Risk Factors
          </h3>
          <p className="text-slate-300 leading-relaxed">{stock.risk}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-purple-400" />
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox label="Market Cap" value={stock.marketCap >= 1000 ? `$${(stock.marketCap / 1000).toFixed(1)}T` : `$${stock.marketCap}B`} />
          <MetricBox label="P/E Ratio" value={stock.peRatio || 'N/A'} warning={stock.peRatio > 100} />
          <MetricBox label="Forward P/E" value={stock.forwardPE || 'N/A'} />
          <MetricBox label="Revenue Growth" value={stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A'} positive={stock.revenueGrowth > 0} />
          <MetricBox label="Price Target" value={`$${stock.priceTarget}`} />
          <MetricBox label="Upside" value={`${stock.upside}%`} positive={stock.upside > 0} />
          <MetricBox label="AI Revenue" value={stock.aiRevenue ? `${stock.aiRevenue}%` : 'N/A'} />
          <MetricBox label="Investment Score" value={stock.score} highlight />
        </div>
      </div>

      {/* AI Revenue Bar */}
      {stock.aiRevenue !== undefined && (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              AI Revenue Exposure
            </h3>
            <span className="text-2xl font-bold text-white">{stock.aiRevenue}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${stock.aiRevenue}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Percentage of company revenue directly tied to AI products and services
          </p>
        </div>
      )}
    </div>

    {/* Right Column - Radar & Assessment */}
    <div className="space-y-6">
      {/* Radar Chart */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-5">
        <h3 className="text-white font-semibold mb-4">Investment Profile</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Assessment */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Quick Assessment
        </h3>
        <div className="space-y-3">
          <AssessmentRow
            label="Valuation"
            status={stock.forwardPE ? (stock.forwardPE < 30 ? 'positive' : stock.forwardPE < 50 ? 'neutral' : 'negative') : 'neutral'}
            text={stock.forwardPE ? (stock.forwardPE < 30 ? 'Attractive' : stock.forwardPE < 50 ? 'Fair' : 'Premium') : 'N/A'}
          />
          <AssessmentRow
            label="Growth"
            status={stock.revenueGrowth > 30 ? 'positive' : stock.revenueGrowth > 10 ? 'neutral' : 'negative'}
            text={stock.revenueGrowth ? (stock.revenueGrowth > 30 ? 'High Growth' : stock.revenueGrowth > 10 ? 'Moderate' : 'Low Growth') : 'N/A'}
          />
          <AssessmentRow
            label="Upside Potential"
            status={stock.upside > 25 ? 'positive' : stock.upside > 10 ? 'neutral' : 'negative'}
            text={stock.upside > 25 ? 'Strong' : stock.upside > 10 ? 'Moderate' : 'Limited'}
          />
          <AssessmentRow
            label="AI Exposure"
            status={stock.aiRevenue > 60 ? 'positive' : stock.aiRevenue > 30 ? 'neutral' : 'negative'}
            text={stock.aiRevenue ? (stock.aiRevenue > 60 ? 'High' : stock.aiRevenue > 30 ? 'Moderate' : 'Low') : 'N/A'}
          />
        </div>
      </div>
    </div>
  </div>
);

// Financials Tab
const FinancialsTab = ({ stock }) => (
  <div className="space-y-6">
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        Valuation Metrics
      </h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        <FinancialCard label="Market Cap" value={stock.marketCap >= 1000 ? `$${(stock.marketCap / 1000).toFixed(1)}T` : `$${stock.marketCap}B`} description="Total market value" />
        <FinancialCard label="P/E Ratio" value={stock.peRatio || 'N/A'} description="Price to trailing earnings" warning={stock.peRatio > 100} />
        <FinancialCard label="Forward P/E" value={stock.forwardPE || 'N/A'} description="Price to expected earnings" />
        <FinancialCard label="Price Target" value={`$${stock.priceTarget}`} description="Analyst consensus target" />
        <FinancialCard label="Upside" value={`${stock.upside}%`} description="Potential price appreciation" positive={stock.upside > 0} />
      </div>
    </div>

    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Growth Metrics
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <FinancialCard label="Revenue Growth" value={stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A'} description="Year-over-year growth" positive={stock.revenueGrowth > 0} />
        <FinancialCard label="AI Revenue %" value={stock.aiRevenue ? `${stock.aiRevenue}%` : 'N/A'} description="Revenue from AI products" />
        <FinancialCard label="Investment Score" value={stock.score} description="Composite investment rating" highlight />
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
      <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Data Limitations
      </h3>
      <p className="text-slate-300 text-sm">
        Full financial data (income statements, balance sheets, cash flow) would require integration with a financial data API
        such as Alpha Vantage, Yahoo Finance, or Polygon.io. The metrics shown are based on research snapshots.
      </p>
    </div>
  </div>
);

// Catalysts Tab
const CatalystsTab = ({ stock }) => {
  // Generate potential catalysts based on stock sector and characteristics
  const potentialCatalysts = useMemo(() => {
    const catalysts = [];

    // Earnings (all stocks)
    catalysts.push({
      type: 'Earnings',
      event: 'Quarterly Earnings Report',
      timing: 'Next Quarter',
      impact: 'High',
      description: 'Revenue, EPS, and forward guidance will be closely watched by analysts.'
    });

    // Product catalysts based on opportunity text
    if (stock.opportunity?.toLowerCase().includes('launch') || stock.opportunity?.toLowerCase().includes('platform')) {
      catalysts.push({
        type: 'Product',
        event: 'New Product/Platform Launch',
        timing: '2026',
        impact: 'High',
        description: stock.opportunity
      });
    }

    // Partnership catalysts
    if (stock.opportunity?.toLowerCase().includes('partner') || stock.opportunity?.toLowerCase().includes('deal')) {
      catalysts.push({
        type: 'Partnership',
        event: 'Strategic Partnership Expansion',
        timing: 'Ongoing',
        impact: 'Medium',
        description: 'Watch for expansion of existing partnerships or new strategic deals.'
      });
    }

    // AI-specific catalysts
    if (stock.aiRevenue > 50) {
      catalysts.push({
        type: 'AI Adoption',
        event: 'Enterprise AI Adoption Acceleration',
        timing: '2026',
        impact: 'High',
        description: 'Increased enterprise AI spending could significantly boost revenue.'
      });
    }

    // Regulatory catalysts
    catalysts.push({
      type: 'Regulatory',
      event: 'AI Regulation Updates',
      timing: 'TBD',
      impact: 'Medium',
      description: 'New AI regulations could impact business model or create competitive advantages.'
    });

    return catalysts;
  }, [stock]);

  return (
    <div className="space-y-6">
      {/* Upcoming Catalysts */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Potential Catalysts & Milestones
        </h3>
        <div className="space-y-4">
          {potentialCatalysts.map((catalyst, idx) => (
            <CatalystCard key={idx} {...catalyst} />
          ))}
        </div>
      </div>

      {/* What to Watch */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Bullish Signals to Watch
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              Analyst estimates revised upward
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              Revenue/EPS beats for consecutive quarters
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              Major new customer or partnership announced
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              Insider buying activity
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              Industry tailwinds strengthening
            </li>
          </ul>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Bearish Signals to Watch
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              Analyst estimates revised downward
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              Revenue/EPS misses expectations
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              Management lowers guidance
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              Significant insider selling
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              Key executive departures
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Risks Tab
const RisksTab = ({ stock }) => {
  // Generate risk factors based on stock characteristics
  const riskFactors = useMemo(() => {
    const risks = [];

    // Valuation risk
    if (stock.peRatio > 50 || stock.forwardPE > 40) {
      risks.push({
        category: 'Valuation',
        severity: 'High',
        description: `Trading at ${stock.peRatio || stock.forwardPE}x earnings, above market average. Premium valuation leaves little room for error.`,
        mitigation: 'Consider position sizing carefully. Watch for multiple compression if growth slows.'
      });
    }

    // Competition risk (always relevant)
    risks.push({
      category: 'Competition',
      severity: 'Medium',
      description: stock.risk || 'Competitive pressures from established players and new entrants.',
      mitigation: 'Monitor market share trends and competitive product launches.'
    });

    // Concentration risk
    if (stock.aiRevenue > 70) {
      risks.push({
        category: 'Concentration',
        severity: 'Medium',
        description: `${stock.aiRevenue}% of revenue tied to AI. High dependency on single trend.`,
        mitigation: 'Watch for AI spending slowdowns or shifts in enterprise priorities.'
      });
    }

    // Regulatory risk
    risks.push({
      category: 'Regulatory',
      severity: 'Medium',
      description: 'AI regulation evolving globally. Potential for restrictions on data use, model training, or deployment.',
      mitigation: 'Monitor regulatory developments in US, EU, and key markets.'
    });

    // Macro risk
    risks.push({
      category: 'Macroeconomic',
      severity: 'Low',
      description: 'Interest rates, recession fears, and tech spending cycles could impact growth.',
      mitigation: 'Maintain diversified portfolio across sectors and asset classes.'
    });

    return risks;
  }, [stock]);

  return (
    <div className="space-y-6">
      {/* Primary Risk from Stock Data */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Primary Risk Factor
        </h3>
        <p className="text-slate-300">{stock.risk}</p>
      </div>

      {/* Detailed Risk Analysis */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Risk Analysis
        </h3>
        <div className="space-y-4">
          {riskFactors.map((risk, idx) => (
            <RiskCard key={idx} {...risk} />
          ))}
        </div>
      </div>

      {/* Red Flags to Watch */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-400" />
          Red Flags to Monitor
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <RedFlagItem text="Declining revenue growth for 2+ quarters" />
          <RedFlagItem text="Gross margins compressing significantly" />
          <RedFlagItem text="Cash burn accelerating without clear path to profitability" />
          <RedFlagItem text="Key customer losses or contract cancellations" />
          <RedFlagItem text="CFO or CEO sudden departure" />
          <RedFlagItem text="Accounting restatements or auditor changes" />
          <RedFlagItem text="Significant insider selling" />
          <RedFlagItem text="Guidance lowered multiple times" />
        </div>
      </div>
    </div>
  );
};

// Comparison Tab
const ComparisonTab = ({ stock, sectorKey }) => {
  // Get peers from same sector
  const peers = useMemo(() => {
    if (!sectorKey || !stocksData[sectorKey]) return [];
    return stocksData[sectorKey]
      .filter(s => s.ticker !== stock.ticker)
      .slice(0, 5);
  }, [stock, sectorKey]);

  const allStocks = [stock, ...peers];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6 overflow-x-auto">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Peer Comparison
        </h3>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium text-right">Price</th>
              <th className="pb-3 font-medium text-right">Market Cap</th>
              <th className="pb-3 font-medium text-right">P/E</th>
              <th className="pb-3 font-medium text-right">Growth</th>
              <th className="pb-3 font-medium text-right">Upside</th>
              <th className="pb-3 font-medium text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {allStocks.map((s, idx) => (
              <tr key={s.ticker} className={`border-b border-slate-700/50 ${idx === 0 ? 'bg-purple-500/10' : ''}`}>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{s.name}</span>
                    <span className="text-slate-500 text-sm">{s.ticker}</span>
                    {idx === 0 && <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">Current</span>}
                  </div>
                </td>
                <td className="py-3 text-right text-white">${s.price}</td>
                <td className="py-3 text-right text-slate-300">
                  {s.marketCap >= 1000 ? `$${(s.marketCap / 1000).toFixed(1)}T` : `$${s.marketCap}B`}
                </td>
                <td className={`py-3 text-right ${s.peRatio > 100 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {s.peRatio || 'N/A'}
                </td>
                <td className={`py-3 text-right ${s.revenueGrowth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.revenueGrowth ? `${s.revenueGrowth}%` : 'N/A'}
                </td>
                <td className={`py-3 text-right ${s.upside > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.upside}%
                </td>
                <td className="py-3 text-right">
                  <span className={`font-semibold ${s.score >= 80 ? 'text-emerald-400' : s.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {s.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-6">
        <h3 className="text-white font-semibold mb-6">Score Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={allStocks.map(s => ({ name: s.ticker, score: s.score, growth: s.revenueGrowth || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricBox = ({ label, value, warning, positive, highlight }) => (
  <div className="p-4 bg-slate-700/30 rounded-xl">
    <div className="text-slate-400 text-sm mb-1">{label}</div>
    <div className={`text-xl font-bold ${
      highlight ? 'text-purple-400' :
      warning ? 'text-amber-400' :
      positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') :
      'text-white'
    }`}>
      {value}
    </div>
  </div>
);

const FinancialCard = ({ label, value, description, warning, positive, highlight }) => (
  <div className="p-4 bg-slate-700/30 rounded-xl">
    <div className="text-slate-400 text-xs mb-1">{label}</div>
    <div className={`text-2xl font-bold mb-1 ${
      highlight ? 'text-purple-400' :
      warning ? 'text-amber-400' :
      positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') :
      'text-white'
    }`}>
      {value}
    </div>
    <div className="text-slate-500 text-xs">{description}</div>
  </div>
);

const AssessmentRow = ({ label, status, text }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium flex items-center gap-1 ${
      status === 'positive' ? 'text-emerald-400' :
      status === 'negative' ? 'text-red-400' :
      'text-yellow-400'
    }`}>
      {status === 'positive' ? <CheckCircle className="w-4 h-4" /> :
       status === 'negative' ? <XCircle className="w-4 h-4" /> :
       <AlertCircle className="w-4 h-4" />}
      {text}
    </span>
  </div>
);

const CatalystCard = ({ type, event, timing, impact, description }) => (
  <div className="p-4 bg-slate-700/30 rounded-xl border-l-4 border-purple-500">
    <div className="flex items-start justify-between mb-2">
      <div>
        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">{type}</span>
        <h4 className="text-white font-medium mt-1">{event}</h4>
      </div>
      <div className="text-right">
        <div className="text-slate-400 text-sm">{timing}</div>
        <div className={`text-xs ${impact === 'High' ? 'text-red-400' : impact === 'Medium' ? 'text-yellow-400' : 'text-slate-400'}`}>
          {impact} Impact
        </div>
      </div>
    </div>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

const RiskCard = ({ category, severity, description, mitigation }) => (
  <div className={`p-4 rounded-xl border-l-4 ${
    severity === 'High' ? 'bg-red-500/10 border-red-500' :
    severity === 'Medium' ? 'bg-amber-500/10 border-amber-500' :
    'bg-slate-700/30 border-slate-500'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-white font-medium">{category} Risk</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        severity === 'High' ? 'bg-red-500/20 text-red-400' :
        severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
        'bg-slate-600 text-slate-300'
      }`}>
        {severity}
      </span>
    </div>
    <p className="text-slate-300 text-sm mb-2">{description}</p>
    <p className="text-slate-500 text-xs"><strong>Mitigation:</strong> {mitigation}</p>
  </div>
);

const RedFlagItem = ({ text }) => (
  <div className="flex items-start gap-2 text-sm">
    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
    <span className="text-slate-300">{text}</span>
  </div>
);

export default StockDetailPage;
