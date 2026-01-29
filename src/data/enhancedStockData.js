// Enhanced Stock Data - Adds earnings dates and historical prices to stocks
// This file generates realistic mock data for features that need historical/earnings data

import { stocksData as baseStocksData, sectorSummary, topOpportunities } from './stocksData';

// Seed-based random for consistent mock data
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate earnings date based on ticker (deterministic)
const generateEarningsDate = (ticker, price) => {
  // Create a hash from ticker for consistent dates
  const hash = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Earnings typically happen in cycles: Jan-Feb, Apr-May, Jul-Aug, Oct-Nov
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine next earnings month based on hash
  const earningsMonths = [1, 4, 7, 10]; // Feb, May, Aug, Nov
  const baseMonth = earningsMonths[hash % 4];

  // Find next earnings date
  let earningsMonth = baseMonth;
  let earningsYear = currentYear;

  if (earningsMonth <= currentMonth) {
    // Find next quarter
    const nextQuarterIndex = earningsMonths.findIndex(m => m > currentMonth);
    if (nextQuarterIndex === -1) {
      earningsMonth = earningsMonths[0];
      earningsYear = currentYear + 1;
    } else {
      earningsMonth = earningsMonths[nextQuarterIndex];
    }
  }

  // Day of month (10-28 based on hash)
  const earningsDay = 10 + (hash % 19);

  const earningsDate = new Date(earningsYear, earningsMonth, earningsDay);

  // Ensure it's in the future
  if (earningsDate <= today) {
    earningsDate.setMonth(earningsDate.getMonth() + 3);
  }

  return earningsDate.toISOString().split('T')[0];
};

// Generate realistic historical prices
const generateHistoricalPrices = (ticker, currentPrice, days = 365) => {
  const prices = [];
  const hash = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Volatility based on sector/type
  const isVolatile = ticker.includes('SMR') || ticker.includes('OKLO') ||
    ticker.includes('RNDR') || ticker.includes('FET') || ticker.includes('TAO');
  const volatility = isVolatile ? 0.035 : 0.018;

  // Starting price (work backwards from current)
  // Use hash to determine if stock trended up or down
  const trendDirection = seededRandom(hash) > 0.4 ? 1 : -1;
  const trendStrength = 0.1 + seededRandom(hash + 1) * 0.3; // 10-40% change over period

  let price = currentPrice / (1 + trendDirection * trendStrength);

  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Daily change with trend bias
    const dailySeed = hash + i;
    const randomChange = (seededRandom(dailySeed) - 0.48) * volatility;
    const trendBias = (trendDirection * trendStrength) / days;

    price = Math.max(price * 0.3, price * (1 + randomChange + trendBias));

    // On last day, snap to current price
    if (i === 0) {
      price = currentPrice;
    }

    const dailyVolatility = volatility * seededRandom(dailySeed + 1000);
    const high = price * (1 + dailyVolatility);
    const low = price * (1 - dailyVolatility);
    const open = price * (1 + (seededRandom(dailySeed + 2000) - 0.5) * dailyVolatility);

    prices.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(price * 100) / 100,
      volume: Math.floor(1000000 + seededRandom(dailySeed + 3000) * 50000000)
    });
  }

  return prices;
};

// Generate EPS estimate based on P/E and price
const generateEPSEstimate = (price, peRatio, forwardPE) => {
  const pe = forwardPE || peRatio;
  if (!pe || pe <= 0) return null;
  return Math.round((price / pe) * 100) / 100;
};

// Enhance a single stock with additional data
const enhanceStock = (stock, sectorKey) => {
  const ticker = stock.ticker;
  const price = stock.price || 100;

  return {
    ...stock,
    sectorKey,
    nextEarningsDate: generateEarningsDate(ticker, price),
    earningsEstimate: generateEPSEstimate(price, stock.peRatio, stock.forwardPE),
    historicalPrices: generateHistoricalPrices(ticker, price, 365)
  };
};

// Create enhanced stocks data
const createEnhancedStocksData = () => {
  const enhanced = {};

  Object.entries(baseStocksData).forEach(([sectorKey, stocks]) => {
    enhanced[sectorKey] = stocks.map(stock => enhanceStock(stock, sectorKey));
  });

  return enhanced;
};

// Export enhanced data
export const enhancedStocksData = createEnhancedStocksData();

// Re-export other data
export { sectorSummary, topOpportunities };

// Helper to get stock with historical data
export const getEnhancedStock = (ticker) => {
  for (const [sectorKey, stocks] of Object.entries(enhancedStocksData)) {
    const stock = stocks.find(s => s.ticker?.toUpperCase() === ticker?.toUpperCase());
    if (stock) {
      return stock;
    }
  }
  return null;
};

// Get all enhanced stocks as flat array
export const getAllEnhancedStocks = () => {
  const allStocks = [];
  const seenTickers = new Set();

  Object.entries(enhancedStocksData).forEach(([sectorKey, stocks]) => {
    stocks.forEach(stock => {
      if (!seenTickers.has(stock.ticker)) {
        seenTickers.add(stock.ticker);
        allStocks.push(stock);
      }
    });
  });

  return allStocks;
};

// Get upcoming earnings with enhanced data
export const getUpcomingEarningsEnhanced = (days = 30) => {
  const allStocks = getAllEnhancedStocks();
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
      daysUntilEarnings: Math.ceil(
        (new Date(stock.nextEarningsDate) - today) / (1000 * 60 * 60 * 24)
      )
    }))
    .sort((a, b) => a.daysUntilEarnings - b.daysUntilEarnings);
};

export default enhancedStocksData;
