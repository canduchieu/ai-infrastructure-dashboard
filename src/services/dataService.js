// Data Service Layer - Centralizes all stock data queries and transformations
import { enhancedStocksData as stocksData, sectorSummary } from '../data/enhancedStockData';

// Sector key to display name mapping
const sectorDisplayNames = {
  chipManufacturers: 'Chip Manufacturers',
  dataCenters: 'Data Centers',
  dataStorage: 'Data Storage',
  cooling: 'Cooling',
  energy: 'Energy',
  aiSoftware: 'AI Software',
  robotics: 'Robotics',
  autonomousVehicles: 'Autonomous Vehicles',
  cybersecurity: 'Cybersecurity',
  healthcareAI: 'Healthcare AI',
  commodities: 'Commodities',
  etfs: 'AI ETFs',
  crypto: 'AI Crypto',
  vibeCoding: 'Vibe Coding'
};

// Get all sectors with their keys and display names
export const getAllSectors = () => {
  return Object.keys(stocksData).map(key => ({
    key,
    name: sectorDisplayNames[key] || key,
    count: stocksData[key].length,
    color: sectorSummary.find(s => s.sector === sectorDisplayNames[key])?.color || '#8B5CF6'
  }));
};

// Get all stocks flattened into a single array with sector info
export const getAllStocks = () => {
  const allStocks = [];

  Object.entries(stocksData).forEach(([sectorKey, stocks]) => {
    stocks.forEach(stock => {
      // Avoid duplicates (some stocks appear in multiple sectors)
      if (!allStocks.find(s => s.ticker === stock.ticker)) {
        allStocks.push({
          ...stock,
          sector: sectorDisplayNames[sectorKey] || sectorKey,
          sectorKey
        });
      }
    });
  });

  return allStocks;
};

// Get a single stock by ticker
export const getStockByTicker = (ticker) => {
  const upperTicker = ticker?.toUpperCase();

  for (const [sectorKey, stocks] of Object.entries(stocksData)) {
    const stock = stocks.find(s => s.ticker?.toUpperCase() === upperTicker);
    if (stock) {
      return {
        ...stock,
        sector: sectorDisplayNames[sectorKey] || sectorKey,
        sectorKey
      };
    }
  }

  return null;
};

// Search stocks by query (name, ticker, or sector)
export const searchStocks = (query, limit = 20) => {
  if (!query || query.trim().length === 0) {
    return getAllStocks().slice(0, limit);
  }

  const lowerQuery = query.toLowerCase().trim();
  const allStocks = getAllStocks();

  // Score each stock based on match quality
  const scored = allStocks.map(stock => {
    let score = 0;
    const name = stock.name?.toLowerCase() || '';
    const ticker = stock.ticker?.toLowerCase() || '';
    const sector = stock.sector?.toLowerCase() || '';

    // Exact ticker match (highest priority)
    if (ticker === lowerQuery) score += 100;
    // Ticker starts with query
    else if (ticker.startsWith(lowerQuery)) score += 80;
    // Ticker contains query
    else if (ticker.includes(lowerQuery)) score += 60;

    // Name starts with query
    if (name.startsWith(lowerQuery)) score += 70;
    // Name contains query word
    else if (name.includes(lowerQuery)) score += 40;

    // Sector match
    if (sector.includes(lowerQuery)) score += 20;

    return { stock, score };
  });

  // Filter and sort by score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.stock);
};

// Filter stocks by multiple criteria
export const getStocksByFilters = (filters = {}) => {
  let stocks = getAllStocks();

  const {
    sectors = [],          // Array of sector keys
    minScore = 0,
    maxScore = 100,
    minPE = 0,
    maxPE = Infinity,
    minForwardPE = 0,
    maxForwardPE = Infinity,
    minGrowth = -Infinity,
    maxGrowth = Infinity,
    minUpside = -Infinity,
    maxUpside = Infinity,
    minMarketCap = 0,
    maxMarketCap = Infinity,
    hbmExposure = null,    // null = any, true/false = specific
    ratings = [],          // Array of analyst ratings
    searchQuery = '',
    sortBy = 'score',
    sortOrder = 'desc'
  } = filters;

  // Apply filters
  stocks = stocks.filter(stock => {
    // Sector filter
    if (sectors.length > 0 && !sectors.includes(stock.sectorKey)) {
      return false;
    }

    // Score filter
    if (stock.score < minScore || stock.score > maxScore) {
      return false;
    }

    // P/E filter (handle null values)
    if (stock.peRatio !== null) {
      if (stock.peRatio < minPE || stock.peRatio > maxPE) {
        return false;
      }
    } else if (minPE > 0) {
      // If minimum P/E is set and stock has no P/E, exclude it
      return false;
    }

    // Forward P/E filter
    if (stock.forwardPE !== null) {
      if (stock.forwardPE < minForwardPE || stock.forwardPE > maxForwardPE) {
        return false;
      }
    } else if (minForwardPE > 0) {
      return false;
    }

    // Revenue growth filter
    if (stock.revenueGrowth !== null) {
      if (stock.revenueGrowth < minGrowth || stock.revenueGrowth > maxGrowth) {
        return false;
      }
    }

    // Upside filter
    if (stock.upside !== null && stock.upside !== undefined) {
      if (stock.upside < minUpside || stock.upside > maxUpside) {
        return false;
      }
    }

    // Market cap filter
    if (stock.marketCap < minMarketCap || stock.marketCap > maxMarketCap) {
      return false;
    }

    // HBM exposure filter
    if (hbmExposure !== null && stock.hbmExposure !== hbmExposure) {
      return false;
    }

    // Analyst rating filter
    if (ratings.length > 0) {
      const stockRating = stock.analystRating?.toLowerCase() || '';
      const matchesRating = ratings.some(rating =>
        stockRating.includes(rating.toLowerCase())
      );
      if (!matchesRating) return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        stock.name?.toLowerCase().includes(query) ||
        stock.ticker?.toLowerCase().includes(query) ||
        stock.sector?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Sort results
  stocks.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle null values
    if (aVal === null || aVal === undefined) aVal = sortOrder === 'desc' ? -Infinity : Infinity;
    if (bVal === null || bVal === undefined) bVal = sortOrder === 'desc' ? -Infinity : Infinity;

    // Handle string sorting
    if (typeof aVal === 'string') {
      return sortOrder === 'desc'
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }

    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  return stocks;
};

// Get upcoming earnings within N days
export const getUpcomingEarnings = (days = 30) => {
  const allStocks = getAllStocks();
  const today = new Date();

  return allStocks
    .filter(stock => {
      if (!stock.nextEarningsDate) return false;
      const earningsDate = new Date(stock.nextEarningsDate);
      const diffTime = earningsDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= days;
    })
    .map(stock => ({
      ...stock,
      daysUntilEarnings: Math.ceil((new Date(stock.nextEarningsDate) - today) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysUntilEarnings - b.daysUntilEarnings);
};

// Get earnings by month for calendar view
export const getEarningsByMonth = (year, month) => {
  const allStocks = getAllStocks();

  return allStocks.filter(stock => {
    if (!stock.nextEarningsDate) return false;
    const earningsDate = new Date(stock.nextEarningsDate);
    return earningsDate.getFullYear() === year && earningsDate.getMonth() === month;
  }).map(stock => ({
    ...stock,
    earningsDay: new Date(stock.nextEarningsDate).getDate()
  }));
};

// Format stocks for export
export const formatForExport = (stocks, fields = null) => {
  const defaultFields = [
    'ticker', 'name', 'sector', 'price', 'marketCap',
    'peRatio', 'forwardPE', 'revenueGrowth', 'score',
    'analystRating', 'priceTarget', 'upside'
  ];

  const exportFields = fields || defaultFields;

  return stocks.map(stock => {
    const row = {};
    exportFields.forEach(field => {
      row[field] = stock[field] ?? '';
    });
    return row;
  });
};

// Get filter statistics for a set of stocks
export const getFilterStats = (stocks) => {
  if (!stocks || stocks.length === 0) {
    return {
      count: 0,
      avgScore: 0,
      avgUpside: 0,
      avgGrowth: 0,
      totalMarketCap: 0
    };
  }

  const validScores = stocks.filter(s => s.score != null);
  const validUpsides = stocks.filter(s => s.upside != null);
  const validGrowth = stocks.filter(s => s.revenueGrowth != null);

  return {
    count: stocks.length,
    avgScore: validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length)
      : 0,
    avgUpside: validUpsides.length > 0
      ? Math.round(validUpsides.reduce((sum, s) => sum + s.upside, 0) / validUpsides.length * 10) / 10
      : 0,
    avgGrowth: validGrowth.length > 0
      ? Math.round(validGrowth.reduce((sum, s) => sum + s.revenueGrowth, 0) / validGrowth.length * 10) / 10
      : 0,
    totalMarketCap: Math.round(stocks.reduce((sum, s) => sum + (s.marketCap || 0), 0))
  };
};

// Get stocks for comparison (normalized metrics)
export const getStocksForComparison = (tickers) => {
  return tickers
    .map(ticker => getStockByTicker(ticker))
    .filter(Boolean);
};

export default {
  getAllSectors,
  getAllStocks,
  getStockByTicker,
  searchStocks,
  getStocksByFilters,
  getUpcomingEarnings,
  getEarningsByMonth,
  formatForExport,
  getFilterStats,
  getStocksForComparison
};
