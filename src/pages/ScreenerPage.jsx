import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Download, TrendingUp, TrendingDown, ChevronDown, ArrowUpDown, LayoutGrid, List, Home, Calendar, GitCompare, BookOpen } from 'lucide-react';
import { getStocksByFilters, getFilterStats } from '../services/dataService';
import { useScreeningFilters } from '../hooks/useScreeningFilters';
import FilterPanel from '../components/FilterPanel';
import ExportMenu from '../components/ExportMenu';
import CommandPalette from '../components/CommandPalette';

// Stock Card for Grid View
const StockCard = ({ stock }) => {
  const ratingColor = stock.analystRating?.toLowerCase().includes('strong buy')
    ? 'text-emerald-400'
    : stock.analystRating?.toLowerCase().includes('buy')
    ? 'text-green-400'
    : stock.analystRating?.toLowerCase().includes('hold')
    ? 'text-yellow-400'
    : 'text-slate-400';

  return (
    <Link
      to={`/stock/${stock.ticker}`}
      className="block bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/40 hover:border-purple-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
            {stock.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-slate-500 text-sm">{stock.ticker}</span>
            <span className={`text-xs font-medium ${ratingColor}`}>
              {stock.analystRating}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">${stock.price}</p>
          <p className={`text-xs ${stock.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stock.upside >= 0 ? '+' : ''}{stock.upside}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">P/E</p>
          <p className="text-white font-medium">{stock.forwardPE || 'N/A'}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">Growth</p>
          <p className="text-emerald-400 font-medium">
            {stock.revenueGrowth ? `+${stock.revenueGrowth}%` : 'N/A'}
          </p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">Score</p>
          <p className="text-purple-400 font-medium">{stock.score}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{stock.sector}</span>
        <div className="w-16 bg-slate-700/50 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{ width: `${stock.score}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

// Table Row for List View
const StockRow = ({ stock, onSort, sortBy, sortOrder }) => {
  const ratingColor = stock.analystRating?.toLowerCase().includes('strong buy')
    ? 'bg-emerald-500/20 text-emerald-400'
    : stock.analystRating?.toLowerCase().includes('buy')
    ? 'bg-green-500/20 text-green-400'
    : stock.analystRating?.toLowerCase().includes('hold')
    ? 'bg-yellow-500/20 text-yellow-400'
    : 'bg-slate-700/50 text-slate-400';

  return (
    <Link
      to={`/stock/${stock.ticker}`}
      className="grid grid-cols-[1fr_80px_80px_80px_80px_80px_100px] gap-4 px-4 py-3 hover:bg-slate-800/30 border-b border-slate-700/30 transition-colors items-center"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{stock.name}</span>
          <span className="text-slate-500 text-sm">{stock.ticker}</span>
        </div>
        <span className="text-slate-500 text-xs">{stock.sector}</span>
      </div>
      <div className="text-right text-white">${stock.price}</div>
      <div className="text-right text-slate-300">{stock.forwardPE || 'N/A'}</div>
      <div className={`text-right ${stock.revenueGrowth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {stock.revenueGrowth ? `${stock.revenueGrowth > 0 ? '+' : ''}${stock.revenueGrowth}%` : 'N/A'}
      </div>
      <div className="text-right text-purple-400 font-medium">{stock.score}</div>
      <div className={`text-right ${stock.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {stock.upside >= 0 ? '+' : ''}{stock.upside}%
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${ratingColor}`}>
          {stock.analystRating}
        </span>
      </div>
    </Link>
  );
};

const ScreenerPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  const {
    filters,
    setFilter,
    toggleSector,
    toggleRating,
    resetFilters,
    setSort,
    hasActiveFilters,
    activeFilterCount
  } = useScreeningFilters();

  // Get filtered stocks
  const filteredStocks = useMemo(() => {
    return getStocksByFilters(filters);
  }, [filters]);

  // Get stats
  const stats = useMemo(() => {
    return getFilterStats(filteredStocks);
  }, [filteredStocks]);

  // Sort handler
  const handleSort = (field) => {
    if (filters.sortBy === field) {
      setSort(field, filters.sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSort(field, 'desc');
    }
  };

  const SortHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${filters.sortBy === field ? 'text-purple-400' : ''}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <CommandPalette />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Stock Screener</h1>
                <p className="text-sm text-slate-500">
                  {stats.count} stocks match your criteria
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg text-slate-300"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Export */}
              <ExportMenu stocks={filteredStocks} filename="screener-results" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Panel - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                setFilter={setFilter}
                toggleSector={toggleSector}
                toggleRating={toggleRating}
                resetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-slate-900 p-4 overflow-y-auto">
                <FilterPanel
                  filters={filters}
                  setFilter={setFilter}
                  toggleSector={toggleSector}
                  toggleRating={toggleRating}
                  resetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  activeFilterCount={activeFilterCount}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Results:</span>
                <span className="text-white font-semibold">{stats.count} stocks</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Avg Score:</span>
                <span className="text-purple-400 font-semibold">{stats.avgScore}</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Avg Upside:</span>
                <span className={`font-semibold ${stats.avgUpside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.avgUpside >= 0 ? '+' : ''}{stats.avgUpside}%
                </span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Total MCap:</span>
                <span className="text-white font-semibold">
                  ${stats.totalMarketCap >= 1000 ? `${(stats.totalMarketCap / 1000).toFixed(1)}T` : `${stats.totalMarketCap}B`}
                </span>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-slate-500 text-sm">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setSort(e.target.value, filters.sortOrder)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="score">Score</option>
                <option value="upside">Upside</option>
                <option value="revenueGrowth">Growth</option>
                <option value="forwardPE">Forward P/E</option>
                <option value="marketCap">Market Cap</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSort(filters.sortBy, filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
              >
                {filters.sortOrder === 'desc' ? (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    High to Low
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Low to High
                  </>
                )}
              </button>
            </div>

            {/* Results Grid/List */}
            {filteredStocks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg mb-2">No stocks match your filters</p>
                <button
                  onClick={resetFilters}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Reset all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredStocks.map((stock) => (
                  <StockCard key={stock.ticker} stock={stock} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px_100px] gap-4 px-4 py-3 bg-slate-800/50 border-b border-slate-700/30 text-sm font-medium">
                  <SortHeader field="name">Company</SortHeader>
                  <SortHeader field="price">Price</SortHeader>
                  <SortHeader field="forwardPE">Fwd P/E</SortHeader>
                  <SortHeader field="revenueGrowth">Growth</SortHeader>
                  <SortHeader field="score">Score</SortHeader>
                  <SortHeader field="upside">Upside</SortHeader>
                  <span className="text-slate-400">Rating</span>
                </div>

                {/* Table Body */}
                {filteredStocks.map((stock) => (
                  <StockRow key={stock.ticker} stock={stock} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;
