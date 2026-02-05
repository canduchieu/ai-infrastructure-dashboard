import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Default filter values
const defaultFilters = {
  sectors: [],
  minScore: 0,
  maxScore: 100,
  minPE: 0,
  maxPE: 200,
  minForwardPE: 0,
  maxForwardPE: 150,
  minGrowth: -50,
  maxGrowth: 200,
  minUpside: -100,
  maxUpside: 200,
  minMarketCap: 0,
  maxMarketCap: 5000,
  hbmExposure: null,
  ratings: [],
  searchQuery: '',
  sortBy: 'score',
  sortOrder: 'desc'
};

// Encode filters to URL params
const encodeFilters = (filters) => {
  const params = new URLSearchParams();

  if (filters.sectors.length > 0) {
    params.set('sectors', filters.sectors.join(','));
  }
  if (filters.minScore > 0) params.set('minScore', filters.minScore);
  if (filters.maxScore < 100) params.set('maxScore', filters.maxScore);
  if (filters.minPE > 0) params.set('minPE', filters.minPE);
  if (filters.maxPE < 200) params.set('maxPE', filters.maxPE);
  if (filters.minForwardPE > 0) params.set('minForwardPE', filters.minForwardPE);
  if (filters.maxForwardPE < 150) params.set('maxForwardPE', filters.maxForwardPE);
  if (filters.minGrowth > -50) params.set('minGrowth', filters.minGrowth);
  if (filters.maxGrowth < 200) params.set('maxGrowth', filters.maxGrowth);
  if (filters.minUpside > -100) params.set('minUpside', filters.minUpside);
  if (filters.maxUpside < 200) params.set('maxUpside', filters.maxUpside);
  if (filters.minMarketCap > 0) params.set('minMarketCap', filters.minMarketCap);
  if (filters.maxMarketCap < 5000) params.set('maxMarketCap', filters.maxMarketCap);
  if (filters.hbmExposure !== null) params.set('hbm', filters.hbmExposure);
  if (filters.ratings.length > 0) params.set('ratings', filters.ratings.join(','));
  if (filters.searchQuery) params.set('q', filters.searchQuery);
  if (filters.sortBy !== 'score') params.set('sortBy', filters.sortBy);
  if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

  return params;
};

// Decode URL params to filters
const decodeFilters = (searchParams) => {
  const filters = { ...defaultFilters };

  const sectors = searchParams.get('sectors');
  if (sectors) filters.sectors = sectors.split(',');

  const minScore = searchParams.get('minScore');
  if (minScore) filters.minScore = parseInt(minScore, 10);

  const maxScore = searchParams.get('maxScore');
  if (maxScore) filters.maxScore = parseInt(maxScore, 10);

  const minPE = searchParams.get('minPE');
  if (minPE) filters.minPE = parseInt(minPE, 10);

  const maxPE = searchParams.get('maxPE');
  if (maxPE) filters.maxPE = parseInt(maxPE, 10);

  const minForwardPE = searchParams.get('minForwardPE');
  if (minForwardPE) filters.minForwardPE = parseInt(minForwardPE, 10);

  const maxForwardPE = searchParams.get('maxForwardPE');
  if (maxForwardPE) filters.maxForwardPE = parseInt(maxForwardPE, 10);

  const minGrowth = searchParams.get('minGrowth');
  if (minGrowth) filters.minGrowth = parseInt(minGrowth, 10);

  const maxGrowth = searchParams.get('maxGrowth');
  if (maxGrowth) filters.maxGrowth = parseInt(maxGrowth, 10);

  const minUpside = searchParams.get('minUpside');
  if (minUpside) filters.minUpside = parseInt(minUpside, 10);

  const maxUpside = searchParams.get('maxUpside');
  if (maxUpside) filters.maxUpside = parseInt(maxUpside, 10);

  const minMarketCap = searchParams.get('minMarketCap');
  if (minMarketCap) filters.minMarketCap = parseInt(minMarketCap, 10);

  const maxMarketCap = searchParams.get('maxMarketCap');
  if (maxMarketCap) filters.maxMarketCap = parseInt(maxMarketCap, 10);

  const hbm = searchParams.get('hbm');
  if (hbm !== null) filters.hbmExposure = hbm === 'true';

  const ratings = searchParams.get('ratings');
  if (ratings) filters.ratings = ratings.split(',');

  const q = searchParams.get('q');
  if (q) filters.searchQuery = q;

  const sortBy = searchParams.get('sortBy');
  if (sortBy) filters.sortBy = sortBy;

  const sortOrder = searchParams.get('sortOrder');
  if (sortOrder) filters.sortOrder = sortOrder;

  return filters;
};

export const useScreeningFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState(() => decodeFilters(searchParams));

  // Update URL when filters change
  useEffect(() => {
    const params = encodeFilters(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Update a single filter
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Update multiple filters at once
  const setMultipleFilters = useCallback((updates) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Toggle a sector
  const toggleSector = useCallback((sector) => {
    setFilters(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  }, []);

  // Toggle a rating
  const toggleRating = useCallback((rating) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    }));
  }, []);

  // Set sort
  const setSort = useCallback((sortBy, sortOrder = 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.sectors.length > 0 ||
      filters.minScore > 0 ||
      filters.maxScore < 100 ||
      filters.minPE > 0 ||
      filters.maxPE < 200 ||
      filters.minForwardPE > 0 ||
      filters.maxForwardPE < 150 ||
      filters.minGrowth > -50 ||
      filters.maxGrowth < 200 ||
      filters.minUpside > -100 ||
      filters.maxUpside < 200 ||
      filters.minMarketCap > 0 ||
      filters.maxMarketCap < 5000 ||
      filters.hbmExposure !== null ||
      filters.ratings.length > 0 ||
      filters.searchQuery !== ''
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sectors.length > 0) count++;
    if (filters.minScore > 0 || filters.maxScore < 100) count++;
    if (filters.minPE > 0 || filters.maxPE < 200) count++;
    if (filters.minForwardPE > 0 || filters.maxForwardPE < 150) count++;
    if (filters.minGrowth > -50 || filters.maxGrowth < 200) count++;
    if (filters.minUpside > -100 || filters.maxUpside < 200) count++;
    if (filters.minMarketCap > 0 || filters.maxMarketCap < 5000) count++;
    if (filters.hbmExposure !== null) count++;
    if (filters.ratings.length > 0) count++;
    if (filters.searchQuery !== '') count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    resetFilters,
    toggleSector,
    toggleRating,
    setSort,
    hasActiveFilters,
    activeFilterCount,
    defaultFilters
  };
};

export default useScreeningFilters;
