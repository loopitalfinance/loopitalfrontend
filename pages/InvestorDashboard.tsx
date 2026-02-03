import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TopUpModal, WithdrawModal } from '../components/WalletModals';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ClockIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MegaphoneIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Project, User, Investment, Transaction } from '../types';
import { api, BACKEND_URL } from '../services/api';

const BASE_URL = BACKEND_URL;

const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

const AnimatedProgressBar = ({ percentage, colorClass = "bg-primary-600", heightClass = "h-1.5" }: { percentage: number, colorClass?: string, heightClass?: string }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`w-full bg-brand-100 rounded-full overflow-hidden ${heightClass}`}>
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

const PromotionCarousel = () => {
  const navigate = useNavigate();
  const slides = [
    { 
      id: 1, 
      title: "New Real Estate Fund", 
      desc: "Invest in Lekki's newest luxury development. 25% projected ROI.", 
      color: "bg-[#022c22]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
    },
    { 
      id: 2, 
      title: "AgriTech Opportunities", 
      desc: "Support sustainable farming and earn steady returns.", 
      color: "bg-[#064e3b]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"
    },
    { 
      id: 3, 
      title: "Portfolio Diversification", 
      desc: "Learn how to balance high-growth and stable assets.", 
      color: "bg-[#065f46]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
    }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-3xl h-40 md:h-48 mb-8 shadow-lg group">
       {slides.map((slide, idx) => (
         <div 
            key={slide.id} 
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center px-6 md:px-10 ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} ${slide.color}`}
         >
            <div className={`absolute inset-0 opacity-10 ${slide.pattern}`}></div>
            <div className="relative z-10 text-white max-w-lg">
               <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-white/20 backdrop-blur rounded-full text-[10px] md:text-xs font-bold mb-2 md:mb-3 border border-white/10 text-[#00DC82]">
                 Featured Opportunity
               </span>
               <h3 className="text-xl md:text-2xl font-bold font-display mb-1 md:mb-2">{slide.title}</h3>
               <p className="text-white/80 text-xs md:text-sm mb-3 md:mb-4">{slide.desc}</p>
               <button 
                 onClick={() => navigate('/projects')}
                 className="px-4 py-1.5 md:px-5 md:py-2 bg-white text-[#022c22] text-[10px] md:text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
               >
                 View Details
               </button>
            </div>
            
            {/* Decorative Icon */}
            <div className="absolute right-4 bottom-4 md:right-10 md:bottom-auto opacity-10 md:opacity-20 transform rotate-12">
               <MegaphoneIcon className="w-24 h-24 md:w-40 md:h-40 text-white" />
            </div>
         </div>
       ))}

       <button
         type="button"
         onClick={goPrev}
         className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-2xl border border-white/15 bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/15 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
         title="Previous"
       >
         <ChevronLeftIcon className="h-5 w-5" />
       </button>
       <button
         type="button"
         onClick={goNext}
         className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-2xl border border-white/15 bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/15 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
         title="Next"
       >
         <ChevronRightIcon className="h-5 w-5" />
       </button>
       
       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
         {slides.map((_, idx) => (
           <button 
             key={idx} 
             onClick={() => setCurrent(idx)} 
             className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#00DC82] w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'}`} 
           />
         ))}
       </div>
    </div>
  );
};

const InvestorDashboard: React.FC = () => {
  const { user, investments, refreshData, isLoading, projects } = useApp();
  const navigate = useNavigate();
  const isOwner = user?.role === 'ProjectOwner';
  const [timeRange, setTimeRange] = useState('1Y');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [balanceView, setBalanceView] = useState<'total' | 'wallet'>('total');
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  if (isOwner) {
    return <Navigate to="/creator/dashboard" replace />;
  }

  const loadTransactions = async () => {
      try {
          const data = await api.getTransactions();
          setTransactions(data); // Store all transactions for calculations
      } catch (error) {
          console.error("Failed to load transactions", error);
      }
  };

  // Session Check
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user) {
        refreshData();
        loadTransactions();

        // Poll for real-time updates every 15 seconds
        const interval = setInterval(() => {
            refreshData();
            loadTransactions();
        }, 15000);

        return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const fetchPerformance = async () => {
        setIsLoadingChart(true);
        try {
            const data = await api.getPortfolioPerformance(timeRange);
            if (data.labels && data.data) {
                const formattedData = data.labels.map((label: string, index: number) => ({
                    name: label,
                    value: data.data[index]
                }));
                setChartData(formattedData);
            }
        } catch (error) {
            console.error("Failed to fetch portfolio performance", error);
        } finally {
            setIsLoadingChart(false);
        }
    };
    fetchPerformance();
  }, [timeRange]);

  // Financial Calculations
  const currentValue = useMemo(() => investments.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0), [investments]);
  const totalInvested = useMemo(() => investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0), [investments]);

  const getInvestmentReturns = (inv: Investment) => {
    return inv.payouts 
        ? inv.payouts
            .filter((p) => p.status === 'processed')
            .reduce((sum, p) => sum + Number(p.amount), 0)
        : 0;
  };

  const realizedReturns = useMemo(() => {
    return investments.reduce((sum, inv) => sum + getInvestmentReturns(inv), 0);
  }, [investments, projects]);

  const totalProfit = currentValue - totalInvested + realizedReturns;

  const pendingWithdrawals = useMemo(() => {
    return transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'pending')
        .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);
  const totalBalance = (user?.walletBalance || 0) + currentValue;
  const walletBalance = user?.walletBalance || 0;

  // Portfolio Distribution for Donut Chart
  const portfolioDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    if (investments.length === 0) return [];
    
    investments.forEach(inv => {
        const project =
          typeof inv.project === 'object' && inv.project !== null
            ? (inv.project as Project)
            : projects.find(p => String(p.id) === String(inv.project) || String(p.uuid) === String(inv.project));
        const sector = project?.sector || 'Other';
        distribution[sector] = (distribution[sector] || 0) + Number(inv.amount);
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [investments]);

  // Group investments by project to avoid duplicates in the table
  const groupedInvestments = useMemo(() => {
    const groups: { [key: string]: Investment & { totalAmount: number, totalCurrentValue: number, projectData: Project | null } } = {};
    
    investments.forEach(inv => {
      // Resolve project ID and Data
      let projectId: string | number = '';
      let projectData: Project | null = null;
      
      if (typeof inv.project === 'object' && inv.project !== null) {
        projectId = (inv.project as Project).id;
        projectData = inv.project as Project;
      } else {
        projectId = inv.project as string | number;
        projectData = projects.find(p => String(p.id) === String(projectId) || String(p.uuid) === String(projectId)) || null;
      }
      
      if (!projectId) return; // Skip if no project ID

      const key = String(projectId);
      
      if (!groups[key]) {
        groups[key] = { 
          ...inv, 
          projectData, // Store resolved project data
          totalAmount: 0, 
          totalCurrentValue: 0 
        };
      }
      
      groups[key].totalAmount += Number(inv.amount);
      groups[key].totalCurrentValue += Number(inv.currentValue || inv.amount);
    });
    
    return Object.values(groups);
  }, [investments, projects]);

  const activePortfolio = useMemo(() => {
    return groupedInvestments.filter((inv) => {
      const statusValue = String(inv.projectData?.status || '').toLowerCase();
      if (!inv.projectData) return false;
      if (statusValue === 'completed') return false;
      return true;
    });
  }, [groupedInvestments]);

  const completedPortfolioCount = useMemo(() => {
    return groupedInvestments.filter((inv) => String(inv.projectData?.status || '').toLowerCase() === 'completed').length;
  }, [groupedInvestments]);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-[#00DC82]/10 text-[#00DC82]';
      case 'funding': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const nextUpcomingPayout = useMemo(() => {
    const now = new Date();
    const candidates: Array<{ dueDate: Date; amount: number; projectTitle: string }> = [];

    investments.forEach((inv) => {
      const project =
        typeof inv.project === 'object' && inv.project !== null
          ? (inv.project as Project)
          : projects.find((p) => String(p.id) === String(inv.project) || String(p.uuid) === String(inv.project));
      const projectTitle = project?.title || inv.projectTitle || 'Project';

      (inv.payouts || []).forEach((p: any) => {
        const statusValue = String(p?.status || '').toLowerCase();
        if (statusValue !== 'pending') return;
        const due = new Date(p?.dueDate || '');
        if (isNaN(due.getTime())) return;
        if (due <= now) return;
        candidates.push({ dueDate: due, amount: Number(p?.amount || 0), projectTitle });
      });
    });

    if (candidates.length === 0) return null;
    const next = candidates.reduce((earliest, current) => (current.dueDate < earliest.dueDate ? current : earliest), candidates[0]);

    return {
      dateLabel: next.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: next.amount,
      projectTitle: next.projectTitle,
    };
  }, [investments, projects]);

  const nextPayoutDate = nextUpcomingPayout?.dateLabel;

  // Enhanced colors for better visualization (Green Theme)
  const COLORS = ['#00DC82', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  if (isLoading) {
      return (
          <div className="space-y-8 animate-fade-in pb-10">
              {/* Header Skeleton */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden h-[200px] animate-pulse">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 h-full">
                      <div className="space-y-4 w-1/3">
                           <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
                           <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
                      </div>
                      <div className="flex gap-4 mt-6 md:mt-0">
                          <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                          <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                      </div>
                  </div>
              </div>

              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-[400px] animate-pulse">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
                      <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-full"></div>
                          ))}
                      </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-[400px] animate-pulse">
                       <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
                       <div className="space-y-6">
                          {[1, 2, 3, 4].map(i => (
                              <div key={i} className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                  <div className="flex-1 space-y-2">
                                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                  </div>
                              </div>
                          ))}
                       </div>
                  </div>
              </div>
          </div>
      );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 dark:bg-brand-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
            <h1 className="text-3xl font-display font-bold text-brand-950 dark:text-white mb-2">
                Welcome back, {user?.firstName || 'Investor'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                Track your portfolio performance, discover new opportunities, and manage your assets.
            </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setIsTopUpOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                    <WalletIcon className="w-5 h-5" />
                    Top Up
                </button>
                <button 
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#022c22] text-white hover:bg-[#064e3b] rounded-xl text-sm font-bold shadow-lg shadow-brand-900/20 transition-all transform hover:-translate-y-0.5"
                >
                    <BanknotesIcon className="w-5 h-5" />
                    Browse Projects
                </button>
            </div>
        </div>
      </div>

      <PromotionCarousel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#022c22] p-6 text-white shadow-xl shadow-[#022c22]/10 group min-h-[160px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#064e3b]/30 blur-2xl group-hover:bg-[#064e3b]/40 transition-colors"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-[#00DC82]/10 blur-xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 opacity-80">
                        <div className="p-1.5 bg-white/10 rounded-md backdrop-blur-sm">
                            {balanceView === 'total' ? (
                                <CurrencyDollarIcon className="w-4 h-4 text-[#00DC82]" />
                            ) : (
                                <WalletIcon className="w-4 h-4 text-[#00DC82]" />
                            )}
                        </div>
                        <span className="text-xs font-medium tracking-wider uppercase text-[#dcfce7]">
                            {balanceView === 'total' ? 'Total Portfolio Value' : 'Wallet Balance'}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setBalanceView(prev => prev === 'total' ? 'wallet' : 'total')}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            title="Previous"
                        >
                            <ChevronLeftIcon className="w-4 h-4 text-[#dcfce7]" />
                        </button>
                        <button 
                            onClick={() => setBalanceView(prev => prev === 'total' ? 'wallet' : 'total')}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            title="Next"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-[#dcfce7]" />
                        </button>
                    </div>
                </div>
                
                <div className="mb-4">
                    <h2 className="text-3xl font-display font-bold tracking-tight text-white">
                        {formatCurrency(balanceView === 'total' ? totalBalance : walletBalance)}
                    </h2>
                    <p className="text-xs text-[#dcfce7]/70 mt-1">
                        {balanceView === 'total' ? 'Includes wallet & investments' : 'Available for withdrawal'}
                    </p>
                    {nextPayoutDate && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#bbf7d0] bg-white/10 px-2 py-1 rounded-lg w-fit backdrop-blur-sm border border-white/10">
                            <ClockIcon className="w-3 h-3" />
                            <span>Next payout: {nextPayoutDate}</span>
                        </div>
                    )}
                    {balanceView === 'wallet' && pendingWithdrawals > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-200/80 bg-amber-900/30 px-2 py-1 rounded-lg w-fit backdrop-blur-sm border border-amber-500/20">
                            <ClockIcon className="w-3 h-3" />
                            <span>Pending: {formatCurrency(pendingWithdrawals)}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                   {balanceView === 'wallet' && (
                       <button 
                         onClick={() => setIsWithdrawOpen(true)}
                         className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
                       >
                           Withdraw
                       </button>
                   )}
                   <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md ${totalProfit >= 0 ? 'text-[#00DC82] bg-[#00DC82]/10' : 'text-red-500 bg-red-500/10'}`}>
                       <ArrowTrendingUpIcon className={`w-3 h-3 ${totalProfit < 0 ? 'transform rotate-180' : ''}`} />
                       <span>{totalProfit >= 0 ? '+' : ''}{totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0'}%</span>
                   </div>
                </div>
            </div>
        </div>

        {/* Active Investments */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Portfolio Status</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activePortfolio.length}</h3>
                        <span className="text-sm text-slate-500">Active</span>
                    </div>
                </div>
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400">
                    <BuildingOfficeIcon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Completed Projects</span>
                    <span className="font-bold text-slate-900 dark:text-white">{completedPortfolioCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: `${groupedInvestments.length > 0 ? (activePortfolio.length / groupedInvestments.length) * 100 : 0}%` }}></div>
                </div>
            </div>
        </div>

        {/* Returns Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Returns</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(realizedReturns)}</h3>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <ChartBarIcon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-2">Next Payout</p>
                <div className="flex items-center gap-2">
                    {nextPayoutDate ? (
                        <>
                            <ClockIcon className="w-4 h-4 text-[#00DC82]" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{nextPayoutDate}</span>
                            {nextUpcomingPayout?.amount ? (
                              <span className="text-xs font-bold text-[#00DC82] bg-[#00DC82]/10 px-2 py-1 rounded-lg">
                                {formatCurrency(nextUpcomingPayout.amount)}
                              </span>
                            ) : null}
                        </>
                    ) : (
                        <span className="text-sm font-medium text-slate-400 italic">No upcoming payouts</span>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Portfolio Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Portfolio</h3>
                    <p className="text-sm text-slate-500">Real-time progress and funding milestones.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                    Filter
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                            <th className="pb-4 pl-2">Project</th>
                            <th className="pb-4">Financials</th>
                            <th className="pb-4">Progress</th>
                            <th className="pb-4 text-right pr-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                        {groupedInvestments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                                    No active investments found.
                                </td>
                            </tr>
                        ) : (
                            groupedInvestments.map((inv) => {
                                const project = inv.projectData;
                                const imageUrl = project?.image || project?.images?.[0]?.image;
                                const raised = Number(project?.raisedAmount || 0);
                                const target = Number(project?.targetAmount || 1); // Avoid division by zero
                                const percentage = Math.min(100, (raised / target) * 100);
                                
                                return (
                                <tr key={inv.id} className="group">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 relative">
                                                {imageUrl ? (
                                                    <img 
                                                      src={getImageUrl(imageUrl) || ''} 
                                                      alt="" 
                                                      className="w-full h-full object-cover" 
                                                      onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        // Show fallback icon sibling if exists, or handled by parent style
                                                        (e.target as HTMLImageElement).parentElement?.classList.add('fallback-icon-bg');
                                                      }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <BuildingOfficeIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{project?.title || 'Unknown Project'}</h4>
                                                <p className="text-xs text-slate-500">{project?.sector || project?.category || 'General'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Invested</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(inv.totalAmount)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Value</span>
                                                <span className="text-sm font-bold text-[#00DC82]">{formatCurrency(inv.totalCurrentValue)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 min-w-[180px] pr-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                {Math.round(percentage)}% Funded
                                            </span>
                                            {project?.status && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            )}
                                        </div>
                                        <AnimatedProgressBar percentage={percentage} colorClass="bg-[#00DC82]" />
                                        <div className="mt-2 flex flex-col gap-1 text-[10px] text-slate-500">
                                            <div className="flex justify-between">
                                                <span>Raised:</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">₦{Number(project?.raisedAmount||0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Target:</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">₦{Number(project?.targetAmount||0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button 
                                            onClick={() => navigate(`/projects/${project?.uuid || project?.id}`)}
                                            className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-8">
            {/* Portfolio Allocation Donut */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Allocation</h3>
                <div className="h-[250px] w-full">
                    {portfolioDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={portfolioDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {portfolioDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <ChartBarIcon className="w-12 h-12 mb-2 opacity-50" />
                            <p className="text-sm">No investment data yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                {transactions.length > 5 && (
                  <button
                    onClick={() => navigate('/activities')}
                    className="text-xs font-bold text-[#00DC82] hover:text-[#00DC82]/80"
                  >
                    View All
                  </button>
                )}
            </div>
            
            <div className="flow-root">
               {transactions.length === 0 ? (
                  <div className="text-center py-10">
                      <p className="text-sm text-slate-400">No recent activity</p>
                  </div>
               ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {transactions.slice(0, 5).map((txn, idx) => {
                     const isDeposit = txn.type === 'deposit';
                     const isInvestment = txn.type === 'investment';
                     const isWithdrawal = txn.type === 'withdrawal';
                     const amount = Number(txn.amount);
                     
                     return (
                        <li key={txn.id || idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isDeposit ? 'bg-emerald-100 text-emerald-600' :
                                    isWithdrawal ? 'bg-amber-100 text-amber-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {isDeposit && <ArrowDownLeftIcon className="w-4 h-4" />}
                                    {isWithdrawal && <ArrowUpRightIcon className="w-4 h-4" />}
                                    {isInvestment && <BriefcaseIcon className="w-4 h-4" />}
                                </span>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {isDeposit ? 'Deposit' : isInvestment ? `Invested in ${txn.description || 'Project'}` : 'Withdrawal'}
                                    </p>
                                    <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold text-sm whitespace-nowrap ${isDeposit ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                {isDeposit ? '+' : '-'}{formatCurrency(amount)}
                            </span>
                        </li>
                     );
                  })}
                  </ul>
               )}
            </div>
        </div>
      </div>
      </div>

      {/* Featured Projects Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Featured Projects</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Hand-picked opportunities with high potential returns.</p>
            </div>
            <button onClick={() => navigate('/projects')} className="text-sm font-bold text-[#00DC82] hover:text-[#00DC82]/80 transition-colors">
                View All Projects
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects && projects.slice(0, 3).map((project) => (
                <div key={project.id} onClick={() => navigate(`/projects/${project.uuid}`)} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                   <div className="relative h-48 overflow-hidden">
                      <img 
                        src={project.image || project.images?.[0]?.image || "https://via.placeholder.com/400x300"} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center', 'bg-slate-200');
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-[#00DC82] flex items-center gap-1 shadow-sm">
                          <CheckCircleIcon className="w-3 h-3" />
                          Featured
                      </div>
                      <div className="absolute bottom-4 left-4">
                         <span className="px-3 py-1 bg-[#00DC82] text-[#0A192F] text-[10px] font-bold uppercase rounded-full shadow-lg">
                            {project.sector}
                         </span>
                      </div>
                   </div>
                   
                   <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-[#0A192F] dark:text-white mb-2 line-clamp-1">{project.title}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Target</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{formatCurrency(project.targetAmount)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">ROI</span>
                            <span className="text-sm font-bold text-[#00DC82]">{project.roi}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-2">
                        <div className="bg-[#00DC82] h-full rounded-full" style={{ width: `${Math.min(100, (project.raisedAmount / project.targetAmount) * 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-4">
                        <span>{Math.round((project.raisedAmount / project.targetAmount) * 100)}% Funded</span>
                        <span>{formatCurrency(project.raisedAmount)} Raised</span>
                      </div>

                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${project.uuid}`);
                        }}
                        className="w-full mt-auto py-2.5 bg-[#0A192F] text-white rounded-xl text-sm font-bold hover:bg-[#0A192F]/90 transition-colors shadow-lg shadow-[#0A192F]/20 flex items-center justify-center gap-2"
                      >
                        Invest Now
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      </button>
                   </div>
                </div>
            ))}
        </div>
      </div>

      <TopUpModal 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        email={user?.email || ''} 
        onSuccess={() => { refreshData(); setIsTopUpOpen(false); }} 
      />
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        currentBalance={user?.walletBalance || 0}
        user={user || undefined} 
        onSuccess={() => { refreshData(); setIsWithdrawOpen(false); }} 
      />
    </div>
  );
};

export default InvestorDashboard;
