import React from 'react';
import { X, TrendingUp, TrendingDown, Star, AlertTriangle, Target, Calendar, ChevronRight, ExternalLink, DollarSign, BarChart2, Activity, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StockDetailPanel = ({ stock, sector, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!stock || !isOpen) return null;

  // Calculate rating color
  const getRatingColor = (rating) => {
    if (rating?.includes('Strong Buy')) return 'text-emerald-400';
    if (rating?.includes('Buy')) return 'text-green-400';
    if (rating?.includes('Hold')) return 'text-yellow-400';
    if (rating?.includes('Sell')) return 'text-red-400';
    return 'text-slate-400';
  };

  // Calculate score color
  const getScoreColor = (score) => {
    if (score >= 85) return 'from-emerald-500 to-green-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 55) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  // Calculate score background
  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 55) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const handleViewFullAnalysis = () => {
    navigate(`/stock/${stock.ticker}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel - Bottom sheet on mobile, side panel on desktop */}
      <div
        className={`fixed bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isMobile
            ? `bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl border-t border-slate-700/50 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`
            : `top-0 right-0 h-full w-full max-w-xl border-l border-slate-700/50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
        }`}
      >
        {/* Mobile drag handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent pb-4 ${isMobile ? 'pt-2 px-4' : 'pt-4 px-6'} z-10`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <h2 className="text-xl md:text-2xl font-bold text-white truncate">{stock.name}</h2>
                <span className="px-2 py-0.5 bg-slate-700/50 rounded text-slate-300 text-xs md:text-sm font-mono flex-shrink-0">
                  {stock.ticker}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{sector?.name || 'AI Infrastructure'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-800 rounded-lg transition-colors -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Price & Score Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">${stock.price}</span>
                <span className={`flex items-center gap-1 text-sm ${stock.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.upside >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stock.upside >= 0 ? '+' : ''}{stock.upside}% upside
                </span>
              </div>
              <p className="text-slate-500 text-sm">Target: ${stock.priceTarget}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border ${getScoreBg(stock.score)}`}>
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(stock.score)} bg-clip-text text-transparent`}>
                  {stock.score}
                </div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${isMobile ? 'px-4 pb-safe' : 'px-6 pb-6'} space-y-4 md:space-y-5`}>
          {/* Analyst Rating */}
          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <span className="text-slate-400">Analyst Rating</span>
            <span className={`font-semibold ${getRatingColor(stock.analystRating)}`}>
              {stock.analystRating || 'N/A'}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Market Cap"
              value={stock.marketCap >= 1000 ? `$${(stock.marketCap / 1000).toFixed(1)}T` : `$${stock.marketCap}B`}
              icon={DollarSign}
            />
            <MetricCard
              label="P/E Ratio"
              value={stock.peRatio || 'N/A'}
              icon={BarChart2}
              highlight={stock.peRatio > 100}
            />
            <MetricCard
              label="Forward P/E"
              value={stock.forwardPE || 'N/A'}
              icon={Target}
            />
            <MetricCard
              label="Revenue Growth"
              value={stock.revenueGrowth ? `${stock.revenueGrowth}%` : 'N/A'}
              icon={Activity}
              positive={stock.revenueGrowth > 0}
            />
          </div>

          {/* AI Revenue Indicator */}
          {stock.aiRevenue !== undefined && (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  AI Revenue Exposure
                </span>
                <span className="text-white font-semibold">{stock.aiRevenue}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${stock.aiRevenue}%` }}
                />
              </div>
            </div>
          )}

          {/* Opportunity */}
          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Opportunity
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{stock.opportunity}</p>
          </div>

          {/* Risk */}
          <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Factors
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{stock.risk}</p>
          </div>

          {/* Quick Catalysts (if available) */}
          {stock.catalysts && stock.catalysts.length > 0 && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Upcoming Catalysts
              </h3>
              <div className="space-y-2">
                {stock.catalysts.slice(0, 3).map((catalyst, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300">{catalyst}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investment Thesis Summary */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Quick Assessment
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Valuation</div>
                <div className={`text-sm font-medium ${
                  stock.forwardPE && stock.forwardPE < 30 ? 'text-emerald-400' :
                  stock.forwardPE && stock.forwardPE < 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stock.forwardPE ? (stock.forwardPE < 30 ? 'Attractive' : stock.forwardPE < 50 ? 'Fair' : 'Premium') : 'N/A'}
                </div>
              </div>
              <div className="p-2 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Growth</div>
                <div className={`text-sm font-medium ${
                  stock.revenueGrowth > 30 ? 'text-emerald-400' :
                  stock.revenueGrowth > 10 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stock.revenueGrowth ? (stock.revenueGrowth > 30 ? 'High' : stock.revenueGrowth > 10 ? 'Moderate' : 'Low') : 'N/A'}
                </div>
              </div>
              <div className="p-2 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Upside</div>
                <div className={`text-sm font-medium ${
                  stock.upside > 25 ? 'text-emerald-400' :
                  stock.upside > 10 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stock.upside > 25 ? 'Strong' : stock.upside > 10 ? 'Moderate' : 'Limited'}
                </div>
              </div>
            </div>
          </div>

          {/* View Full Analysis Button */}
          <button
            onClick={handleViewFullAnalysis}
            className="w-full py-4 min-h-[52px] bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 active:from-purple-700 active:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            View Full Analysis
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 text-center pb-2">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </>
  );
};

// Metric Card Sub-component
const MetricCard = ({ label, value, icon: Icon, highlight, positive }) => (
  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-slate-500" />
      <span className="text-slate-400 text-xs">{label}</span>
    </div>
    <div className={`text-lg font-semibold ${
      highlight ? 'text-amber-400' :
      positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') :
      'text-white'
    }`}>
      {value}
    </div>
  </div>
);

export default StockDetailPanel;
