import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CollapsibleSection = ({
  title,
  icon: Icon,
  defaultExpanded = false,
  children,
  badge,
  badgeColor = 'purple'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const badgeColors = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl md:rounded-2xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-700/30 active:bg-slate-700/40 transition-colors min-h-[52px]"
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />}
          <span className="text-base md:text-lg font-semibold text-white truncate">{title}</span>
          {badge && (
            <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border flex-shrink-0 ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        {/* Single rotating chevron - better UX than switching icons */}
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-2 transition-transform duration-200 ease-out ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content with CSS Grid animation (better performance than max-height) */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 md:px-6 pb-4 md:pb-6 pt-1 md:pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
