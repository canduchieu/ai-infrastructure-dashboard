import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { getSparklineData, calculatePricePerformance } from '../utils/calculations';

// Custom tooltip for sparkline
const SparklineTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded px-2 py-1 shadow-lg">
        <p className="text-white text-xs font-medium">${data.value?.toFixed(2)}</p>
        <p className="text-slate-400 text-[10px]">
          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    );
  }
  return null;
};

const PriceSparkline = ({
  historicalPrices,
  days = 30,
  width = 120,
  height = 40,
  showTooltip = false,
  showChange = false,
  className = ''
}) => {
  const data = useMemo(() => {
    return getSparklineData(historicalPrices, days);
  }, [historicalPrices, days]);

  const performance = useMemo(() => {
    return calculatePricePerformance(historicalPrices, days);
  }, [historicalPrices, days]);

  if (!data || data.length < 2) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800/30 rounded ${className}`}
        style={{ width, height }}
      >
        <span className="text-slate-600 text-xs">No data</span>
      </div>
    );
  }

  const isPositive = performance?.changePercent >= 0;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const fillColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <defs>
              <linearGradient id={`gradient-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            {showTooltip && <Tooltip content={<SparklineTooltip />} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={1.5}
              fill={`url(#gradient-${isPositive ? 'up' : 'down'})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showChange && performance && (
        <div className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{performance.changePercent.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

// Larger sparkline for detail views
export const LargeSparkline = ({
  historicalPrices,
  days = 30,
  height = 100,
  className = ''
}) => {
  const data = useMemo(() => {
    return getSparklineData(historicalPrices, days);
  }, [historicalPrices, days]);

  const performance = useMemo(() => {
    return calculatePricePerformance(historicalPrices, days);
  }, [historicalPrices, days]);

  if (!data || data.length < 2) {
    return (
      <div className={`flex items-center justify-center bg-slate-800/30 rounded-xl h-[${height}px] ${className}`}>
        <span className="text-slate-600">No historical data available</span>
      </div>
    );
  }

  const isPositive = performance?.changePercent >= 0;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const fillColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{days}-Day Performance</span>
        <div className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{performance?.changePercent.toFixed(2)}%
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={`large-gradient-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={<SparklineTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#large-gradient-${isPositive ? 'up' : 'down'})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {performance && (
        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
          <span>Low: ${performance.low.toFixed(2)}</span>
          <span>High: ${performance.high.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default PriceSparkline;
