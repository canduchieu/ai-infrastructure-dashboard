import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, TrendingUp, Filter, List, Grid } from 'lucide-react';
import { getUpcomingEarningsEnhanced, getAllEnhancedStocks } from '../data/enhancedStockData';
import { getAllSectors } from '../services/dataService';
import { formatDaysUntilEarnings, getEarningsUrgencyColor } from '../utils/calculations';
import CommandPalette from '../components/CommandPalette';

// Earnings Badge Component
const EarningsBadge = ({ daysUntil }) => {
  const color = getEarningsUrgencyColor(daysUntil);
  const label = formatDaysUntilEarnings(daysUntil);

  if (label === null) return null;

  const colorClasses = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    slate: 'bg-slate-700/50 text-slate-400 border-slate-600/30'
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
      {label}
    </span>
  );
};

// Earnings Card
const EarningsCard = ({ stock }) => {
  const earningsDate = new Date(stock.nextEarningsDate);
  const formattedDate = earningsDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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
          <span className="text-slate-500 text-sm">{stock.ticker}</span>
        </div>
        <EarningsBadge daysUntil={stock.daysUntilEarnings} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-slate-300">{formattedDate}</span>
        </div>

        {stock.earningsEstimate && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Est. EPS:</span>
            <span className="text-white">${stock.earningsEstimate}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between">
        <span className="text-xs text-slate-500">{stock.sector}</span>
        <span className="text-xs text-purple-400">Score: {stock.score}</span>
      </div>
    </Link>
  );
};

// Calendar Day Cell
const CalendarDay = ({ date, stocks, isCurrentMonth, isToday }) => {
  const dayNum = date.getDate();
  const hasEarnings = stocks.length > 0;

  return (
    <div
      className={`min-h-[80px] p-1 border-b border-r border-slate-700/30 ${
        !isCurrentMonth ? 'bg-slate-900/30' : ''
      } ${isToday ? 'bg-purple-500/10' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-sm ${
            isToday
              ? 'w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium'
              : isCurrentMonth
              ? 'text-slate-300'
              : 'text-slate-600'
          }`}
        >
          {dayNum}
        </span>
        {hasEarnings && (
          <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
            {stocks.length}
          </span>
        )}
      </div>

      {hasEarnings && (
        <div className="space-y-0.5">
          {stocks.slice(0, 3).map((stock) => (
            <Link
              key={stock.ticker}
              to={`/stock/${stock.ticker}`}
              className="block text-xs px-1 py-0.5 bg-slate-800/50 hover:bg-slate-700/50 rounded truncate text-slate-300 hover:text-white transition-colors"
            >
              {stock.ticker}
            </Link>
          ))}
          {stocks.length > 3 && (
            <span className="text-xs text-slate-500 px-1">
              +{stocks.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const EarningsPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [daysFilter, setDaysFilter] = useState(90);

  const sectors = getAllSectors();
  const allStocks = useMemo(() => getAllEnhancedStocks(), []);

  // Filter stocks with earnings
  const stocksWithEarnings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allStocks
      .filter((stock) => {
        if (!stock.nextEarningsDate) return false;

        // Sector filter
        if (selectedSectors.length > 0 && !selectedSectors.includes(stock.sectorKey)) {
          return false;
        }

        // Days filter
        const earningsDate = new Date(stock.nextEarningsDate);
        const diffDays = Math.ceil((earningsDate - today) / (1000 * 60 * 60 * 24));

        return diffDays >= 0 && diffDays <= daysFilter;
      })
      .map((stock) => ({
        ...stock,
        daysUntilEarnings: Math.ceil(
          (new Date(stock.nextEarningsDate) - today) / (1000 * 60 * 60 * 24)
        )
      }))
      .sort((a, b) => a.daysUntilEarnings - b.daysUntilEarnings);
  }, [allStocks, selectedSectors, daysFilter]);

  // Calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Build calendar grid
    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    // Group stocks by date
    const stocksByDate = {};
    stocksWithEarnings.forEach((stock) => {
      const dateKey = stock.nextEarningsDate;
      if (!stocksByDate[dateKey]) {
        stocksByDate[dateKey] = [];
      }
      stocksByDate[dateKey].push(stock);
    });

    return { days, stocksByDate };
  }, [currentDate, stocksWithEarnings]);

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <CommandPalette />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Earnings Calendar
                </h1>
                <p className="text-sm text-slate-500">
                  {stocksWithEarnings.length} upcoming earnings in next {daysFilter} days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Days Filter */}
              <select
                value={daysFilter}
                onChange={(e) => setDaysFilter(Number(e.target.value))}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value={7}>Next 7 days</option>
                <option value={14}>Next 14 days</option>
                <option value={30}>Next 30 days</option>
                <option value={60}>Next 60 days</option>
                <option value={90}>Next 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Sector Filter */}
        <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">Filter by sector:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector.key}
                onClick={() => {
                  setSelectedSectors((prev) =>
                    prev.includes(sector.key)
                      ? prev.filter((s) => s !== sector.key)
                      : [...prev, sector.key]
                  );
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSectors.includes(sector.key)
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {sector.name}
              </button>
            ))}
            {selectedSectors.length > 0 && (
              <button
                onClick={() => setSelectedSectors([])}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {/* This Week */}
            {stocksWithEarnings.filter((s) => s.daysUntilEarnings <= 7).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-400" />
                  This Week
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stocksWithEarnings
                    .filter((s) => s.daysUntilEarnings <= 7)
                    .map((stock) => (
                      <EarningsCard key={stock.ticker} stock={stock} />
                    ))}
                </div>
              </div>
            )}

            {/* Next Week */}
            {stocksWithEarnings.filter((s) => s.daysUntilEarnings > 7 && s.daysUntilEarnings <= 14).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Next Week
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stocksWithEarnings
                    .filter((s) => s.daysUntilEarnings > 7 && s.daysUntilEarnings <= 14)
                    .map((stock) => (
                      <EarningsCard key={stock.ticker} stock={stock} />
                    ))}
                </div>
              </div>
            )}

            {/* Later */}
            {stocksWithEarnings.filter((s) => s.daysUntilEarnings > 14).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Later
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stocksWithEarnings
                    .filter((s) => s.daysUntilEarnings > 14)
                    .map((stock) => (
                      <EarningsCard key={stock.ticker} stock={stock} />
                    ))}
                </div>
              </div>
            )}

            {stocksWithEarnings.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">No upcoming earnings match your filters</p>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/30">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-700/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="px-2 py-2 text-center text-xs font-medium text-slate-500 border-r border-slate-700/30 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarData.days.map((day, index) => {
                const dateKey = day.date.toISOString().split('T')[0];
                const dayStocks = calendarData.stocksByDate[dateKey] || [];
                const isToday = day.date.getTime() === today.getTime();

                return (
                  <CalendarDay
                    key={index}
                    date={day.date}
                    stocks={dayStocks}
                    isCurrentMonth={day.isCurrentMonth}
                    isToday={isToday}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
