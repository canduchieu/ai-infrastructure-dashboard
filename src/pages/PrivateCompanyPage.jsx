import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Lock, TrendingUp, Users, DollarSign,
  Calendar, Globe, AlertTriangle, CheckCircle, ExternalLink,
  Briefcase, Target, Info
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

import { privateCompanies } from '../data/researchData';
import CommandPalette from '../components/CommandPalette';

const PrivateCompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const company = useMemo(() => {
    return privateCompanies[id] || null;
  }, [id]);

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Company Not Found</h2>
          <p className="text-slate-400 mb-4">The company you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/research')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value, inMillions = true) => {
    if (!value) return 'N/A';
    if (inMillions) {
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
      return `$${value}M`;
    }
    return `$${value}B`;
  };

  // Radar chart data
  const radarData = [
    { metric: 'Score', value: company.score || 0, fullMark: 100 },
    { metric: 'AI Revenue', value: company.aiRevenue || 0, fullMark: 100 },
    { metric: 'Growth', value: Math.min(company.revenueGrowth || 0, 100), fullMark: 100 },
    { metric: 'Funding', value: Math.min((company.totalFunding / 10), 100), fullMark: 100 },
    { metric: 'Valuation', value: Math.min((company.valuation / 1000), 100), fullMark: 100 }
  ];

  // Order badge color
  const getOrderColor = (order) => {
    switch (order) {
      case '1st': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case '2nd': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case '3rd': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'compare', label: 'Compare', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <CommandPalette />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <button
                onClick={() => navigate('/research')}
                className="p-2.5 hover:bg-slate-800 active:bg-slate-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 flex items-center justify-center text-lg md:text-xl font-bold text-white border border-purple-500/30 flex-shrink-0">
                  {company.logo || company.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h1 className="text-base md:text-xl font-bold text-white truncate">{company.name}</h1>
                    <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-xs md:text-sm text-slate-400 hidden sm:inline">Private</span>
                    <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full border ${getOrderColor(company.order)}`}>
                      {company.order}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-lg md:text-2xl font-bold text-white">{formatCurrency(company.valuation)}</p>
                <p className="text-[10px] md:text-xs text-slate-400">{company.valuationDate}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold text-purple-400">{company.score}</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-3 md:px-6">
          <div className="flex gap-0.5 md:gap-1 border-b border-slate-700/50 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium transition-colors border-b-2 -mb-[2px] min-h-[44px] whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-400'
                    : 'text-slate-400 border-transparent hover:text-slate-300 active:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-8 pb-safe">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 md:space-y-6">
            {/* Mobile: Show valuation if hidden in header */}
            <div className="sm:hidden bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Valuation</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(company.valuation)}</p>
                </div>
                <p className="text-xs text-slate-400">{company.valuationDate}</p>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">Valuation</p>
                <p className="text-lg md:text-xl font-bold text-white">{formatCurrency(company.valuation)}</p>
                {company.previousValuation && (
                  <p className="text-[10px] md:text-xs text-emerald-400 mt-0.5 md:mt-1">
                    +{((company.valuation / company.previousValuation - 1) * 100).toFixed(0)}% prev
                  </p>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">Funding</p>
                <p className="text-lg md:text-xl font-bold text-white">{formatCurrency(company.totalFunding)}</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1">{company.lastRoundType}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">Growth</p>
                <p className={`text-lg md:text-xl font-bold ${company.revenueGrowth ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {company.revenueGrowth ? `+${company.revenueGrowth}%` : 'N/A'}
                </p>
                {company.revenue && (
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1">{formatCurrency(company.revenue)} ARR</p>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-[10px] md:text-xs text-slate-500 mb-0.5 md:mb-1">AI Revenue</p>
                <p className="text-lg md:text-xl font-bold text-purple-400">{company.aiRevenue}%</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1">of total</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Opportunity */}
                <div className="bg-gradient-to-br from-emerald-900/20 to-slate-800/50 rounded-xl p-6 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-emerald-400">Investment Opportunity</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{company.opportunity}</p>
                </div>

                {/* Risk */}
                <div className="bg-gradient-to-br from-red-900/20 to-slate-800/50 rounded-xl p-6 border border-red-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Key Risks</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{company.risk}</p>
                </div>

                {/* Company Info */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                  <h3 className="font-semibold text-white mb-4">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Founded</p>
                      <p className="text-sm text-white">{company.founded}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Headquarters</p>
                      <p className="text-sm text-white">{company.headquarters}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Employees</p>
                      <p className="text-sm text-white">{company.employees}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Valuation Date</p>
                      <p className="text-sm text-white">{company.valuationDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Radar Chart */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                  <h3 className="font-semibold text-white mb-4">Investment Profile</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: '#64748b', fontSize: 10 }}
                        />
                        <Radar
                          name="Profile"
                          dataKey="value"
                          stroke="#a855f7"
                          fill="#a855f7"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Investors */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-white">Key Investors</h3>
                  </div>
                  <div className="space-y-2">
                    {company.keyInvestors.map((investor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-slate-300">{investor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sources */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-slate-400" />
                    <h3 className="font-semibold text-white">Data Sources</h3>
                  </div>
                  <div className="space-y-2">
                    {company.sourceUrls?.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300 truncate">{company.sources[idx]}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funding Tab */}
        {activeTab === 'funding' && (
          <div className="space-y-6">
            {/* Funding Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 rounded-xl p-6 border border-purple-500/30">
                <p className="text-xs text-slate-400 mb-2">Total Funding Raised</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(company.totalFunding)}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/30 to-slate-800/50 rounded-xl p-6 border border-cyan-500/30">
                <p className="text-xs text-slate-400 mb-2">Latest Round</p>
                <p className="text-3xl font-bold text-white">{company.lastRoundType}</p>
                {company.lastRoundAmount && (
                  <p className="text-sm text-cyan-400 mt-1">{formatCurrency(company.lastRoundAmount)}</p>
                )}
              </div>
              <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 rounded-xl p-6 border border-emerald-500/30">
                <p className="text-xs text-slate-400 mb-2">Current Valuation</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(company.valuation)}</p>
                <p className="text-sm text-slate-400 mt-1">as of {company.valuationDate}</p>
              </div>
            </div>

            {/* Valuation Growth */}
            {company.previousValuation && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <h3 className="font-semibold text-white mb-4">Valuation Growth</h3>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Previous</p>
                    <p className="text-xl font-bold text-slate-400">{formatCurrency(company.previousValuation)}</p>
                  </div>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                      style={{ width: `${Math.min((company.valuation / company.previousValuation) * 33, 100)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Current</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(company.valuation)}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                    <p className="text-xl font-bold text-emerald-400">
                      +{((company.valuation / company.previousValuation - 1) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-400">Growth</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Investors */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
              <h3 className="font-semibold text-white mb-4">Key Investors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {company.keyInvestors.map((investor, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                      <Briefcase className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-white font-medium">{investor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* IPO Watch */}
            <div className="bg-gradient-to-br from-amber-900/20 to-slate-800/50 rounded-xl p-6 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-amber-400">IPO Watch</h3>
              </div>
              <p className="text-slate-300">
                {company.name} is a private company. At a {formatCurrency(company.valuation)} valuation,
                it could be a candidate for public offering in the next 12-24 months.
                Watch for S-1 filings with the SEC.
              </p>
            </div>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
              <h3 className="font-semibold text-white mb-4">Peer Comparison (Private Companies)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400">Company</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400">Valuation</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400">Funding</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400">Order</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(privateCompanies)
                      .sort((a, b) => b.valuation - a.valuation)
                      .map((comp) => (
                        <tr
                          key={comp.id}
                          className={`border-b border-slate-700/30 ${
                            comp.id === company.id ? 'bg-purple-500/10' : 'hover:bg-slate-700/30'
                          } cursor-pointer transition-colors`}
                          onClick={() => navigate(`/company/${comp.id}`)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-sm font-bold text-white">
                                {comp.logo || comp.name.charAt(0)}
                              </div>
                              <span className="font-medium text-white">{comp.name}</span>
                              {comp.id === company.id && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300">Current</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-white font-medium">
                            {formatCurrency(comp.valuation)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">
                            {formatCurrency(comp.totalFunding)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">
                            {comp.revenue ? formatCurrency(comp.revenue) : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${getOrderColor(comp.order)}`}>
                              {comp.order}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-purple-400 font-medium">
                            {comp.score}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateCompanyPage;
