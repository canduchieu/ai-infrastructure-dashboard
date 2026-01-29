// Calculation Utilities for Dashboard Features

// Normalize a value to 0-100 scale
export const normalizeMetric = (value, min, max) => {
  if (value === null || value === undefined) return 50; // Default to middle
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

// Inverse normalize (higher original = lower normalized, good for P/E)
export const inverseNormalizeMetric = (value, min, max) => {
  if (value === null || value === undefined) return 50;
  return 100 - normalizeMetric(value, min, max);
};

// Calculate days until a date
export const getDaysUntilDate = (dateStr) => {
  if (!dateStr) return null;
  const targetDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format days until earnings for display
export const formatDaysUntilEarnings = (days) => {
  if (days === null || days === undefined) return null;
  if (days < 0) return 'Past';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days}d`;
  if (days <= 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
};

// Get color for days until earnings
export const getEarningsUrgencyColor = (days) => {
  if (days === null || days === undefined) return 'slate';
  if (days <= 3) return 'red';
  if (days <= 7) return 'amber';
  if (days <= 14) return 'yellow';
  if (days <= 30) return 'emerald';
  return 'slate';
};

// Calculate price change percentage
export const calculatePriceChangePercent = (oldPrice, newPrice) => {
  if (!oldPrice || oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
};

// Calculate price performance from historical data
export const calculatePricePerformance = (historicalPrices, days = 30) => {
  if (!historicalPrices || historicalPrices.length < 2) return null;

  const sortedPrices = [...historicalPrices].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  const recentPrices = sortedPrices.slice(-days);
  if (recentPrices.length < 2) return null;

  const startPrice = recentPrices[0].close;
  const endPrice = recentPrices[recentPrices.length - 1].close;

  return {
    startPrice,
    endPrice,
    change: endPrice - startPrice,
    changePercent: calculatePriceChangePercent(startPrice, endPrice),
    high: Math.max(...recentPrices.map(p => p.high || p.close)),
    low: Math.min(...recentPrices.map(p => p.low || p.close)),
    data: recentPrices
  };
};

// Normalize historical prices to percentage (for comparison charts)
export const normalizePricesToPercent = (historicalPrices) => {
  if (!historicalPrices || historicalPrices.length === 0) return [];

  const sortedPrices = [...historicalPrices].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  const basePrice = sortedPrices[0].close;
  if (!basePrice || basePrice === 0) return sortedPrices;

  return sortedPrices.map(price => ({
    ...price,
    normalizedClose: ((price.close / basePrice) - 1) * 100
  }));
};

// Get sparkline data (simplified price array for mini charts)
export const getSparklineData = (historicalPrices, days = 30) => {
  if (!historicalPrices || historicalPrices.length === 0) return [];

  const sortedPrices = [...historicalPrices]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-days);

  return sortedPrices.map(p => ({
    date: p.date,
    value: p.close
  }));
};

// Calculate metrics for radar chart comparison
export const calculateRadarMetrics = (stocks) => {
  if (!stocks || stocks.length === 0) return [];

  // Get min/max for normalization
  const validScores = stocks.filter(s => s.score != null);
  const validGrowth = stocks.filter(s => s.revenueGrowth != null);
  const validPE = stocks.filter(s => s.forwardPE != null && s.forwardPE > 0);
  const validUpside = stocks.filter(s => s.upside != null);
  const validAI = stocks.filter(s => s.aiRevenue != null);

  const minGrowth = Math.min(...validGrowth.map(s => s.revenueGrowth), 0);
  const maxGrowth = Math.max(...validGrowth.map(s => s.revenueGrowth), 100);
  const minPE = Math.min(...validPE.map(s => s.forwardPE), 5);
  const maxPE = Math.max(...validPE.map(s => s.forwardPE), 150);
  const minUpside = Math.min(...validUpside.map(s => s.upside), -50);
  const maxUpside = Math.max(...validUpside.map(s => s.upside), 100);

  return stocks.map(stock => ({
    ticker: stock.ticker,
    name: stock.name,
    metrics: {
      score: stock.score || 50,
      growth: normalizeMetric(stock.revenueGrowth, minGrowth, maxGrowth),
      value: inverseNormalizeMetric(stock.forwardPE, minPE, maxPE), // Lower P/E = higher value
      momentum: normalizeMetric(stock.upside, minUpside, maxUpside),
      aiExposure: stock.aiRevenue || 50
    }
  }));
};

// Get comparison table metrics with highlighting
export const getComparisonMetrics = (stocks) => {
  if (!stocks || stocks.length === 0) return { stocks: [], highlights: {} };

  const metrics = ['price', 'marketCap', 'peRatio', 'forwardPE', 'revenueGrowth', 'score', 'upside', 'priceTarget'];

  const highlights = {};

  metrics.forEach(metric => {
    const values = stocks
      .map((s, idx) => ({ value: s[metric], idx }))
      .filter(v => v.value !== null && v.value !== undefined);

    if (values.length === 0) {
      highlights[metric] = { best: null, worst: null };
      return;
    }

    // For most metrics, higher is better
    // Exception: P/E ratios (lower is better for value investors)
    const isLowerBetter = metric === 'peRatio' || metric === 'forwardPE';

    if (isLowerBetter) {
      const sorted = [...values].sort((a, b) => a.value - b.value);
      highlights[metric] = {
        best: sorted[0].idx,
        worst: sorted[sorted.length - 1].idx
      };
    } else {
      const sorted = [...values].sort((a, b) => b.value - a.value);
      highlights[metric] = {
        best: sorted[0].idx,
        worst: sorted[sorted.length - 1].idx
      };
    }
  });

  return { stocks, highlights };
};

// Format large numbers for display
export const formatMarketCap = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
  if (value >= 1) return `$${value.toFixed(0)}B`;
  return `$${(value * 1000).toFixed(0)}M`;
};

// Format percentage with sign
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

// Format price
export const formatPrice = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Get analyst rating color
export const getRatingColor = (rating) => {
  if (!rating) return 'slate';
  const lowerRating = rating.toLowerCase();
  if (lowerRating.includes('strong buy')) return 'emerald';
  if (lowerRating.includes('buy')) return 'green';
  if (lowerRating.includes('hold')) return 'yellow';
  if (lowerRating.includes('sell')) return 'red';
  if (lowerRating.includes('speculative')) return 'purple';
  return 'slate';
};

// Generate mock historical prices for a stock
export const generateMockHistoricalPrices = (currentPrice, days = 365, volatility = 0.02) => {
  const prices = [];
  let price = currentPrice * (1 - Math.random() * 0.3); // Start 0-30% lower

  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random daily change with slight upward bias
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price * 0.5, price + change); // Don't go below 50% of current

    // On last day, set to actual current price
    if (i === 0) {
      price = currentPrice;
    }

    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);

    prices.push({
      date: date.toISOString().split('T')[0],
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high,
      low,
      close: price,
      volume: Math.floor(Math.random() * 50000000) + 1000000
    });
  }

  return prices;
};

// Generate mock earnings date
export const generateMockEarningsDate = () => {
  const today = new Date();
  const daysAhead = Math.floor(Math.random() * 90) + 7; // 7-97 days from now
  const earningsDate = new Date(today);
  earningsDate.setDate(earningsDate.getDate() + daysAhead);
  return earningsDate.toISOString().split('T')[0];
};

export default {
  normalizeMetric,
  inverseNormalizeMetric,
  getDaysUntilDate,
  formatDaysUntilEarnings,
  getEarningsUrgencyColor,
  calculatePriceChangePercent,
  calculatePricePerformance,
  normalizePricesToPercent,
  getSparklineData,
  calculateRadarMetrics,
  getComparisonMetrics,
  formatMarketCap,
  formatPercent,
  formatPrice,
  getRatingColor,
  generateMockHistoricalPrices,
  generateMockEarningsDate
};
