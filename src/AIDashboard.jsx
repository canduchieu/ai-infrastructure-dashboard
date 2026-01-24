import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, AreaChart, Area, Treemap, ScatterChart, Scatter, ZAxis } from 'recharts';
import { TrendingUp, TrendingDown, Cpu, Server, HardDrive, Thermometer, Zap, ChevronRight, Star, AlertTriangle, CheckCircle, Info, Filter, Search, ArrowUpRight, BarChart2, Globe, DollarSign, Activity, Cloud, Bot, Car, Shield, Heart, Gem, Bitcoin, Briefcase, Stethoscope } from 'lucide-react';
import StockDetailPanel from './components/StockDetailPanel';

// Comprehensive AI Stocks Data
const stocksData = {
  chipManufacturers: [
    { name: 'NVIDIA', ticker: 'NVDA', marketCap: 4530, price: 186, peRatio: 47, forwardPE: 25, revenueGrowth: 66, analystRating: 'Strong Buy', priceTarget: 256, upside: 37, opportunity: 'Dominant AI GPU leader with 90%+ market share. Rubin platform launching Q3 2026.', risk: 'Premium valuation, competition from AMD and custom chips', hbmExposure: true, aiRevenue: 90, score: 95 },
    { name: 'AMD', ticker: 'AMD', marketCap: 407, price: 244, peRatio: 115, forwardPE: 34, revenueGrowth: 31, analystRating: 'Moderate Buy', priceTarget: 277, upside: 33, opportunity: 'OpenAI partnership, MI450 series launching H2 2026. Server CPUs sold out for 2026.', risk: 'Still behind NVIDIA in AI GPU market share', hbmExposure: true, aiRevenue: 45, score: 82 },
    { name: 'Broadcom', ticker: 'AVGO', marketCap: 1560, price: 351, peRatio: 69, forwardPE: 33, revenueGrowth: 150, analystRating: 'Strong Buy', priceTarget: 440, upside: 25, opportunity: 'Custom ASIC leader for hyperscalers. $73B backlog. OpenAI 10GW agreement.', risk: 'Customer concentration risk', hbmExposure: false, aiRevenue: 40, score: 88 },
    { name: 'Marvell', ticker: 'MRVL', marketCap: 82, price: 87, peRatio: 33, forwardPE: 27, revenueGrowth: 45, analystRating: 'Buy', priceTarget: 115, upside: 32, opportunity: 'Custom silicon for hyperscalers. Celestial AI acquisition strengthens optical interconnects.', risk: 'Heavy concentration in few large cloud customers', hbmExposure: false, aiRevenue: 35, score: 78 },
    { name: 'Intel', ticker: 'INTC', marketCap: 250, price: 48, peRatio: 139, forwardPE: null, revenueGrowth: 3, analystRating: 'Hold', priceTarget: 37, upside: -23, opportunity: '18A process attracting major customers. Only Western foundry alternative to TSMC.', risk: 'Foundry losses, market share losses to AMD', hbmExposure: false, aiRevenue: 10, score: 45 },
    { name: 'TSMC', ticker: 'TSM', marketCap: 1700, price: 290, peRatio: 30, forwardPE: 23, revenueGrowth: 30, analystRating: 'Buy', priceTarget: 355, upside: 22, opportunity: 'Near-monopoly on advanced nodes. Building NVIDIA Rubin on 3nm. 66% CoWoS expansion.', risk: 'Geopolitical risks (Taiwan)', hbmExposure: false, aiRevenue: 60, score: 90 },
    { name: 'ASML', ticker: 'ASML', marketCap: 522, price: 1160, peRatio: 44, forwardPE: 34, revenueGrowth: 15, analystRating: 'Buy', priceTarget: 1420, upside: 22, opportunity: 'Monopoly in EUV lithography. Gatekeeper of AI supercycle - all advanced chips require ASML.', risk: 'China revenue drop, high valuation', hbmExposure: false, aiRevenue: 50, score: 85 },
    { name: 'Arm Holdings', ticker: 'ARM', marketCap: 116, price: 113, peRatio: 142, forwardPE: 57, revenueGrowth: 34, analystRating: 'Buy', priceTarget: 150, upside: 33, opportunity: 'Growing to ~50% of hyperscaler CPUs. Project Stargate involvement.', risk: 'Extremely expensive valuation, RISC-V competition', hbmExposure: false, aiRevenue: 25, score: 72 },
    { name: 'Qualcomm', ticker: 'QCOM', marketCap: 190, price: 165, peRatio: 27, forwardPE: 14, revenueGrowth: 13, analystRating: 'Moderate Buy', priceTarget: 190, upside: 15, opportunity: 'AI200/AI250 data center chips. Snapdragon X2 for AI PCs. Strong automotive growth.', risk: 'Apple in-house modem development threat', hbmExposure: false, aiRevenue: 20, score: 68 },
    { name: 'Micron', ticker: 'MU', marketCap: 447, price: 397, peRatio: 35, forwardPE: 10, revenueGrowth: 89, analystRating: 'Strong Buy', priceTarget: 415, upside: 5, opportunity: 'HBM leader for NVIDIA GPUs. Memory supercycle. Entire 2026 HBM supply pre-sold.', risk: 'Capital intensity, SK Hynix competition', hbmExposure: true, aiRevenue: 55, score: 88 }
  ],
  dataCenters: [
    { name: 'Equinix', ticker: 'EQIX', marketCap: 78.7, price: 801, peRatio: 72, forwardPE: 55, revenueGrowth: 6.6, analystRating: 'Strong Buy', priceTarget: 950, upside: 19, opportunity: '22+ years consecutive revenue growth. On track to double capacity by 2029. Record bookings.', risk: 'Premium valuation, capital intensity', aiRevenue: 45, score: 82 },
    { name: 'Digital Realty', ticker: 'DLR', marketCap: 53.5, price: 163, peRatio: 62, forwardPE: 45, revenueGrowth: -0.2, analystRating: 'Buy', priceTarget: 197, upside: 21, opportunity: 'AI represents 67%+ of recent signings. 730 MW under construction. Record leasing activity.', risk: 'Flat revenue, less AI upside than anticipated', aiRevenue: 40, score: 75 },
    { name: 'Datadog', ticker: 'DDOG', marketCap: 43.3, price: 121, peRatio: 412, forwardPE: 56, revenueGrowth: 26, analystRating: 'Strong Buy', priceTarget: 190, upside: 57, opportunity: 'AI observability leader. Bits AI agents. Named Leader in Forrester Wave AIOps.', risk: 'Premium valuation, competitive market', aiRevenue: 35, score: 78 },
    { name: 'Cloudflare', ticker: 'NET', marketCap: 69, price: 195, peRatio: null, forwardPE: 85, revenueGrowth: 29, analystRating: 'Buy', priceTarget: 240, upside: 23, opportunity: 'Workers AI inference in 200+ cities. 4,000% YoY growth in inference requests. No egress fees.', risk: 'Still unprofitable, competing with hyperscalers', aiRevenue: 30, score: 74 },
    { name: 'Vertiv', ticker: 'VRT', marketCap: 68, price: 181, peRatio: 66, forwardPE: 34, revenueGrowth: 29, analystRating: 'Strong Buy', priceTarget: 205, upside: 13, opportunity: 'NVIDIA partner for cooling. 360AI solution for 120+ kW racks. $9.5B record backlog.', risk: 'Premium valuation, tariff exposure', aiRevenue: 80, score: 88 },
    { name: 'Arista Networks', ticker: 'ANET', marketCap: 163, price: 134, peRatio: 57, forwardPE: 45, revenueGrowth: 20, analystRating: 'Strong Buy', priceTarget: 164, upside: 22, opportunity: '800-gigabit Ethernet for AI clusters. Microsoft and Meta as largest customers. $10B revenue target.', risk: 'Customer concentration, cyclical spending', aiRevenue: 55, score: 84 },
    { name: 'Iron Mountain', ticker: 'IRM', marketCap: 25, price: 85, peRatio: 45, forwardPE: 30, revenueGrowth: 13, analystRating: 'Mixed', priceTarget: 95, upside: 12, opportunity: 'Data center revenue growing 33% YoY to $800M. 424 MW capacity, 96% leased. 4.2% dividend.', risk: 'High debt, legacy business pressure', aiRevenue: 25, score: 65 }
  ],
  dataStorage: [
    { name: 'Micron', ticker: 'MU', marketCap: 447, price: 397, peRatio: 35, forwardPE: 10, revenueGrowth: 89, analystRating: 'Strong Buy', priceTarget: 415, upside: 5, opportunity: 'HBM leader. Memory supercycle. Q2 guidance: $18.7B revenue, 68% gross margins.', risk: 'Capital intensity, competition', aiRevenue: 55, score: 88 },
    { name: 'SK Hynix', ticker: '000660.KS', marketCap: 352, price: 514, peRatio: 7, forwardPE: 7, revenueGrowth: 39, analystRating: 'Top Pick', priceTarget: 650, upside: 26, opportunity: '62% HBM market share. Trading at only 7x P/E. Entire 2026 production sold out.', risk: 'Capacity constraints', aiRevenue: 60, score: 92 },
    { name: 'Samsung Memory', ticker: '005930.KS', marketCap: 650, price: 149, peRatio: 12, forwardPE: 8, revenueGrowth: 8, analystRating: 'Buy', priceTarget: 185, upside: 24, opportunity: 'HBM4 certification progress. 50% capacity expansion planned. Record profits projected 2026.', risk: 'Playing catch-up in HBM technology', aiRevenue: 45, score: 78 },
    { name: 'Western Digital', ticker: 'WDC', marketCap: 73, price: 190, peRatio: 31, forwardPE: 26, revenueGrowth: 27, analystRating: 'Strong Buy', priceTarget: 186, upside: -2, opportunity: 'Cloud revenue +31% YoY. Nearline production booked through 2026. 651% earnings growth Q1.', risk: 'Cyclical business, tariffs', aiRevenue: 35, score: 75 },
    { name: 'Seagate', ticker: 'STX', marketCap: 72, price: 344, peRatio: 44, forwardPE: 29, revenueGrowth: 39, analystRating: 'Buy', priceTarget: 370, upside: 8, opportunity: 'HAMR technology enabling 40TB drives. Nearline capacity committed through 2027. Record gross margins.', risk: 'Storage stocks remain cyclical', aiRevenue: 30, score: 72 },
    { name: 'Pure Storage', ticker: 'PSTG', marketCap: 23, price: 72, peRatio: 185, forwardPE: 32, revenueGrowth: 16, analystRating: 'Buy', priceTarget: 93, upside: 29, opportunity: 'Gartner-recognized AI storage leader. All-flash arrays for AI workloads. Strong ARR growth.', risk: 'High trailing P/E, post-earnings drop', aiRevenue: 40, score: 70 },
    { name: 'NetApp', ticker: 'NTAP', marketCap: 21, price: 106, peRatio: 18, forwardPE: 13, revenueGrowth: 4, analystRating: 'Moderate Buy', priceTarget: 124, upside: 17, opportunity: 'AI Data Engine. NVIDIA DGX SuperPOD certification. ~200 AI infrastructure deals in Q2.', risk: 'Morgan Stanley downgrade, reduced budgets', aiRevenue: 25, score: 62 }
  ],
  cooling: [
    { name: 'Vertiv', ticker: 'VRT', marketCap: 68, price: 181, peRatio: 66, forwardPE: 34, revenueGrowth: 29, analystRating: 'Strong Buy', priceTarget: 205, upside: 13, opportunity: 'Market leader. NVIDIA partner. 360AI, CoolPhase Flex, CoolChip solutions. S&P 500 candidate.', risk: 'Premium valuation, liquid cooling supply fragile', aiRevenue: 80, score: 90 },
    { name: 'Schneider Electric', ticker: 'SU', marketCap: 154, price: 235, peRatio: 31, forwardPE: 25, revenueGrowth: 6.3, analystRating: 'Buy', priceTarget: 270, upside: 15, opportunity: 'Motivair acquisition for liquid cooling. NVIDIA GB200 reference partner. Diversified exposure.', risk: 'Data center only 24% of revenue', aiRevenue: 24, score: 75 },
    { name: 'Johnson Controls', ticker: 'JCI', marketCap: 77, price: 122, peRatio: 28, forwardPE: 22, revenueGrowth: 2.8, analystRating: 'Buy', priceTarget: 148, upside: 21, opportunity: '#2 in data center cooling. Silent-Aire CDU platform. Two-phase liquid cooling investment.', risk: 'Above-average leverage', aiRevenue: 17, score: 72 },
    { name: 'Trane Technologies', ticker: 'TT', marketCap: 91, price: 376, peRatio: 35, forwardPE: 29, revenueGrowth: 12.2, analystRating: 'Buy', priceTarget: 470, upside: 25, opportunity: 'NVIDIA collaboration for gigawatt-scale AI Factories. Stellar Energy acquisition for liquid cooling.', risk: 'Highly competitive HVAC market', aiRevenue: 15, score: 74 },
    { name: 'nVent Electric', ticker: 'NVT', marketCap: 18, price: 106, peRatio: 35, forwardPE: 28, revenueGrowth: 35, analystRating: 'Buy', priceTarget: 122, upside: 15, opportunity: 'NVIDIA Partner Network. 65% organic order growth. Minnesota facility doubling capacity Q1 2026.', risk: 'Premium valuation prices in AI boom', aiRevenue: 35, score: 76 },
    { name: 'Modine Manufacturing', ticker: 'MOD', marketCap: 7.5, price: 132, peRatio: 36, forwardPE: 20, revenueGrowth: 119, analystRating: 'Strong Buy', priceTarget: 178, upside: 35, opportunity: 'Best value play. 102-176% DC sales growth. $2B+ DC revenue target FY28. Trades at half Vertiv P/E.', risk: 'NVIDIA chiller comments, scale limitations', aiRevenue: 25, score: 82 },
    { name: 'Eaton', ticker: 'ETN', marketCap: 133, price: 336, peRatio: 34, forwardPE: 26, revenueGrowth: 7.3, analystRating: 'Buy', priceTarget: 393, upside: 17, opportunity: 'Boyd Thermal acquisition ($9.5B). Power + cooling integration. 40% DC sales growth.', risk: '$9.5B acquisition integration risk', aiRevenue: 17, score: 78 }
  ],
  energy: [
    { name: 'Eaton', ticker: 'ETN', marketCap: 133, price: 336, peRatio: 34, forwardPE: 26, revenueGrowth: 7.3, analystRating: 'Buy', priceTarget: 393, upside: 17, opportunity: '30% share in North American DC UPS. Record backlogs. End-to-end electrical infrastructure.', risk: 'Mid-30s P/E leaves little margin for error', aiRevenue: 17, score: 80 },
    { name: 'Quanta Services', ticker: 'PWR', marketCap: 62, price: 467, peRatio: 62, forwardPE: 33, revenueGrowth: 17.6, analystRating: 'Buy', priceTarget: 423, upside: -9, opportunity: 'Largest specialty contractor. NiSource partnership for 3 GW generation. $39.2B record backlog.', risk: 'High valuation, labor constraints', aiRevenue: 25, score: 76 },
    { name: 'Constellation Energy', ticker: 'CEG', marketCap: 111, price: 330, peRatio: 36, forwardPE: 31, revenueGrowth: 8, analystRating: 'Strong Buy', priceTarget: 406, upside: 23, opportunity: 'Largest US nuclear operator. Microsoft Three Mile Island PPA. Meta 1.1 GW nuclear deal.', risk: 'Concentration risk with hyperscalers', aiRevenue: 35, score: 85 },
    { name: 'Vistra', ticker: 'VST', marketCap: 58, price: 167, peRatio: 57, forwardPE: 17, revenueGrowth: 15, analystRating: 'Buy', priceTarget: 235, upside: 41, opportunity: 'Cogentrix acquisition adding 5,500 MW. Comanche Peak nuclear PPA. Top S&P 500 performer 2024.', risk: 'Stock corrected 28% from highs', aiRevenue: 30, score: 82 },
    { name: 'NextEra Energy', ticker: 'NEE', marketCap: 170, price: 84, peRatio: 26, forwardPE: 21, revenueGrowth: 5, analystRating: 'Strong Buy', priceTarget: 93, upside: 11, opportunity: 'Largest US utility. Google Duane Arnold nuclear restart. 15 GW for 20-40 data center hubs by 2035.', risk: 'Premium valuation, interest rate sensitivity', aiRevenue: 20, score: 78 },
    { name: 'GE Vernova', ticker: 'GEV', marketCap: 180, price: 664, peRatio: 104, forwardPE: 58, revenueGrowth: 12, analystRating: 'Buy', priceTarget: 720, upside: 8, opportunity: 'Gas turbines sold out through 2028. Backlog to grow from $135B to $200B by 2028. 450% since spin-off.', risk: '100x+ P/E prices in much of upside', aiRevenue: 30, score: 75 },
    { name: 'Cameco', ticker: 'CCJ', marketCap: 51, price: 116, peRatio: 110, forwardPE: 45, revenueGrowth: 25, analystRating: 'Strong Buy', priceTarget: 120, upside: 3, opportunity: 'Worlds largest uranium producer. $80B US government initiative. 78% stock gain in 2025.', risk: '110x P/E, uranium price volatility', aiRevenue: 40, score: 72 },
    { name: 'NuScale Power', ticker: 'SMR', marketCap: 5.5, price: 20, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 37, upside: 85, opportunity: 'Only NRC-certified SMR design. TVA partnership for 6 GW. NVIDIA endorsement of SMRs.', risk: 'Pre-revenue, high speculation, -63% from highs', aiRevenue: 0, score: 55 },
    { name: 'Oklo', ticker: 'OKLO', marketCap: 14, price: 92, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 26, upside: -72, opportunity: 'Sam Altman backed. Switch 12 GW agreement. Meta partnership. Advanced fission technology.', risk: 'Pre-revenue, extreme valuation, regulatory uncertainty', aiRevenue: 0, score: 48 }
  ],
  // NEW SECTORS ADDED
  aiSoftware: [
    { name: 'Palantir', ticker: 'PLTR', marketCap: 424, price: 85, peRatio: 392, forwardPE: 150, revenueGrowth: 63, analystRating: 'Buy', priceTarget: 95, upside: 12, opportunity: 'AI Operating System for Fortune 500 & government. 63% YoY revenue growth. AIP platform becoming enterprise standard.', risk: 'Extreme valuation at 80x sales. High expectations priced in.', aiRevenue: 95, score: 88 },
    { name: 'Salesforce', ticker: 'CRM', marketCap: 280, price: 295, peRatio: 45, forwardPE: 28, revenueGrowth: 11, analystRating: 'Buy', priceTarget: 350, upside: 19, opportunity: 'Einstein AI embedded across CRM platform. Agentforce AI agents. Massive enterprise customer base.', risk: 'Slower growth than pure-play AI companies. Competition from Microsoft.', aiRevenue: 35, score: 75 },
    { name: 'C3.ai', ticker: 'AI', marketCap: 4.2, price: 35, peRatio: null, forwardPE: null, revenueGrowth: 26, analystRating: 'Hold', priceTarget: 38, upside: 9, opportunity: 'Pure-play enterprise AI. 130+ turnkey AI apps. Microsoft partnership with 600+ deals in pipeline.', risk: 'Still unprofitable. Lost market share to Palantir. Stock down 40% in 6 months.', aiRevenue: 100, score: 62 },
    { name: 'Snowflake', ticker: 'SNOW', marketCap: 55, price: 170, peRatio: null, forwardPE: 85, revenueGrowth: 28, analystRating: 'Buy', priceTarget: 200, upside: 18, opportunity: 'Data cloud essential for AI workloads. Cortex AI features. Strong enterprise adoption.', risk: 'Premium valuation. Competition from Databricks.', aiRevenue: 60, score: 74 },
    { name: 'MongoDB', ticker: 'MDB', marketCap: 25, price: 235, peRatio: null, forwardPE: 65, revenueGrowth: 22, analystRating: 'Buy', priceTarget: 290, upside: 23, opportunity: 'Database for AI applications. Vector search capabilities. Strong developer adoption.', risk: 'Slowing growth. Cloud provider competition.', aiRevenue: 45, score: 72 },
    { name: 'UiPath', ticker: 'PATH', marketCap: 8.5, price: 15, peRatio: null, forwardPE: 35, revenueGrowth: 13, analystRating: 'Hold', priceTarget: 18, upside: 20, opportunity: 'RPA leader adding AI automation. Enterprise workflow automation. 10,000+ customers.', risk: 'Slower growth. CEO transition. Competition from Microsoft Power Automate.', aiRevenue: 55, score: 65 }
  ],
  robotics: [
    { name: 'Intuitive Surgical', ticker: 'ISRG', marketCap: 185, price: 520, peRatio: 75, forwardPE: 55, revenueGrowth: 23, analystRating: 'Strong Buy', priceTarget: 600, upside: 15, opportunity: 'Dominates robotic surgery with 10,763 da Vinci systems globally. 20% procedure growth. da Vinci 5 adoption accelerating.', risk: 'Premium valuation. Competition from Medtronic, J&J.', aiRevenue: 70, score: 88 },
    { name: 'Symbotic', ticker: 'SYM', marketCap: 28, price: 48, peRatio: null, forwardPE: 85, revenueGrowth: 24, analystRating: 'Buy', priceTarget: 62, upside: 29, opportunity: 'AI warehouse robotics. Multi-year Walmart partnership. Revenue up 24% to $2.25B. Earnings $2.02/share vs $0.12 prior year.', risk: 'Customer concentration (Walmart). Execution risk on scaling.', aiRevenue: 90, score: 80 },
    { name: 'Rockwell Automation', ticker: 'ROK', marketCap: 32, price: 275, peRatio: 28, forwardPE: 22, revenueGrowth: 3, analystRating: 'Hold', priceTarget: 295, upside: 7, opportunity: 'Industrial automation leader. Factory AI integration. Strong installed base.', risk: 'Cyclical industrial exposure. Slower growth.', aiRevenue: 35, score: 68 },
    { name: 'Tesla (Optimus)', ticker: 'TSLA', marketCap: 1200, price: 380, peRatio: 120, forwardPE: 95, revenueGrowth: 8, analystRating: 'Hold', priceTarget: 350, upside: -8, opportunity: 'Optimus humanoid robot program. Gen 3 deployed at Gigafactory. Musk: could be worth more than car business. 1M robot/year target by late 2026.', risk: 'Highly speculative robotics timeline. Stock already reflects optimism. Automotive headwinds.', aiRevenue: 25, score: 72 },
    { name: 'FANUC', ticker: 'FANUY', marketCap: 38, price: 15, peRatio: 32, forwardPE: 28, revenueGrowth: 5, analystRating: 'Buy', priceTarget: 18, upside: 20, opportunity: 'Japanese robotics giant. Factory automation leader. Recovering China demand.', risk: 'Yen exposure. Slower near-term growth.', aiRevenue: 40, score: 70 },
    { name: 'Boston Dynamics (Hyundai)', ticker: 'HYMTF', marketCap: 42, price: 47, peRatio: 5, forwardPE: 4, revenueGrowth: 6, analystRating: 'Buy', priceTarget: 58, upside: 23, opportunity: 'Atlas humanoid entering production. 30,000 robots/year by 2028. Parent Hyundai provides manufacturing scale.', risk: 'Humanoid robots still speculative. Boston Dynamics is small part of Hyundai.', aiRevenue: 15, score: 68 }
  ],
  autonomousVehicles: [
    { name: 'Mobileye', ticker: 'MBLY', marketCap: 21, price: 26, peRatio: 35, forwardPE: 28, revenueGrowth: 12, analystRating: 'Buy', priceTarget: 32, upside: 23, opportunity: '70% ADAS market share. EyeQ chips in 200M+ vehicles. $1.7B cash, zero debt. Driver-out AVs launching H1 2026.', risk: 'Competition from Tesla FSD. Delays in SuperVision/Chauffeur.', aiRevenue: 85, score: 82 },
    { name: 'Aurora Innovation', ticker: 'AUR', marketCap: 8.5, price: 7, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 10, upside: 43, opportunity: 'Commercial driverless trucking launched. Dallas-Houston corridor operational. Volvo, Paccar partnerships. 3.3M+ autonomous miles logged.', risk: 'Pre-revenue. High cash burn ($201M loss Q2). Execution risk.', aiRevenue: 100, score: 68 },
    { name: 'Luminar', ticker: 'LAZR', marketCap: 1.8, price: 8, peRatio: null, forwardPE: null, revenueGrowth: 45, analystRating: 'Hold', priceTarget: 10, upside: 25, opportunity: 'LiDAR leader. Production vehicles with Volvo. NASA partnership. Applied Intuition collaboration.', risk: 'Path to profitability unclear. Stock down 70% from highs.', aiRevenue: 100, score: 58 },
    { name: 'Waymo (Alphabet)', ticker: 'GOOGL', marketCap: 2300, price: 195, peRatio: 24, forwardPE: 20, revenueGrowth: 14, analystRating: 'Strong Buy', priceTarget: 220, upside: 13, opportunity: 'Leading robotaxi. 100K+ weekly paid trips. Expanding to new cities. Part of Alphabet diversification.', risk: 'Waymo is small part of Alphabet. Core search/ads faces AI disruption.', aiRevenue: 5, score: 78 }
  ],
  cybersecurity: [
    { name: 'CrowdStrike', ticker: 'CRWD', marketCap: 95, price: 380, peRatio: 114, forwardPE: 75, revenueGrowth: 22, analystRating: 'Strong Buy', priceTarget: 450, upside: 18, opportunity: '#1 endpoint security. AI-native Falcon platform. ARR $4.92B with record $265M net new ARR. Acquiring SGNL for identity protection.', risk: 'Premium valuation at 114x P/E. July 2024 outage reputation impact.', aiRevenue: 75, score: 88 },
    { name: 'Palo Alto Networks', ticker: 'PANW', marketCap: 130, price: 395, peRatio: 55, forwardPE: 48, revenueGrowth: 16, analystRating: 'Strong Buy', priceTarget: 460, upside: 16, opportunity: 'Largest pure-play cybersecurity. Acquiring CyberArk ($25B) and Chronosphere. Next-gen security ARR $5.9B, up 29%.', risk: 'Large acquisition integration risk. Competition from CrowdStrike.', aiRevenue: 65, score: 86 },
    { name: 'Zscaler', ticker: 'ZS', marketCap: 32, price: 210, peRatio: null, forwardPE: 60, revenueGrowth: 26, analystRating: 'Buy', priceTarget: 260, upside: 24, opportunity: 'Cloud security leader. 26% revenue growth. Rule of 40 score of 78. ZDX Copilot AI platform. $3B+ ARR.', risk: 'Premium valuation. Competition in SASE market.', aiRevenue: 60, score: 82 },
    { name: 'SentinelOne', ticker: 'S', marketCap: 8, price: 26, peRatio: null, forwardPE: 120, revenueGrowth: 32, analystRating: 'Buy', priceTarget: 32, upside: 23, opportunity: 'AI-powered endpoint security. Faster growth than CrowdStrike. Moving toward profitability.', risk: 'Still unprofitable. Smaller scale than competitors.', aiRevenue: 80, score: 72 },
    { name: 'Fortinet', ticker: 'FTNT', marketCap: 75, price: 95, peRatio: 45, forwardPE: 35, revenueGrowth: 12, analystRating: 'Buy', priceTarget: 110, upside: 16, opportunity: 'Network security leader. Strong margins. Growing SASE and cloud security.', risk: 'Slower growth than cloud-native peers. Firewall market maturing.', aiRevenue: 45, score: 75 }
  ],
  healthcareAI: [
    { name: 'Tempus AI', ticker: 'TEM', marketCap: 12, price: 65, peRatio: null, forwardPE: null, revenueGrowth: 85, analystRating: 'Buy', priceTarget: 80, upside: 23, opportunity: '85% YoY revenue growth. Precision medicine leader. Deals with Pfizer, Novartis, Eli Lilly. 70+ data clients. 126% net revenue retention.', risk: 'Not yet profitable. High valuation for biotech. Execution risk.', aiRevenue: 95, score: 78 },
    { name: 'Recursion Pharma', ticker: 'RXRX', marketCap: 4.5, price: 8, peRatio: null, forwardPE: null, revenueGrowth: 45, analystRating: 'Buy', priceTarget: 12, upside: 50, opportunity: 'AI drug discovery. Merged with Exscientia. $5.2B Sanofi partnership. Revenue expected to triple by 2027.', risk: 'Pre-profit biotech. Long drug development timelines. High speculation.', aiRevenue: 100, score: 65 },
    { name: 'Veeva Systems', ticker: 'VEEV', marketCap: 35, price: 230, peRatio: 55, forwardPE: 42, revenueGrowth: 15, analystRating: 'Buy', priceTarget: 270, upside: 17, opportunity: 'Cloud software for pharma/biotech. Stable, profitable. AI embedded in life sciences cloud.', risk: 'Slower growth. Competition from Salesforce Health Cloud.', aiRevenue: 40, score: 76 },
    { name: 'GE HealthCare', ticker: 'GEHC', marketCap: 42, price: 92, peRatio: 25, forwardPE: 18, revenueGrowth: 4, analystRating: 'Buy', priceTarget: 105, upside: 14, opportunity: 'Medical imaging with AI diagnostics. Strong installed base. Steady cash flow.', risk: 'Slower growth than pure AI plays. Hospital budget constraints.', aiRevenue: 35, score: 72 },
    { name: 'Stryker', ticker: 'SYK', marketCap: 145, price: 385, peRatio: 38, forwardPE: 28, revenueGrowth: 10, analystRating: 'Buy', priceTarget: 420, upside: 9, opportunity: 'Mako surgical robot leader. Strong MedTech franchise. Consistent growth.', risk: 'Premium valuation. Slower than software AI growth.', aiRevenue: 30, score: 74 }
  ],
  commodities: [
    { name: 'Freeport-McMoRan', ticker: 'FCX', marketCap: 68, price: 47, peRatio: 28, forwardPE: 18, revenueGrowth: 8, analystRating: 'Strong Buy', priceTarget: 58, upside: 23, opportunity: 'Largest US copper producer. Grasberg mine restarting Q2 2026. Copper to $12,500/ton in 2026. AI data centers driving 30% supply gap by 2035.', risk: 'Commodity price volatility. Indonesia operations risk.', aiRevenue: 0, score: 82 },
    { name: 'Southern Copper', ticker: 'SCCO', marketCap: 82, price: 105, peRatio: 28, forwardPE: 22, revenueGrowth: 6, analystRating: 'Buy', priceTarget: 120, upside: 14, opportunity: 'Lowest-cost copper producer. Largest reserves globally. Dividend payer. $5B expansion projects.', risk: 'Mexico/Peru political risk. Commodity exposure.', aiRevenue: 0, score: 78 },
    { name: 'Albemarle', ticker: 'ALB', marketCap: 14, price: 115, peRatio: null, forwardPE: 25, revenueGrowth: -35, analystRating: 'Buy', priceTarget: 210, upside: 83, opportunity: 'Largest lithium producer. Analysts upgraded to Buy. 75% EBITDA growth expected 2026. Lithium prices rebounding 100%+ from lows.', risk: 'Lithium price volatility. Recent losses. China competition.', aiRevenue: 0, score: 75 },
    { name: 'Lithium Americas', ticker: 'LAC', marketCap: 2.8, price: 8, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 12, upside: 50, opportunity: 'US government 5% stake. $2.23B DOE loan. Building largest US lithium mine (Thacker Pass). Strategic importance.', risk: 'Pre-production. Execution delays. Long-term play (2030+).', aiRevenue: 0, score: 62 },
    { name: 'MP Materials', ticker: 'MP', marketCap: 5.2, price: 28, peRatio: null, forwardPE: 45, revenueGrowth: 15, analystRating: 'Buy', priceTarget: 38, upside: 36, opportunity: 'Only US rare earth producer. DoD largest shareholder ($400M). Apple $500M deal. Stock up 47% in 6 months. China trade tensions boost importance.', risk: 'Single mine concentration. China price competition.', aiRevenue: 0, score: 76 },
    { name: 'Rio Tinto', ticker: 'RIO', marketCap: 105, price: 65, peRatio: 9, forwardPE: 8, revenueGrowth: 3, analystRating: 'Buy', priceTarget: 78, upside: 20, opportunity: 'Acquired Arcadium Lithium for $6.7B. 170,000-ton lithium capacity target 2026. Copper deal with Amazon. Diversified mining giant.', risk: 'Commodity exposure. ESG concerns.', aiRevenue: 0, score: 74 }
  ],
  etfs: [
    { name: 'Global X AI & Tech ETF', ticker: 'AIQ', marketCap: 7, price: 52, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 61, upside: 17, opportunity: 'Largest AI ETF ($7B AUM). 88 holdings including Alphabet, Oracle, Tesla, Broadcom. Global diversification.', risk: 'Broad exposure means diluted AI focus. 0.68% expense ratio.', aiRevenue: 100, score: 80, isETF: true },
    { name: 'Global X Robotics & AI ETF', ticker: 'BOTZ', marketCap: 3, price: 32, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 38, upside: 19, opportunity: 'Focused robotics/automation. Heavy Japan exposure (FANUC, Yaskawa). 19% return past year.', risk: 'Concentrated portfolio. Higher volatility. 0.68% expense ratio.', aiRevenue: 100, score: 76, isETF: true },
    { name: 'ROBO Global Robotics ETF', ticker: 'ROBO', marketCap: 1.15, price: 58, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Buy', priceTarget: 68, upside: 17, opportunity: 'Equal-weighted robotics fund. Less concentrated risk. 2.5% cap per holding.', risk: 'Higher expense ratio (0.95%). Equal-weight limits winners.', aiRevenue: 100, score: 74, isETF: true },
    { name: 'ARK Autonomous Tech ETF', ticker: 'ARKQ', marketCap: 0.8, price: 72, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Hold', priceTarget: 85, upside: 18, opportunity: 'Actively managed. High-conviction disruptive tech bets. Includes Tesla, Roku, autonomous vehicles.', risk: 'Active management risk. ARK performance volatility. 0.75% expense ratio.', aiRevenue: 100, score: 68, isETF: true },
    { name: 'Roundhill Humanoid Robotics', ticker: 'HUMN', marketCap: 0.1, price: 25, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Speculative Buy', priceTarget: 35, upside: 40, opportunity: 'New ETF focused on humanoid robots. Holdings include UBTECH, Tesla, XPeng, NVIDIA. Emerging theme.', risk: 'Very new fund. Speculative theme. Higher risk.', aiRevenue: 100, score: 65, isETF: true }
  ],
  crypto: [
    { name: 'Render Network', ticker: 'RNDR', marketCap: 5.2, price: 10, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Speculative', priceTarget: 15, upside: 50, opportunity: 'Decentralized GPU computing for AI. Rent spare GPU power. Real utility as cloud GPU costs soar.', risk: 'Extreme volatility. Regulatory uncertainty. Crypto market risk.', aiRevenue: 100, score: 62, isCrypto: true },
    { name: 'Fetch.ai', ticker: 'FET', marketCap: 3.8, price: 2.2, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Speculative', priceTarget: 3.5, upside: 59, opportunity: 'Autonomous AI agents on blockchain. Part of ASI Alliance (merged with SingularityNET, Ocean). DeFi and supply chain applications.', risk: 'Highly speculative. Crypto volatility. Unproven at scale.', aiRevenue: 100, score: 58, isCrypto: true },
    { name: 'Bittensor', ticker: 'TAO', marketCap: 3.2, price: 450, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Speculative', priceTarget: 650, upside: 44, opportunity: 'Decentralized AI network. Incentivizes AI model training. Novel approach to distributed AI.', risk: 'Complex technology. Very speculative. High volatility.', aiRevenue: 100, score: 55, isCrypto: true },
    { name: 'NEAR Protocol', ticker: 'NEAR', marketCap: 7.5, price: 6.5, peRatio: null, forwardPE: null, revenueGrowth: null, analystRating: 'Speculative', priceTarget: 10, upside: 54, opportunity: 'Fast blockchain supporting AI apps. Strong developer ecosystem. AI-focused initiatives.', risk: 'Crypto market risk. Competition from other L1s. Regulatory uncertainty.', aiRevenue: 60, score: 60, isCrypto: true }
  ]
};

// Calculate sector aggregates
const sectorSummary = [
  { sector: 'Chip Manufacturers', avgGrowth: 47, avgUpside: 20, avgScore: 79, totalMarketCap: 9804, count: 10, color: '#8B5CF6' },
  { sector: 'Data Centers', avgGrowth: 17, avgUpside: 24, avgScore: 78, totalMarketCap: 500, count: 7, color: '#06B6D4' },
  { sector: 'Data Storage', avgGrowth: 32, avgUpside: 15, avgScore: 77, totalMarketCap: 1638, count: 7, color: '#10B981' },
  { sector: 'Cooling', avgGrowth: 30, avgUpside: 20, avgScore: 78, totalMarketCap: 549, count: 7, color: '#F59E0B' },
  { sector: 'Energy', avgGrowth: 13, avgUpside: 19, avgScore: 72, totalMarketCap: 785, count: 9, color: '#EF4444' },
  { sector: 'AI Software', avgGrowth: 27, avgUpside: 17, avgScore: 73, totalMarketCap: 797, count: 6, color: '#3B82F6' },
  { sector: 'Robotics', avgGrowth: 12, avgUpside: 14, avgScore: 74, totalMarketCap: 1526, count: 6, color: '#EC4899' },
  { sector: 'Autonomous Vehicles', avgGrowth: 18, avgUpside: 26, avgScore: 72, totalMarketCap: 2331, count: 4, color: '#F97316' },
  { sector: 'Cybersecurity', avgGrowth: 22, avgUpside: 19, avgScore: 81, totalMarketCap: 340, count: 5, color: '#14B8A6' },
  { sector: 'Healthcare AI', avgGrowth: 32, avgUpside: 23, avgScore: 73, totalMarketCap: 239, count: 5, color: '#F43F5E' },
  { sector: 'Commodities', avgGrowth: 0, avgUpside: 38, avgScore: 75, totalMarketCap: 277, count: 6, color: '#A855F7' },
  { sector: 'AI ETFs', avgGrowth: 0, avgUpside: 22, avgScore: 73, totalMarketCap: 12, count: 5, color: '#6366F1' },
  { sector: 'AI Crypto', avgGrowth: 0, avgUpside: 52, avgScore: 59, totalMarketCap: 20, count: 4, color: '#FBBF24' }
];

// Top opportunities across all sectors
const topOpportunities = [
  { name: 'NVIDIA', ticker: 'NVDA', sector: 'Chips', score: 95, reason: 'Undisputed AI GPU leader with Rubin platform catalyst.' },
  { name: 'SK Hynix', ticker: '000660.KS', sector: 'Storage', score: 92, reason: 'Best value in AI memory. 7x P/E with 62% HBM market share.' },
  { name: 'Vertiv', ticker: 'VRT', sector: 'Cooling', score: 90, reason: 'NVIDIA-endorsed cooling leader. S&P 500 inclusion imminent.' },
  { name: 'TSMC', ticker: 'TSM', sector: 'Chips', score: 90, reason: 'Near-monopoly on advanced nodes. Essential for AI chips.' },
  { name: 'CrowdStrike', ticker: 'CRWD', sector: 'Cybersecurity', score: 88, reason: '#1 endpoint security. AI-native platform. 22% growth.' },
  { name: 'Intuitive Surgical', ticker: 'ISRG', sector: 'Robotics', score: 88, reason: 'Dominates robotic surgery. 10,763 da Vinci systems globally.' },
  { name: 'Palantir', ticker: 'PLTR', sector: 'AI Software', score: 88, reason: 'AI Operating System for Fortune 500. 63% revenue growth.' },
  { name: 'Broadcom', ticker: 'AVGO', sector: 'Chips', score: 88, reason: '$73B backlog in custom AI chips. OpenAI partnership.' },
  { name: 'Palo Alto Networks', ticker: 'PANW', sector: 'Cybersecurity', score: 86, reason: 'Largest pure-play cybersecurity. Acquiring CyberArk for $25B.' },
  { name: 'Constellation Energy', ticker: 'CEG', sector: 'Energy', score: 85, reason: 'Largest nuclear operator with Microsoft and Meta PPAs.' },
  { name: 'Mobileye', ticker: 'MBLY', sector: 'Autonomous Vehicles', score: 82, reason: '70% ADAS market share. Blue-chip of self-driving.' },
  { name: 'Freeport-McMoRan', ticker: 'FCX', sector: 'Commodities', score: 82, reason: 'Largest US copper producer. AI driving 30% supply gap.' }
];

// Opportunity matrix data
const opportunityMatrix = stocksData.chipManufacturers.concat(
  stocksData.dataCenters,
  stocksData.dataStorage.filter(s => s.ticker !== 'MU'),
  stocksData.cooling.filter(s => !['VRT', 'ETN'].includes(s.ticker)),
  stocksData.energy.filter(s => s.ticker !== 'ETN')
).map(stock => ({
  name: stock.name,
  ticker: stock.ticker,
  upside: stock.upside || 0,
  score: stock.score,
  marketCap: stock.marketCap,
  aiRevenue: stock.aiRevenue || 0
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-200 font-medium text-sm">{label || payload[0]?.payload?.name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs mt-1" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, value, change, icon: Icon, trend, subtitle }) => (
  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2.5 rounded-lg ${trend === 'up' ? 'bg-emerald-500/10' : trend === 'down' ? 'bg-red-500/10' : 'bg-slate-700/50'}`}>
        <Icon className={`w-5 h-5 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`} />
      </div>
    </div>
    {change && (
      <div className={`flex items-center mt-3 text-sm ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        <span>{change > 0 ? '+' : ''}{change}%</span>
        <span className="text-slate-500 ml-2">vs last quarter</span>
      </div>
    )}
  </div>
);

const StockCard = ({ stock, showDetails = false, onClick }) => {
  const ratingColor = stock.analystRating?.includes('Strong Buy') ? 'text-emerald-400' :
                      stock.analystRating?.includes('Buy') ? 'text-green-400' :
                      stock.analystRating?.includes('Hold') ? 'text-yellow-400' : 'text-slate-400';

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/40 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-white font-semibold text-base">{stock.name}</h4>
            <span className="text-slate-500 text-sm">{stock.ticker}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs font-medium ${ratingColor}`}>{stock.analystRating}</span>
            <span className="text-slate-500 text-xs">Score: {stock.score}/100</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">${stock.price}</p>
          <p className={`text-xs ${stock.upside > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stock.upside > 0 ? '+' : ''}{stock.upside}% upside
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">Market Cap</p>
          <p className="text-white font-medium">${stock.marketCap >= 1000 ? (stock.marketCap / 1000).toFixed(1) + 'T' : stock.marketCap + 'B'}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">Fwd P/E</p>
          <p className="text-white font-medium">{stock.forwardPE || 'N/A'}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <p className="text-slate-500">Rev Growth</p>
          <p className="text-emerald-400 font-medium">{stock.revenueGrowth ? `+${stock.revenueGrowth}%` : 'N/A'}</p>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="mb-3">
            <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Opportunity
            </p>
            <p className="text-slate-300 text-xs leading-relaxed">{stock.opportunity}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> Risk
            </p>
            <p className="text-slate-300 text-xs leading-relaxed">{stock.risk}</p>
          </div>
        </>
      )}

      <div className="mt-3 pt-3 border-t border-slate-700/30">
        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{ width: `${stock.score}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>Investment Score</span>
          <span className="text-purple-400 font-medium">{stock.score}/100</span>
        </div>
      </div>
    </div>
  );
};

const SectorTab = ({ sector, isActive, onClick, color }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/20'
        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`}
  >
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    {sector}
  </button>
);

export default function AIDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSector, setActiveSector] = useState('chipManufacturers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedStock(null), 300); // Clear after animation
  };

  const sectors = [
    { key: 'chipManufacturers', name: 'Chip Manufacturers', icon: Cpu, color: '#8B5CF6' },
    { key: 'dataCenters', name: 'Data Centers', icon: Server, color: '#06B6D4' },
    { key: 'dataStorage', name: 'Data Storage', icon: HardDrive, color: '#10B981' },
    { key: 'cooling', name: 'Cooling', icon: Thermometer, color: '#F59E0B' },
    { key: 'energy', name: 'Energy', icon: Zap, color: '#EF4444' },
    { key: 'aiSoftware', name: 'AI Software', icon: Cloud, color: '#3B82F6' },
    { key: 'robotics', name: 'Robotics', icon: Bot, color: '#EC4899' },
    { key: 'autonomousVehicles', name: 'Autonomous Vehicles', icon: Car, color: '#F97316' },
    { key: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: '#14B8A6' },
    { key: 'healthcareAI', name: 'Healthcare AI', icon: Stethoscope, color: '#F43F5E' },
    { key: 'commodities', name: 'Commodities', icon: Gem, color: '#A855F7' },
    { key: 'etfs', name: 'AI ETFs', icon: Briefcase, color: '#6366F1' },
    { key: 'crypto', name: 'AI Crypto', icon: Bitcoin, color: '#FBBF24' }
  ];

  const currentSectorData = stocksData[activeSector] || [];
  const filteredStocks = currentSectorData.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const radarData = sectors.map(s => ({
    sector: s.name.split(' ')[0],
    avgGrowth: sectorSummary.find(ss => ss.sector.includes(s.name.split(' ')[0]))?.avgGrowth || 0,
    avgScore: sectorSummary.find(ss => ss.sector.includes(s.name.split(' ')[0]))?.avgScore || 0,
    avgUpside: sectorSummary.find(ss => ss.sector.includes(s.name.split(' ')[0]))?.avgUpside || 0
  }));

  const treemapData = Object.entries(stocksData).flatMap(([sectorKey, stocks]) =>
    stocks.slice(0, 5).map(stock => ({
      name: stock.ticker,
      size: stock.marketCap,
      score: stock.score,
      sector: sectorKey
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                AI Infrastructure Investment Dashboard
              </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base">Deep research analysis across 80+ assets in 13 AI sectors</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 w-48 md:w-64"
              />
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-600/50 transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              {showDetails ? 'Less' : 'More'}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {['overview', 'sectors', 'opportunities', 'analysis'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total Market Cap"
                value="$19.1T"
                subtitle="80+ assets tracked"
                icon={DollarSign}
                trend="up"
                change={45}
              />
              <MetricCard
                title="Avg Revenue Growth"
                value="28%"
                subtitle="Across all sectors"
                icon={TrendingUp}
                trend="up"
                change={12}
              />
              <MetricCard
                title="Strong Buy Ratings"
                value="68%"
                subtitle="Analyst consensus"
                icon={Star}
                trend="up"
              />
              <MetricCard
                title="Avg Upside Potential"
                value="+19%"
                subtitle="To price targets"
                icon={ArrowUpRight}
                trend="up"
              />
            </div>

            {/* Top Opportunities */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Top Investment Opportunities
                </h2>
                <span className="text-xs text-slate-500">Ranked by opportunity score</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topOpportunities.slice(0, 8).map((opp, i) => (
                  <div key={opp.ticker} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-slate-500">#{i + 1}</span>
                        <h4 className="text-white font-semibold">{opp.name}</h4>
                        <span className="text-slate-500 text-xs">{opp.ticker}</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg px-2 py-1">
                        <span className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">{opp.score}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{opp.reason}</p>
                    <div className="mt-2 pt-2 border-t border-slate-700/30">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{opp.sector}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Sector Performance Radar */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Sector Performance Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="sector" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name="Avg Growth" dataKey="avgGrowth" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Radar name="Avg Score" dataKey="avgScore" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                    <Radar name="Avg Upside" dataKey="avgUpside" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-xs text-slate-400">Growth %</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500" /><span className="text-xs text-slate-400">Score</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-slate-400">Upside %</span></div>
                </div>
              </div>

              {/* Market Cap Distribution */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Market Cap by Sector ($B)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorSummary} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis dataKey="sector" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalMarketCap" radius={[0, 4, 4, 0]}>
                      {sectorSummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Opportunity Matrix Scatter */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Investment Opportunity Matrix</h3>
              <p className="text-slate-400 text-sm mb-4">Score vs Upside Potential (bubble size = market cap)</p>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="upside" name="Upside" unit="%" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[-30, 100]} label={{ value: 'Upside Potential %', position: 'bottom', fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="number" dataKey="score" name="Score" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[40, 100]} label={{ value: 'Investment Score', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                  <ZAxis type="number" dataKey="marketCap" range={[50, 400]} name="Market Cap" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
                          <p className="text-white font-semibold">{data.name} ({data.ticker})</p>
                          <p className="text-slate-400 text-xs">Score: {data.score}</p>
                          <p className="text-slate-400 text-xs">Upside: {data.upside}%</p>
                          <p className="text-slate-400 text-xs">Market Cap: ${data.marketCap}B</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter name="Stocks" data={opportunityMatrix.filter(s => s.score > 0)} fill="#8B5CF6" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'sectors' && (
          <>
            {/* Sector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sectors.map(sector => (
                <SectorTab
                  key={sector.key}
                  sector={sector.name}
                  isActive={activeSector === sector.key}
                  onClick={() => setActiveSector(sector.key)}
                  color={sector.color}
                />
              ))}
            </div>

            {/* Sector Header */}
            <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl p-5 border border-purple-500/20 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    {React.createElement(sectors.find(s => s.key === activeSector)?.icon || Cpu, { className: 'w-6 h-6' })}
                    {sectors.find(s => s.key === activeSector)?.name}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">{filteredStocks.length} companies tracked</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{sectorSummary.find(s => s.sector.includes(sectors.find(sec => sec.key === activeSector)?.name.split(' ')[0]))?.avgGrowth || 0}%</p>
                    <p className="text-slate-500 text-xs">Avg Growth</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">+{sectorSummary.find(s => s.sector.includes(sectors.find(sec => sec.key === activeSector)?.name.split(' ')[0]))?.avgUpside || 0}%</p>
                    <p className="text-slate-500 text-xs">Avg Upside</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{sectorSummary.find(s => s.sector.includes(sectors.find(sec => sec.key === activeSector)?.name.split(' ')[0]))?.avgScore || 0}</p>
                    <p className="text-slate-500 text-xs">Avg Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStocks.map(stock => (
                <StockCard key={stock.ticker} stock={stock} showDetails={showDetails} onClick={() => handleStockClick(stock)} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'opportunities' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* High Growth */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-emerald-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Highest Growth
                </h3>
                <div className="space-y-3">
                  {Object.values(stocksData).flat()
                    .filter(s => s.revenueGrowth)
                    .sort((a, b) => b.revenueGrowth - a.revenueGrowth)
                    .slice(0, 6)
                    .map(stock => (
                      <div key={stock.ticker} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{stock.name}</p>
                          <p className="text-slate-500 text-xs">{stock.ticker}</p>
                        </div>
                        <span className="text-emerald-400 font-bold">+{stock.revenueGrowth}%</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Best Value */}
              <div className="bg-gradient-to-br from-cyan-900/20 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-cyan-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  Best Value (Low P/E)
                </h3>
                <div className="space-y-3">
                  {Object.values(stocksData).flat()
                    .filter(s => s.forwardPE && s.forwardPE > 0 && s.forwardPE < 100)
                    .sort((a, b) => a.forwardPE - b.forwardPE)
                    .slice(0, 6)
                    .map(stock => (
                      <div key={stock.ticker} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{stock.name}</p>
                          <p className="text-slate-500 text-xs">{stock.ticker}</p>
                        </div>
                        <span className="text-cyan-400 font-bold">{stock.forwardPE}x</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Highest Upside */}
              <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-purple-400" />
                  Highest Upside
                </h3>
                <div className="space-y-3">
                  {Object.values(stocksData).flat()
                    .filter(s => s.upside)
                    .sort((a, b) => b.upside - a.upside)
                    .slice(0, 6)
                    .map(stock => (
                      <div key={stock.ticker} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{stock.name}</p>
                          <p className="text-slate-500 text-xs">{stock.ticker}</p>
                        </div>
                        <span className="text-purple-400 font-bold">+{stock.upside}%</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Risk/Reward Analysis */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
              <h3 className="text-lg font-semibold text-white mb-4">Risk/Reward Analysis by Score</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Company</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Ticker</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Score</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Upside</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Fwd P/E</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Growth</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(stocksData).flat()
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 15)
                      .map(stock => (
                        <tr key={stock.ticker} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 text-white font-medium">{stock.name}</td>
                          <td className="py-3 px-4 text-slate-400">{stock.ticker}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center justify-center w-10 h-6 rounded bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-sm font-bold text-purple-300">{stock.score}</span>
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${stock.upside > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stock.upside > 0 ? '+' : ''}{stock.upside}%
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">{stock.forwardPE || 'N/A'}</td>
                          <td className="py-3 px-4 text-right text-emerald-400">{stock.revenueGrowth ? `+${stock.revenueGrowth}%` : 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              stock.analystRating?.includes('Strong Buy') ? 'bg-emerald-500/20 text-emerald-400' :
                              stock.analystRating?.includes('Buy') ? 'bg-green-500/20 text-green-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {stock.analystRating}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analysis' && (
          <>
            {/* Key Investment Themes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-400" />
                  Key Investment Themes for 2026
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-purple-500">
                    <h4 className="text-white font-semibold mb-1">Memory Supercycle</h4>
                    <p className="text-slate-400 text-sm">DRAM revenue surging 51%, NAND 45% YoY. HBM demand exceeding supply. SK Hynix, Micron, Samsung are key beneficiaries.</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-cyan-500">
                    <h4 className="text-white font-semibold mb-1">Humanoid Robot Revolution</h4>
                    <p className="text-slate-400 text-sm">Goldman Sachs: $38B humanoid market by 2035 (6x prior estimate). Tesla Optimus, Boston Dynamics Atlas entering production. Figure AI at $39B valuation.</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-emerald-500">
                    <h4 className="text-white font-semibold mb-1">AI Cybersecurity Arms Race</h4>
                    <p className="text-slate-400 text-sm">AI agents now outnumber human employees 82:1 in enterprises. Spending to exceed $520B in 2026. CrowdStrike, Palo Alto leading consolidation wave.</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-amber-500">
                    <h4 className="text-white font-semibold mb-1">Copper Supply Crunch</h4>
                    <p className="text-slate-400 text-sm">AI data centers driving 30% copper supply gap by 2035. Prices to hit $12,500/ton in 2026. Amazon securing direct mining deals.</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-pink-500">
                    <h4 className="text-white font-semibold mb-1">Enterprise AI Platform Wars</h4>
                    <p className="text-slate-400 text-sm">Palantir becoming AI Operating System for Fortune 500. $424B market cap. Salesforce, Microsoft racing to close gap with agentic AI.</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border-l-4 border-orange-500">
                    <h4 className="text-white font-semibold mb-1">Autonomous Trucking Commercialization</h4>
                    <p className="text-slate-400 text-sm">Aurora running driverless Dallas-Houston routes. Mobileye driver-out AVs launching H1 2026. $158B AV market growing 33% CAGR.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Market Context
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Hyperscaler CapEx 2026</span>
                      <span className="text-white font-bold">$600B+</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: '75%' }} />
                    </div>
                    <p className="text-slate-500 text-xs mt-1">~75% targeting AI infrastructure</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Data Center Power Demand</span>
                      <span className="text-white font-bold">2x by 2030</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-red-500" style={{ width: '85%' }} />
                    </div>
                    <p className="text-slate-500 text-xs mt-1">Power emerging as #1 constraint</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">AI Chip Market CAGR</span>
                      <span className="text-white font-bold">37%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '65%' }} />
                    </div>
                    <p className="text-slate-500 text-xs mt-1">Through 2030</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Semiconductor Market 2026</span>
                      <span className="text-white font-bold">$1T</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '90%' }} />
                    </div>
                    <p className="text-slate-500 text-xs mt-1">First trillion-dollar year for semis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Picks Section */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Expert & Analyst Top Picks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">Morgan Stanley</p>
                  <p className="text-white font-semibold">SK Hynix, Samsung, Micron, Western Digital</p>
                  <p className="text-slate-400 text-xs mt-1">Memory supercycle beneficiaries</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">Bank of America</p>
                  <p className="text-white font-semibold">SK Hynix (Global Top Pick)</p>
                  <p className="text-slate-400 text-xs mt-1">7x P/E with 62% HBM market share</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">TD Cowen</p>
                  <p className="text-white font-semibold">Vistra (Top U.S. Power Pick)</p>
                  <p className="text-slate-400 text-xs mt-1">Nuclear + gas for AI data centers</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">Cantor Fitzgerald</p>
                  <p className="text-white font-semibold">Broadcom ($525 PT)</p>
                  <p className="text-slate-400 text-xs mt-1">Custom ASIC leader, $73B backlog</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">Deutsche Bank</p>
                  <p className="text-white font-semibold">Eaton (Top Pick 2026)</p>
                  <p className="text-slate-400 text-xs mt-1">Power + cooling infrastructure leader</p>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl">
                  <p className="text-slate-500 text-xs mb-2">Goldman Sachs</p>
                  <p className="text-white font-semibold">TSMC, SK Hynix</p>
                  <p className="text-slate-400 text-xs mt-1">Essential AI chip manufacturing</p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-gradient-to-br from-red-900/10 to-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-red-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Key Risk Factors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-800/40 rounded-lg">
                  <p className="text-red-400 font-semibold text-sm">Valuation Risk</p>
                  <p className="text-slate-400 text-xs mt-1">Many AI stocks trading at premium multiples. Any demand slowdown could trigger correction.</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-lg">
                  <p className="text-red-400 font-semibold text-sm">Geopolitical Risk</p>
                  <p className="text-slate-400 text-xs mt-1">Taiwan (TSMC), China trade restrictions, tariffs could disrupt supply chains.</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-lg">
                  <p className="text-red-400 font-semibold text-sm">Concentration Risk</p>
                  <p className="text-slate-400 text-xs mt-1">Heavy reliance on few hyperscaler customers. Any capex pullback would hurt.</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-lg">
                  <p className="text-red-400 font-semibold text-sm">Competition Risk</p>
                  <p className="text-slate-400 text-xs mt-1">Custom silicon, DeepSeek efficiency gains, in-house chip development by tech giants.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-xs">
            Data sourced from public filings, analyst reports, and market research as of January 2026.
            This dashboard is for informational purposes only and does not constitute investment advice.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Built with deep research across 80+ AI infrastructure assets including stocks, ETFs, commodities, and crypto
          </p>
        </div>
      </div>

      {/* Stock Detail Panel */}
      <StockDetailPanel
        stock={selectedStock}
        sector={sectors.find(s => s.key === activeSector)}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}
