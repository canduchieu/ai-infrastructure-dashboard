import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import { getAllSectors } from '../services/dataService';

// Range Slider Component
const RangeSlider = ({ label, min, max, minValue, maxValue, onChange, step = 1, unit = '' }) => {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), localMax - step);
    setLocalMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), localMin + step);
    setLocalMax(value);
  };

  const handleBlur = () => {
    onChange(localMin, localMax);
  };

  // Calculate percentage for gradient
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-xs text-slate-500">
          {localMin}{unit} - {localMax}{unit}
        </span>
      </div>
      <div className="relative h-2">
        {/* Track */}
        <div className="absolute inset-0 bg-slate-700 rounded-full" />
        {/* Active range */}
        <div
          className="absolute h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={handleBlur}
          onTouchEnd={handleBlur}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={handleBlur}
          onTouchEnd={handleBlur}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};

// Collapsible Section
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-700/50 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-sm font-medium text-slate-300">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  filters,
  setFilter,
  toggleSector,
  toggleRating,
  resetFilters,
  hasActiveFilters,
  activeFilterCount,
  onClose // For mobile
}) => {
  const sectors = getAllSectors();

  const ratings = [
    { value: 'strong buy', label: 'Strong Buy', color: 'emerald' },
    { value: 'buy', label: 'Buy', color: 'green' },
    { value: 'hold', label: 'Hold', color: 'yellow' },
    { value: 'speculative', label: 'Speculative', color: 'purple' }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ticker..."
          value={filters.searchQuery}
          onChange={(e) => setFilter('searchQuery', e.target.value)}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Sectors */}
      <FilterSection title="Sectors" defaultOpen={true}>
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              key={sector.key}
              onClick={() => toggleSector(sector.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filters.sectors.includes(sector.key)
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              {sector.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Score Range */}
      <FilterSection title="Investment Score" defaultOpen={true}>
        <RangeSlider
          label="Score Range"
          min={0}
          max={100}
          minValue={filters.minScore}
          maxValue={filters.maxScore}
          onChange={(min, max) => {
            setFilter('minScore', min);
            setFilter('maxScore', max);
          }}
        />
      </FilterSection>

      {/* Valuation */}
      <FilterSection title="Valuation" defaultOpen={false}>
        <RangeSlider
          label="P/E Ratio"
          min={0}
          max={200}
          minValue={filters.minPE}
          maxValue={filters.maxPE}
          onChange={(min, max) => {
            setFilter('minPE', min);
            setFilter('maxPE', max);
          }}
          unit="x"
        />
        <RangeSlider
          label="Forward P/E"
          min={0}
          max={150}
          minValue={filters.minForwardPE}
          maxValue={filters.maxForwardPE}
          onChange={(min, max) => {
            setFilter('minForwardPE', min);
            setFilter('maxForwardPE', max);
          }}
          unit="x"
        />
      </FilterSection>

      {/* Growth & Performance */}
      <FilterSection title="Growth & Performance" defaultOpen={false}>
        <RangeSlider
          label="Revenue Growth"
          min={-50}
          max={200}
          minValue={filters.minGrowth}
          maxValue={filters.maxGrowth}
          onChange={(min, max) => {
            setFilter('minGrowth', min);
            setFilter('maxGrowth', max);
          }}
          unit="%"
        />
        <RangeSlider
          label="Price Target Upside"
          min={-100}
          max={200}
          minValue={filters.minUpside}
          maxValue={filters.maxUpside}
          onChange={(min, max) => {
            setFilter('minUpside', min);
            setFilter('maxUpside', max);
          }}
          unit="%"
        />
      </FilterSection>

      {/* Market Cap */}
      <FilterSection title="Market Cap ($B)" defaultOpen={false}>
        <RangeSlider
          label="Market Cap"
          min={0}
          max={5000}
          step={10}
          minValue={filters.minMarketCap}
          maxValue={filters.maxMarketCap}
          onChange={(min, max) => {
            setFilter('minMarketCap', min);
            setFilter('maxMarketCap', max);
          }}
          unit="B"
        />
        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { label: 'Mega (>$1T)', min: 1000, max: 5000 },
            { label: 'Large ($100B-1T)', min: 100, max: 1000 },
            { label: 'Mid ($10-100B)', min: 10, max: 100 },
            { label: 'Small (<$10B)', min: 0, max: 10 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setFilter('minMarketCap', preset.min);
                setFilter('maxMarketCap', preset.max);
              }}
              className="px-2 py-1 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Analyst Rating */}
      <FilterSection title="Analyst Rating" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => (
            <button
              key={rating.value}
              onClick={() => toggleRating(rating.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filters.ratings.includes(rating.value)
                  ? `bg-${rating.color}-500/20 text-${rating.color}-400 border border-${rating.color}-500/30`
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* HBM Exposure */}
      <FilterSection title="Special Filters" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hbmExposure === true}
              onChange={(e) => setFilter('hbmExposure', e.target.checked ? true : null)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500/20"
            />
            <span className="text-sm text-slate-300">HBM Exposure Only</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;
