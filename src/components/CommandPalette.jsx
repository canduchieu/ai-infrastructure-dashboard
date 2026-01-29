import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Calendar, BarChart3, Download, ArrowRight, Clock, Cpu, Server, HardDrive, Thermometer, Zap, Brain, Bot, Car, Shield, Heart, Gem, Coins, Code } from 'lucide-react';
import { getAllStocks, getAllSectors } from '../services/dataService';

// Sector icons mapping
const sectorIcons = {
  chipManufacturers: Cpu,
  dataCenters: Server,
  dataStorage: HardDrive,
  cooling: Thermometer,
  energy: Zap,
  aiSoftware: Brain,
  robotics: Bot,
  autonomousVehicles: Car,
  cybersecurity: Shield,
  healthcareAI: Heart,
  commodities: Gem,
  etfs: TrendingUp,
  crypto: Coins,
  vibeCoding: Code
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentStockSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Get all stocks and sectors
  const allStocks = useMemo(() => getAllStocks(), []);
  const allSectors = useMemo(() => getAllSectors(), []);

  // Filter stocks based on search
  const filteredStocks = useMemo(() => {
    if (!search.trim()) {
      return allStocks.slice(0, 8);
    }

    const query = search.toLowerCase().trim();

    return allStocks
      .map(stock => {
        let score = 0;
        const ticker = stock.ticker?.toLowerCase() || '';
        const name = stock.name?.toLowerCase() || '';
        const sector = stock.sector?.toLowerCase() || '';

        // Exact ticker match
        if (ticker === query) score += 100;
        else if (ticker.startsWith(query)) score += 80;
        else if (ticker.includes(query)) score += 60;

        // Name match
        if (name.startsWith(query)) score += 70;
        else if (name.includes(query)) score += 40;

        // Sector match
        if (sector.includes(query)) score += 20;

        return { ...stock, searchScore: score };
      })
      .filter(stock => stock.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 12);
  }, [search, allStocks]);

  // Add to recent searches
  const addToRecent = useCallback((stock) => {
    const newRecent = [
      { ticker: stock.ticker, name: stock.name },
      ...recentSearches.filter(r => r.ticker !== stock.ticker)
    ].slice(0, 5);

    setRecentSearches(newRecent);
    localStorage.setItem('recentStockSearches', JSON.stringify(newRecent));
  }, [recentSearches]);

  // Handle stock selection
  const handleSelectStock = useCallback((stock) => {
    addToRecent(stock);
    setOpen(false);
    setSearch('');
    navigate(`/stock/${stock.ticker}`);
  }, [navigate, addToRecent]);

  // Handle navigation to pages
  const handleNavigate = useCallback((path) => {
    setOpen(false);
    setSearch('');
    navigate(path);
  }, [navigate]);

  // Get sector icon
  const getSectorIcon = (sectorKey) => {
    const Icon = sectorIcons[sectorKey] || TrendingUp;
    return Icon;
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all text-sm"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-700/50 rounded text-xs text-slate-500">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-white transition-all"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Command Dialog */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Dialog */}
        <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl mx-auto px-4">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 border-b border-slate-700/50">
              <Search className="w-5 h-5 text-slate-500" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search stocks, sectors, or navigate..."
                className="flex-1 py-4 bg-transparent text-white placeholder-slate-500 outline-none text-base"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs text-slate-500">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center text-slate-500">
                No results found for "{search}"
              </Command.Empty>

              {/* Quick Actions */}
              {!search && (
                <Command.Group heading="Quick Actions" className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quick Actions
                  </div>
                  <Command.Item
                    onSelect={() => handleNavigate('/screener')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                  >
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Stock Screener</div>
                      <div className="text-xs text-slate-500">Filter stocks by metrics</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate('/earnings')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                  >
                    <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Earnings Calendar</div>
                      <div className="text-xs text-slate-500">View upcoming earnings</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate('/compare')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                  >
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Compare Stocks</div>
                      <div className="text-xs text-slate-500">Side-by-side comparison</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </Command.Item>
                </Command.Group>
              )}

              {/* Recent Searches */}
              {!search && recentSearches.length > 0 && (
                <Command.Group heading="Recent" className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent
                  </div>
                  {recentSearches.map((recent) => (
                    <Command.Item
                      key={recent.ticker}
                      value={`recent-${recent.ticker}`}
                      onSelect={() => {
                        const stock = allStocks.find(s => s.ticker === recent.ticker);
                        if (stock) handleSelectStock(stock);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                    >
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400">
                        {recent.ticker?.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{recent.name}</div>
                        <div className="text-xs text-slate-500">{recent.ticker}</div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Stock Results */}
              {filteredStocks.length > 0 && (
                <Command.Group heading="Stocks">
                  <div className="px-2 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {search ? `Results for "${search}"` : 'Popular Stocks'}
                  </div>
                  {filteredStocks.map((stock) => {
                    const SectorIcon = getSectorIcon(stock.sectorKey);
                    return (
                      <Command.Item
                        key={stock.ticker}
                        value={`${stock.ticker} ${stock.name} ${stock.sector}`}
                        onSelect={() => handleSelectStock(stock)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center">
                          <SectorIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-data-[selected=true]:text-purple-400 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{stock.name}</span>
                            <span className="text-xs px-1.5 py-0.5 bg-slate-800 rounded text-slate-500">
                              {stock.ticker}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{stock.sector}</span>
                            {stock.score && (
                              <>
                                <span>•</span>
                                <span className="text-purple-400">Score: {stock.score}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${stock.price}</div>
                          {stock.upside && (
                            <div className={`text-xs ${stock.upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {stock.upside >= 0 ? '+' : ''}{stock.upside}%
                            </div>
                          )}
                        </div>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              )}

              {/* Sectors */}
              {search && search.length > 1 && (
                <Command.Group heading="Sectors">
                  <div className="px-2 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Sectors
                  </div>
                  {allSectors
                    .filter(sector =>
                      sector.name.toLowerCase().includes(search.toLowerCase()) ||
                      sector.key.toLowerCase().includes(search.toLowerCase())
                    )
                    .slice(0, 4)
                    .map((sector) => {
                      const SectorIcon = getSectorIcon(sector.key);
                      return (
                        <Command.Item
                          key={sector.key}
                          value={`sector-${sector.key}`}
                          onSelect={() => handleNavigate(`/screener?sectors=${sector.key}`)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white data-[selected=true]:bg-slate-800 data-[selected=true]:text-white transition-colors"
                        >
                          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${sector.color}20` }}>
                            <SectorIcon className="w-4 h-4" style={{ color: sector.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{sector.name}</div>
                            <div className="text-xs text-slate-500">{sector.count} stocks</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-600" />
                        </Command.Item>
                      );
                    })}
                </Command.Group>
              )}
            </Command.List>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd>
                  <span>Select</span>
                </span>
              </div>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
};

export default CommandPalette;
