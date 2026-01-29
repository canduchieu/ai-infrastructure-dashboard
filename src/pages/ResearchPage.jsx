import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  ArrowLeft, BookOpen, TrendingUp, AlertTriangle, Link as LinkIcon,
  Target, Calendar, Shield, ChevronRight, ExternalLink, CheckCircle,
  Info, Users, Layers, Database, Globe, CreditCard, Building2
} from 'lucide-react';

import CollapsibleSection from '../components/CollapsibleSection';
import ResearchCompanyCard from '../components/ResearchCompanyCard';
import CommandPalette from '../components/CommandPalette';
import { researchTheses, privateCompanies, vibeCodingBeneficiaries } from '../data/researchData';
import { stocksData } from '../data/stocksData';

const ResearchPage = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState('all');

  // Get current thesis
  const thesis = researchTheses[0]; // Currently only one thesis

  // Get public companies from stocksData vibeCoding sector
  const publicCompanies = useMemo(() => {
    return stocksData.vibeCoding || [];
  }, []);

  // Combine data for beneficiary sections
  const beneficiaryData = useMemo(() => {
    const firstOrder = vibeCodingBeneficiaries.firstOrder.map(item => ({
      ...privateCompanies[item.id],
      isPrivate: true,
      highlight: item.highlight
    }));

    const secondOrderPrivate = vibeCodingBeneficiaries.secondOrder
      .filter(item => item.isPrivate)
      .map(item => ({
        ...privateCompanies[item.id],
        isPrivate: true,
        highlight: item.highlight
      }));

    const secondOrderPublic = publicCompanies
      .filter(c => c.order === '2nd')
      .map(c => ({ ...c, isPrivate: false, highlight: c.thesisHighlight }));

    const thirdOrderPublic = publicCompanies
      .filter(c => c.order === '3rd')
      .map(c => ({ ...c, isPrivate: false, highlight: c.thesisHighlight }));

    return {
      first: firstOrder,
      second: [...secondOrderPrivate, ...secondOrderPublic],
      third: thirdOrderPublic
    };
  }, [publicCompanies]);

  // Growth comparison data for chart
  const growthChartData = useMemo(() => {
    const allPublic = publicCompanies
      .filter(c => c.revenueGrowth)
      .map(c => ({
        name: c.ticker,
        growth: c.revenueGrowth,
        order: c.order
      }))
      .sort((a, b) => b.growth - a.growth);

    return allPublic;
  }, [publicCompanies]);

  // Order colors for chart
  const getOrderColor = (order) => {
    switch (order) {
      case '1st': return '#A855F7';
      case '2nd': return '#06B6D4';
      case '3rd': return '#10B981';
      default: return '#64748B';
    }
  };

  // Conviction badge color
  const getConvictionColor = (level) => {
    switch (level) {
      case 'High': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Risk severity color
  const getRiskColor = (severity) => {
    switch (severity) {
      case 'High': return 'border-red-500/50 bg-red-500/10';
      case 'Medium': return 'border-amber-500/50 bg-amber-500/10';
      case 'Low': case 'Low-Medium': return 'border-emerald-500/50 bg-emerald-500/10';
      default: return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <CommandPalette />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="p-2.5 hover:bg-slate-800 active:bg-slate-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" />
                  <h1 className="text-base md:text-xl font-bold text-white truncate">Research & Theses</h1>
                </div>
                <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Investment research backed by verified data</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full border ${getConvictionColor(thesis.convictionLevel)}`}>
                {thesis.convictionLevel}
              </span>
              <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50 hidden sm:flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {thesis.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6 pb-safe">
        {/* Thesis Title Card */}
        <div className="bg-gradient-to-br from-purple-900/30 via-slate-800/50 to-cyan-900/30 rounded-xl md:rounded-2xl border border-purple-500/30 p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
            <div>
              <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-2 md:mb-3 inline-block">
                ACTIVE THESIS
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">{thesis.title}</h2>
              <p className="text-slate-400 text-sm md:text-base">{thesis.subtitle}</p>
            </div>
            <div className="text-left md:text-right flex md:flex-col items-center md:items-end gap-2 md:gap-0">
              <p className="text-xs md:text-sm text-slate-500">Time Horizon:</p>
              <p className="text-sm md:text-lg font-semibold text-white">{thesis.timeHorizon}</p>
            </div>
          </div>
        </div>

        {/* Executive Summary - Always Visible */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl md:rounded-2xl border border-slate-700/50 p-3 md:p-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            <h3 className="text-base md:text-lg font-semibold text-white">Executive Summary</h3>
          </div>

          <p className="text-slate-300 leading-relaxed mb-4 md:mb-6 whitespace-pre-line text-sm md:text-base">
            {thesis.executiveSummary}
          </p>

          {/* Key Stats - Horizontal scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:gap-4">
            {thesis.keyStats.map((stat, idx) => (
              <div key={idx} className="flex-shrink-0 w-[140px] md:w-auto bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700/30">
                <p className="text-xl md:text-2xl font-bold text-cyan-400 mb-0.5 md:mb-1">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-slate-400 mb-1 md:mb-2 leading-tight">{stat.label}</p>
                <p className="text-[10px] md:text-xs text-slate-500 truncate">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order of Benefits Visualization */}
        <CollapsibleSection
          title="Order of Benefits"
          icon={Layers}
          defaultExpanded={true}
          badge="Interactive"
          badgeColor="cyan"
        >
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-6">
              Click on any tier to filter companies. The thesis identifies three orders of beneficiaries,
              each with different risk/reward profiles.
            </p>

            {/* Flow Diagram - Horizontal scroll on mobile */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0 md:overflow-visible">
              {/* 1st Order */}
              <div
                onClick={() => setActiveOrder(activeOrder === '1st' ? 'all' : '1st')}
                className={`flex-shrink-0 w-[200px] md:w-auto md:flex-1 p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${
                  activeOrder === '1st' || activeOrder === 'all'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 bg-slate-800/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm md:text-base">1</div>
                  <h4 className="font-semibold text-white text-sm md:text-base">AI Coding Tools</h4>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3">Direct tool providers</p>
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-purple-500/20 text-purple-300">
                    {beneficiaryData.first.length} Cos
                  </span>
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-red-500/20 text-red-300">
                    High Risk
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center flex-shrink-0">
                <ChevronRight className="w-6 h-6 text-slate-600" />
              </div>

              {/* 2nd Order */}
              <div
                onClick={() => setActiveOrder(activeOrder === '2nd' ? 'all' : '2nd')}
                className={`flex-shrink-0 w-[200px] md:w-auto md:flex-1 p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${
                  activeOrder === '2nd' || activeOrder === 'all'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm md:text-base">2</div>
                  <h4 className="font-semibold text-white text-sm md:text-base">Platform Owners</h4>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3">Distribution & payment</p>
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                    {beneficiaryData.second.length} Cos
                  </span>
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-amber-500/20 text-amber-300">
                    Med Risk
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center flex-shrink-0">
                <ChevronRight className="w-6 h-6 text-slate-600" />
              </div>

              {/* 3rd Order */}
              <div
                onClick={() => setActiveOrder(activeOrder === '3rd' ? 'all' : '3rd')}
                className={`flex-shrink-0 w-[200px] md:w-auto md:flex-1 p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${
                  activeOrder === '3rd' || activeOrder === 'all'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm md:text-base">3</div>
                  <h4 className="font-semibold text-white text-sm md:text-base">Infrastructure</h4>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3">Backend & DevOps</p>
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    {beneficiaryData.third.length} Cos
                  </span>
                  <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    Lower Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Order Descriptions */}
            <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              {(activeOrder === 'all' || activeOrder === '1st') && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-purple-400 mb-1">{thesis.orders.first.title}</h5>
                  <p className="text-xs text-slate-400">{thesis.orders.first.description}</p>
                  <p className="text-xs text-purple-300 mt-2 italic">"{thesis.orders.first.keyInsight}"</p>
                </div>
              )}
              {(activeOrder === 'all' || activeOrder === '2nd') && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-cyan-400 mb-1">{thesis.orders.second.title}</h5>
                  <p className="text-xs text-slate-400">{thesis.orders.second.description}</p>
                  <p className="text-xs text-cyan-300 mt-2 italic">"{thesis.orders.second.keyInsight}"</p>
                </div>
              )}
              {(activeOrder === 'all' || activeOrder === '3rd') && (
                <div>
                  <h5 className="text-sm font-semibold text-emerald-400 mb-1">{thesis.orders.third.title}</h5>
                  <p className="text-xs text-slate-400">{thesis.orders.third.description}</p>
                  <p className="text-xs text-emerald-300 mt-2 italic">"{thesis.orders.third.keyInsight}"</p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Beneficiary Analysis */}
        <CollapsibleSection
          title="Beneficiary Analysis"
          icon={Users}
          defaultExpanded={true}
          badge={`${beneficiaryData.first.length + beneficiaryData.second.length + beneficiaryData.third.length} Companies`}
          badgeColor="green"
        >
          {/* Filter Tabs */}
          <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            {['all', '1st', '2nd', '3rd'].map((order) => (
              <button
                key={order}
                onClick={() => setActiveOrder(order)}
                className={`px-3 md:px-4 py-2 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all min-h-[44px] flex-shrink-0 whitespace-nowrap ${
                  activeOrder === order
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50 active:bg-slate-700'
                }`}
              >
                {order === 'all' ? 'All' : `${order}`}
              </button>
            ))}
          </div>

          {/* 1st Order Companies */}
          {(activeOrder === 'all' || activeOrder === '1st') && beneficiaryData.first.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 text-[10px] md:text-xs font-bold">1</div>
                <h4 className="font-semibold text-white text-sm md:text-base">1st Order: AI Coding Tools</h4>
                <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Private
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {beneficiaryData.first.map((company) => (
                  <ResearchCompanyCard
                    key={company.id}
                    company={company}
                    isPrivate={true}
                    order="1st"
                    highlight={company.highlight}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2nd Order Companies */}
          {(activeOrder === 'all' || activeOrder === '2nd') && beneficiaryData.second.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-400 text-[10px] md:text-xs font-bold">2</div>
                <h4 className="font-semibold text-white text-sm md:text-base">2nd Order: Platform Owners</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {beneficiaryData.second.map((company, idx) => (
                  <ResearchCompanyCard
                    key={company.id || company.ticker || idx}
                    company={company}
                    isPrivate={company.isPrivate}
                    order="2nd"
                    highlight={company.highlight}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3rd Order Companies */}
          {(activeOrder === 'all' || activeOrder === '3rd') && beneficiaryData.third.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] md:text-xs font-bold">3</div>
                <h4 className="font-semibold text-white text-sm md:text-base">3rd Order: Infrastructure</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {beneficiaryData.third.map((company, idx) => (
                  <ResearchCompanyCard
                    key={company.ticker || idx}
                    company={company}
                    isPrivate={false}
                    order="3rd"
                    highlight={company.highlight}
                  />
                ))}
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Growth Comparison Chart */}
        <CollapsibleSection
          title="Growth Comparison"
          icon={TrendingUp}
          defaultExpanded={false}
          badge="Public"
          badgeColor="green"
        >
          <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">
            Revenue growth comparison across public company beneficiaries (SEC filings).
          </p>

          <div className="h-64 md:h-80 w-full -mx-2 md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthChartData}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={10}
                  width={35}
                  tickFormatter={(value) => value.length > 6 ? value.substring(0, 6) : value}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}% YoY`, 'Growth']}
                />
                <Bar dataKey="growth" radius={[0, 4, 4, 0]}>
                  {growthChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getOrderColor(entry.order)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-6 mt-3 md:mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-purple-500"></div>
              <span className="text-[10px] md:text-xs text-slate-400">1st</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-cyan-500"></div>
              <span className="text-[10px] md:text-xs text-slate-400">2nd</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] md:text-xs text-slate-400">3rd</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Risks & Bear Case */}
        <CollapsibleSection
          title="Risks & Bear Case"
          icon={AlertTriangle}
          defaultExpanded={false}
          badge={`${thesis.risks.length}`}
          badgeColor="red"
        >
          <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">
            Key risks that could invalidate or reduce the thesis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {thesis.risks.map((risk, idx) => (
              <div
                key={idx}
                className={`p-3 md:p-4 rounded-xl border-2 ${getRiskColor(risk.severity)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-white text-sm md:text-base">{risk.title}</h4>
                  <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0 ${
                    risk.severity === 'High' ? 'bg-red-500/30 text-red-300' :
                    risk.severity === 'Medium' ? 'bg-amber-500/30 text-amber-300' :
                    'bg-emerald-500/30 text-emerald-300'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mb-1.5 md:mb-2">{risk.description}</p>
                <p className="text-[10px] md:text-xs text-slate-500">Source: {risk.source}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Sources */}
        <CollapsibleSection
          title="Verified Sources"
          icon={LinkIcon}
          defaultExpanded={false}
          badge="Tiered"
          badgeColor="purple"
        >
          <p className="text-slate-400 text-sm mb-6">
            All data in this thesis is backed by primary sources (SEC filings, official announcements)
            or reputable publications (Bloomberg, TechCrunch, CNBC).
          </p>

          {/* Tier 1 Sources */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-emerald-400">Tier 1: Official / SEC Sources</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {thesis.sources.tier1.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{source.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* Tier 2 Sources */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4 className="font-semibold text-cyan-400">Tier 2: Major Publications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {thesis.sources.tier2.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 transition-colors"
                >
                  <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{source.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Investment Summary - Always Visible */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Investment Summary</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* High Conviction Picks */}
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-3">HIGH CONVICTION PUBLIC PICKS</h4>
              <div className="space-y-2">
                {publicCompanies
                  .filter(c => c.score >= 82)
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((company, idx) => (
                    <div
                      key={company.ticker}
                      onClick={() => navigate(`/stock/${company.ticker}`)}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-500">{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-white">{company.name}</p>
                          <p className="text-xs text-slate-400">{company.ticker} • {company.order} Order</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-400">{company.score}</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Private Companies to Watch */}
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-3">PRIVATE COMPANIES - IPO WATCH</h4>
              <div className="space-y-2">
                {Object.values(privateCompanies)
                  .sort((a, b) => b.valuation - a.valuation)
                  .map((company) => (
                    <div
                      key={company.id}
                      onClick={() => navigate(`/company/${company.id}`)}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-amber-500/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-sm font-bold text-white">
                          {company.logo || company.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{company.name}</p>
                          <p className="text-xs text-slate-400">{company.order} Order • {company.lastRoundType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-400">${(company.valuation / 1000).toFixed(1)}B</p>
                        <p className="text-xs text-slate-500">Valuation</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Monitoring Metrics */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">KEY METRICS TO MONITOR</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {thesis.monitoringMetrics.map((metric, idx) => (
                <div key={idx} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <p className="text-xs text-slate-300 font-medium mb-1">{metric.metric}</p>
                  <p className="text-xs text-slate-500">{metric.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-slate-500">
            This research is for informational purposes only and does not constitute investment advice.
            Always conduct your own due diligence before making investment decisions.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Last Updated: {thesis.lastUpdated} • Data sources verified as of publication date
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
