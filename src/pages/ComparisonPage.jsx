import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, TrendingUp, BarChart3, Table } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getAllStocks, getStockByTicker } from '../services/dataService';
import { getEnhancedStock } from '../data/enhancedStockData';
import { calculateRadarMetrics, getComparisonMetrics, normalizePricesToPercent, formatMarketCap, formatPercent } from '../utils/calculations';
import CommandPalette from '../components/CommandPalette';

// Stock colors for comparison
const stockColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

// Stock Selector Dropdown
const StockSelector = ({ value, onChange, exclude = [], placeholder = 'Select a stock...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const allStocks = useMemo(() => getAllStocks(), []);

  const filteredStocks = useMemo(() => {
    return allStocks
      .filter((stock) => !exclude.includes(stock.ticker))
      .filter((stock) => {
        if (!search) return true;
        const query = search.toLowerCase();
        return (
          stock.name?.toLowerCase().includes(query) ||
          stock.ticker?.toLowerCase().includes(query)
        );
      })
      .slice(0, 20);
  }, [allStocks, exclude, search]);

  const selectedStock = value ? getStockByTicker(value) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-colors text-left"
      >
        {selectedStock ? (
          <>
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-slate-300">
              {selectedStock.ticker?.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{selectedStock.name}</div>
              <div className="text-slate-500 text-sm">{selectedStock.ticker}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-500" />
            </div>
            <span className="text-slate-500">{placeholder}</span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-slate-700/50">
              <input
                type="text"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {filteredStocks.map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={() => {
                    onChange(stock.ticker);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{stock.name}</div>
                    <div className="text-slate-500 text-xs">{stock.ticker} • {stock.sector}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">${stock.price}</div>
                    <div className="text-purple-400 text-xs">Score: {stock.score}</div>
                  </div>
                </button>
              ))}
              {filteredStocks.length === 0 && (
                <p className="text-center text-slate-500 py-4">No stocks found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ComparisonPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('radar');

  // Get selected stocks from URL
  const selectedTickers = useMemo(() => {
    const stocksParam = searchParams.get('stocks');
    return stocksParam ? stocksParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  // Update URL when stocks change
  const updateStocks = (newTickers) => {
    if (newTickers.length > 0) {
      setSearchParams({ stocks: newTickers.join(',') });
    } else {
      setSearchParams({});
    }
  };

  // Get full stock data
  const selectedStocks = useMemo(() => {
    return selectedTickers
      .map((ticker) => getEnhancedStock(ticker))
      .filter(Boolean);
  }, [selectedTickers]);

  // Calculate radar metrics
  const radarData = useMemo(() => {
    if (selectedStocks.length < 2) return [];

    const metrics = calculateRadarMetrics(selectedStocks);
    const categories = ['Score', 'Growth', 'Value', 'Momentum', 'AI Exposure'];

    return categories.map((category, idx) => {
      const point = { category };
      const keys = ['score', 'growth', 'value', 'momentum', 'aiExposure'];

      metrics.forEach((stock) => {
        point[stock.ticker] = stock.metrics[keys[idx]];
      });

      return point;
    });
  }, [selectedStocks]);

  // Calculate price performance data
  const pricePerformanceData = useMemo(() => {
    if (selectedStocks.length < 2) return [];

    // Get 30 days of data
    const dataByDate = {};

    selectedStocks.forEach((stock) => {
      if (!stock.historicalPrices) return;

      const normalized = normalizePricesToPercent(stock.historicalPrices.slice(-30));
      normalized.forEach((point) => {
        if (!dataByDate[point.date]) {
          dataByDate[point.date] = { date: point.date };
        }
        dataByDate[point.date][stock.ticker] = point.normalizedClose;
      });
    });

    return Object.values(dataByDate).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );
  }, [selectedStocks]);

  // Comparison table data
  const { highlights } = useMemo(() => {
    return getComparisonMetrics(selectedStocks);
  }, [selectedStocks]);

  const handleAddStock = (index, ticker) => {
    const newTickers = [...selectedTickers];
    newTickers[index] = ticker;
    updateStocks(newTickers.filter(Boolean));
  };

  const handleRemoveStock = (index) => {
    const newTickers = selectedTickers.filter((_, i) => i !== index);
    updateStocks(newTickers);
  };

  const metrics = [
    { key: 'price', label: 'Price', format: (v) => v ? `$${v}` : 'N/A' },
    { key: 'marketCap', label: 'Market Cap', format: (v) => formatMarketCap(v) },
    { key: 'peRatio', label: 'P/E Ratio', format: (v) => v || 'N/A', inverse: true },
    { key: 'forwardPE', label: 'Forward P/E', format: (v) => v || 'N/A', inverse: true },
    { key: 'revenueGrowth', label: 'Revenue Growth', format: (v) => v ? `${v}%` : 'N/A' },
    { key: 'score', label: 'Score', format: (v) => v || 'N/A' },
    { key: 'upside', label: 'Upside', format: (v) => formatPercent(v) },
    { key: 'analystRating', label: 'Rating', format: (v) => v || 'N/A' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <CommandPalette />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Stock Comparison
              </h1>
              <p className="text-sm text-slate-500">
                Compare up to 4 stocks side-by-side
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Stock Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative">
              {index < 2 && !selectedTickers[index] && (
                <div className="absolute -top-2 left-3 px-2 bg-slate-950 text-xs text-purple-400">
                  Required
                </div>
              )}
              <StockSelector
                value={selectedTickers[index]}
                onChange={(ticker) => handleAddStock(index, ticker)}
                exclude={selectedTickers.filter((_, i) => i !== index)}
                placeholder={index < 2 ? 'Select stock...' : 'Add stock (optional)'}
              />
            </div>
          ))}
        </div>

        {selectedStocks.length < 2 ? (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">Select at least 2 stocks to compare</p>
            <p className="text-slate-600 text-sm">Use the dropdowns above to add stocks</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'radar', label: 'Radar Chart', icon: BarChart3 },
                { id: 'performance', label: 'Price Performance', icon: TrendingUp },
                { id: 'table', label: 'Metrics Table', icon: Table }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Radar Chart */}
            {activeTab === 'radar' && (
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 p-6">
                <h3 className="text-lg font-semibold mb-4">Multi-Dimensional Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    {selectedStocks.map((stock, index) => (
                      <Radar
                        key={stock.ticker}
                        name={stock.ticker}
                        dataKey={stock.ticker}
                        stroke={stockColors[index]}
                        fill={stockColors[index]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-slate-500 text-xs mt-4 text-center">
                  All metrics normalized to 0-100 scale. Higher is better (Value = inverse of P/E).
                </p>
              </div>
            )}

            {/* Price Performance */}
            {activeTab === 'performance' && (
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 p-6">
                <h3 className="text-lg font-semibold mb-4">30-Day Price Performance (%)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={pricePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(val) => `${val >= 0 ? '+' : ''}${val.toFixed(0)}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {selectedStocks.map((stock, index) => (
                      <Line
                        key={stock.ticker}
                        type="monotone"
                        dataKey={stock.ticker}
                        name={stock.ticker}
                        stroke={stockColors[index]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-slate-500 text-xs mt-4 text-center">
                  Performance normalized to percentage change from start of period.
                </p>
              </div>
            )}

            {/* Metrics Table */}
            {activeTab === 'table' && (
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-4 px-6 text-slate-400 font-medium">Metric</th>
                        {selectedStocks.map((stock, index) => (
                          <th key={stock.ticker} className="text-right py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: stockColors[index] }}
                              />
                              <span className="text-white font-semibold">{stock.ticker}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric) => (
                        <tr key={metric.key} className="border-b border-slate-700/30">
                          <td className="py-3 px-6 text-slate-400">{metric.label}</td>
                          {selectedStocks.map((stock, index) => {
                            const isBest = highlights[metric.key]?.best === index;
                            const isWorst = highlights[metric.key]?.worst === index;

                            return (
                              <td
                                key={stock.ticker}
                                className={`py-3 px-6 text-right font-medium ${
                                  isBest
                                    ? 'text-emerald-400'
                                    : isWorst
                                    ? 'text-red-400'
                                    : 'text-white'
                                }`}
                              >
                                {metric.format(stock[metric.key])}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700/30">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Best
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      Worst
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
