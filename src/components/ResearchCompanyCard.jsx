import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lock, ExternalLink, Building2 } from 'lucide-react';

const ResearchCompanyCard = ({
  company,
  isPrivate = false,
  order = '3rd',
  highlight,
  showOrder = true
}) => {
  const navigate = useNavigate();

  const orderColors = {
    '1st': { bg: 'from-purple-600/20 to-purple-900/20', border: 'border-purple-500/40', badge: 'bg-purple-500/30 text-purple-300' },
    '2nd': { bg: 'from-cyan-600/20 to-cyan-900/20', border: 'border-cyan-500/40', badge: 'bg-cyan-500/30 text-cyan-300' },
    '3rd': { bg: 'from-emerald-600/20 to-emerald-900/20', border: 'border-emerald-500/40', badge: 'bg-emerald-500/30 text-emerald-300' }
  };

  const colors = orderColors[order] || orderColors['3rd'];

  const handleClick = () => {
    if (isPrivate) {
      navigate(`/company/${company.id}`);
    } else {
      navigate(`/stock/${company.ticker}`);
    }
  };

  // Format valuation/market cap
  const formatValue = (value) => {
    if (!value) return 'N/A';
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
    return `$${value}B`;
  };

  // Get display values based on public/private
  const displayName = company.name;
  const displayTicker = isPrivate ? 'PRIVATE' : company.ticker;
  const displayValue = isPrivate
    ? formatValue(company.valuation / 1000) // valuation is in millions
    : formatValue(company.marketCap);
  const displayGrowth = company.revenueGrowth;
  const displayScore = company.score;

  return (
    <div
      onClick={handleClick}
      className={`bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} p-3 md:p-4 cursor-pointer md:hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 md:hover:shadow-lg md:hover:shadow-purple-500/10`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {isPrivate ? (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-base md:text-lg font-bold text-white flex-shrink-0">
              {company.logo || company.name.charAt(0)}
            </div>
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{displayName}</h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] md:text-xs text-slate-400">{displayTicker}</span>
              {isPrivate && <Lock className="w-3 h-3 text-amber-400" />}
            </div>
          </div>
        </div>

        {showOrder && (
          <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0 ${colors.badge}`}>
            {order}
          </span>
        )}
      </div>

      {/* Highlight */}
      {highlight && (
        <div className="mb-2 md:mb-3 p-1.5 md:p-2 bg-slate-800/50 rounded-lg">
          <p className="text-[10px] md:text-xs text-cyan-400 font-medium line-clamp-2">{highlight}</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-1.5 md:gap-2 text-center">
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">
            {isPrivate ? 'Val' : 'Cap'}
          </p>
          <p className="text-xs md:text-sm font-semibold text-white">{displayValue}</p>
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">Growth</p>
          <p className={`text-xs md:text-sm font-semibold ${displayGrowth > 0 ? 'text-emerald-400' : displayGrowth ? 'text-red-400' : 'text-slate-400'}`}>
            {displayGrowth ? `${displayGrowth > 0 ? '+' : ''}${displayGrowth}%` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">Score</p>
          <p className="text-xs md:text-sm font-semibold text-purple-400">{displayScore || 'N/A'}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-700/50 flex items-center justify-between">
        <span className="text-[10px] md:text-xs text-slate-500">
          {isPrivate ? 'Private' : 'Public'}
        </span>
        <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
      </div>
    </div>
  );
};

export default ResearchCompanyCard;
