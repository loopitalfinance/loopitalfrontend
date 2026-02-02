import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WithdrawRequestModal, ManageProjectModal } from '../components/OwnerModals';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  ArrowUpTrayIcon, 
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  PlusIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WalletIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  EyeIcon,
  Cog6ToothIcon,
  FlagIcon,
  UserCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

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

const ProjectCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-0 overflow-hidden h-full flex flex-col animate-pulse">
    <div className="h-28 sm:h-32 md:h-48 bg-slate-200 w-full"></div>
    <div className="p-3 md:p-5 flex-1 flex flex-col space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-full hidden md:block"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3 hidden md:block"></div>
      <div className="mt-auto space-y-3 pt-2">
         <div className="flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
         </div>
         <div className="h-2 bg-slate-200 rounded-full"></div>
      </div>
    </div>
    <div className="p-3 pt-0 flex gap-2">
       <div className="h-8 bg-slate-200 rounded-lg flex-1"></div>
       <div className="h-8 bg-slate-200 rounded-lg flex-1"></div>
    </div>
  </div>
);

const PromotionCarousel = () => {
  const slides = [
    { 
      id: 1, 
      title: "Boost Your Campaign", 
      desc: "Get 3x more visibility with our premium package.", 
      color: "bg-[#022c22]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
    },
    { 
      id: 2, 
      title: "Investor Meetup", 
      desc: "Join our exclusive webinar this Friday at 4 PM.", 
      color: "bg-[#064e3b]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"
    },
    { 
      id: 3, 
      title: "Success Tip", 
      desc: "Campaigns with video updates raise 50% more funds.", 
      color: "bg-[#065f46]",
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
    }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

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
                 Featured
               </span>
               <h3 className="text-xl md:text-2xl font-bold font-display mb-1 md:mb-2">{slide.title}</h3>
               <p className="text-white/80 text-xs md:text-sm mb-3 md:mb-4">{slide.desc}</p>
               <button className="px-4 py-1.5 md:px-5 md:py-2 bg-white text-[#022c22] text-[10px] md:text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg">
                 Learn More
               </button>
            </div>
            
            {/* Decorative Icon */}
            <div className="absolute right-4 bottom-4 md:right-10 md:bottom-auto opacity-10 md:opacity-20 transform rotate-12">
               <MegaphoneIcon className="w-24 h-24 md:w-40 md:h-40 text-white" />
            </div>
         </div>
       ))}
       
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

const ProjectOwnerDashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const isOwner = user?.role === 'ProjectOwner';
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<{id: number, projectId: number, amount: number, status: 'pending' | 'approved' | 'rejected', date: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [balanceView, setBalanceView] = useState<'raised' | 'ready'>('raised');

  const [fundingStats, setFundingStats] = useState<any>({
    growthPercentage: 0,
    currentMonthRaised: 0,
    lastMonthRaised: 0,
    chartData: [],
    totalInvestors: 0,
    availableBalance: 0
  });

  // readyBalance is now derived from fundingStats.availableBalance
  const readyBalance = fundingStats?.availableBalance || 0;

  useEffect(() => {
    if (!isOwner) return;
    loadMyProjects();
    loadActivities();
    loadFundingStats();
    loadWithdrawals();

    // Poll for real-time updates every 15 seconds
    const interval = setInterval(() => {
        loadActivities();
        loadFundingStats();
        loadMyProjects();
        loadWithdrawals();
    }, 15000);

    return () => clearInterval(interval);
  }, [isOwner]);

  if (!isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  const loadMyProjects = async () => {
    try {
      const data = await api.getMyListings();
      setMyProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawals = async () => {
    try {
      const data = await api.getProjectWithdrawals();
      setWithdrawals(data || []);
    } catch (error) {
      console.error("Failed to load withdrawals", error);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await api.getRecentActivities();
      setRecentActivities(data);
    } catch (error) {
      console.error("Failed to load activities", error);
    }
  };

  const loadFundingStats = async () => {
    try {
      const data = await api.getFundingStats();
      setFundingStats(data);
    } catch (error) {
      console.error("Failed to load funding stats", error);
    }
  };

  const totalRaised = useMemo(() => myProjects.reduce((sum, p) => sum + Number(p.raisedAmount), 0), [myProjects]);
  const pendingTotal = useMemo(() => withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + Number(w.amount), 0), [withdrawals]);
  const activeProjects = myProjects.filter(p => p.status === 'active').length;
  const fundedProjects = myProjects.filter(p => p.status === 'funded').length;
  const vettingProjects = myProjects.filter(p => p.status === 'pending').length;
  // Use real total investors from backend funding stats
  const totalInvestors = fundingStats.totalInvestors || 0;
  
  const displayProjects = useMemo(() => {
    return [...myProjects]
      .sort((a, b) => {
        // Sort by funded status (has raised amount) then by amount descending
        const aFunded = a.raisedAmount > 0;
        const bFunded = b.raisedAmount > 0;
        if (aFunded && !bFunded) return -1;
        if (!aFunded && bFunded) return 1;
        return b.raisedAmount - a.raisedAmount;
      })
      .slice(0, 4);
  }, [myProjects]);

  // Deduplicate activities
  const uniqueActivities = useMemo(() => {
      const seen = new Set();
      return recentActivities.filter(activity => {
          if (!activity.id) return true; // Keep if no ID (fallback)
          if (seen.has(activity.id)) return false;
          seen.add(activity.id);
          return true;
      });
  }, [recentActivities]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 dark:bg-brand-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
            <h1 className="text-3xl font-display font-bold text-brand-950 dark:text-white mb-2">
                Hello, {user?.name || 'Partner'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                Manage your campaigns, track funding velocity, and update your investors.
            </p>
            </div>
            <button 
                onClick={() => navigate('/create-project')}
                className="flex items-center gap-2 px-6 py-3 bg-[#022c22] text-white hover:bg-[#064e3b] rounded-xl text-sm font-bold shadow-lg shadow-brand-900/20 transition-all transform hover:-translate-y-0.5"
            >
                <PlusIcon className="w-5 h-5" />
                New Project
            </button>
        </div>
      </div>

      {/* Promotion Carousel */}
      <PromotionCarousel />

      {/* Stats Grid - Premium & Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Funds / Ready Balance Carousel */}
        <div className="relative overflow-hidden rounded-2xl bg-[#022c22] p-6 text-white shadow-xl shadow-[#022c22]/10 group min-h-[160px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#064e3b]/30 blur-2xl group-hover:bg-[#064e3b]/40 transition-colors"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-[#00DC82]/10 blur-xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 opacity-80">
                        <div className="p-1.5 bg-white/10 rounded-md backdrop-blur-sm">
                            {balanceView === 'raised' ? (
                                <CurrencyDollarIcon className="w-4 h-4 text-[#00DC82]" />
                            ) : (
                                <WalletIcon className="w-4 h-4 text-[#00DC82]" />
                            )}
                        </div>
                        <span className="text-xs font-medium tracking-wider uppercase text-[#dcfce7]">
                            {balanceView === 'raised' ? 'Total Raised' : 'Ready Balance'}
                        </span>
                    </div>
                    {/* Carousel Controls */}
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setBalanceView(prev => prev === 'raised' ? 'ready' : 'raised')}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4 text-[#dcfce7]" />
                        </button>
                        <button 
                            onClick={() => setBalanceView(prev => prev === 'raised' ? 'ready' : 'raised')}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-[#dcfce7]" />
                        </button>
                    </div>
                </div>
                
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-display font-bold tracking-tight text-white mb-1">
                        {formatCurrency(balanceView === 'raised' ? totalRaised : readyBalance)}
                    </h2>
                    <div className="flex items-center gap-2 mt-4 text-xs text-[#bbf7d0]">
                        {balanceView === 'raised' && (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${fundingStats.growthPercentage >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                <ArrowTrendingUpIcon className={`w-3 h-3 ${fundingStats.growthPercentage < 0 ? 'rotate-180' : ''}`} />
                                {fundingStats.growthPercentage >= 0 ? '+' : ''}{fundingStats.growthPercentage}%
                            </span>
                        )}
                        <span className="opacity-60">
                            {balanceView === 'raised' ? 'vs last month' : 'available to withdraw'}
                        </span>
                    </div>

                    {balanceView === 'raised' && (
                        <div className="mt-2 text-[10px] text-white/70 bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/5">
                            Funds are held in escrow until project is fully funded.
                        </div>
                    )}

                    {balanceView === 'ready' && (
                        <div className="mt-2">
                            {pendingTotal > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] text-amber-200/80 bg-amber-900/30 px-2 py-1 rounded-lg w-fit mb-2">
                                    <ClockIcon className="w-3 h-3" />
                                    <span>Pending: {formatCurrency(pendingTotal)}</span>
                                </div>
                            )}
                            
                            {readyBalance > 0 && fundedProjects > 0 && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWithdrawOpen(true);
                                    }}
                                    className="px-4 py-2 bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#022c22] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#00DC82]/20"
                                >
                                    <ArrowUpTrayIcon className="w-3 h-3" />
                                    Request Withdrawal
                                </button>
                            )}
                            {/* Removed strict lock message if fundedProjects === 0 but readyBalance > 0, per user request to not lock all funds unnecessarily. 
                                Or simply allow withdrawal if balance > 0 but show warning in modal. 
                                For now, I'll relax the condition to allow withdrawal if balance > 0, but the modal handles restrictions.
                            */}
                            {readyBalance > 0 && fundedProjects === 0 && (
                                 <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWithdrawOpen(true);
                                    }}
                                    className="px-4 py-2 bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#022c22] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#00DC82]/20"
                                >
                                    <ArrowUpTrayIcon className="w-3 h-3" />
                                    Request Withdrawal
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 right-4 flex gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${balanceView === 'raised' ? 'bg-[#00DC82]' : 'bg-white/20'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${balanceView === 'ready' ? 'bg-[#00DC82]' : 'bg-white/20'}`}></div>
            </div>
        </div>

        {/* Active Investors */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f0fdf4] dark:bg-slate-800 p-6 border border-[#dcfce7] dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[#047857] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Active Investors</p>
                    <h3 className="text-3xl font-display font-bold text-[#022c22] dark:text-white mt-2">{totalInvestors}</h3>
                </div>
                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg group-hover:bg-[#dcfce7] dark:group-hover:bg-slate-600 transition-colors shadow-sm">
                    <UserGroupIcon className="w-5 h-5 text-[#047857] dark:text-emerald-400" />
                </div>
            </div>
            <div className="w-full bg-[#bbf7d0] dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#059669] h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-[#059669] dark:text-emerald-400 mt-2">Across all your campaigns</p>
        </div>

        {/* Funded Projects (Replaces Active Campaigns) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f0fdf4] dark:bg-slate-800 p-6 border border-[#dcfce7] dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[#047857] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Funded Projects</p>
                    <h3 className="text-3xl font-display font-bold text-[#022c22] dark:text-white mt-2">{fundedProjects}</h3>
                </div>
                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg group-hover:bg-[#dcfce7] dark:group-hover:bg-slate-600 transition-colors shadow-sm">
                    <CheckCircleIcon className="w-5 h-5 text-[#047857] dark:text-emerald-400" />
                </div>
            </div>
             <div className="w-full bg-[#bbf7d0] dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#059669] h-full rounded-full" style={{ width: `${myProjects.length > 0 ? (fundedProjects / myProjects.length) * 100 : 0}%` }}></div>
            </div>
            <p className="text-xs text-[#059669] dark:text-emerald-400 mt-2">{activeProjects} Active · {vettingProjects} Vetting</p>
        </div>
      </div>

      {/* Main Content: Projects List & Funding Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Projects List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-brand-900 dark:text-white">My Campaigns</h3>
              <button 
                onClick={() => navigate('/my-projects')}
                className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                View All
              </button>
            </div>
            
            {loading ? (
               <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                 ))}
               </div>
            ) : myProjects.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-soft">
                <div className="mx-auto w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">No projects yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Create your first project to start raising funds.</p>
                <button 
                  onClick={() => navigate('/create-project')}
                  className="px-6 py-2 bg-brand-900 text-white font-bold rounded-xl hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/20"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400">
                                <th className="p-4 font-bold whitespace-nowrap">Project</th>
                                <th className="p-4 font-bold whitespace-nowrap">Funding Status</th>
                                <th className="p-4 font-bold whitespace-nowrap">Raised / Target</th>
                                <th className="p-4 font-bold whitespace-nowrap"></th>
                                <th className="p-4 font-bold text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {displayProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                                                <img 
                                                    src={project.image || 'https://placehold.co/100x100'} 
                                                    alt={project.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-brand-950 dark:text-white truncate max-w-[150px] md:max-w-[200px]">{project.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{project.sector || 'General'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                                                project.status === 'active' || project.status === 'funded'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                                : project.status === 'pending'
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                            }`}>
                                                {project.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                                                {project.status}
                                            </span>
                                            {(project.status === 'funded' || project.status === 'active' || project.status === 'completed') && (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                    Phase {project.currentPhase || 1}
                                                    {project.totalPhases ? <span className="text-slate-400">/ {project.totalPhases}</span> : ''}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-end gap-1">
                                           <span className="text-xs font-bold text-brand-900 dark:text-white">{formatCurrency(project.raisedAmount)}</span>
                                           <span className="text-[10px] text-slate-400 dark:text-slate-500">/ {formatCurrency(project.targetAmount)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-24 bg-[#f0fdf4] dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                          <div 
                                            className="h-full rounded-full bg-[#15803d] dark:bg-emerald-500 shadow-[0_0_10px_rgba(21,128,61,0.4)] transition-all duration-1000 ease-out relative" 
                                            style={{ width: `${Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100))}%` }}
                                          >
                                          </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSelectedProject(project);
                                                setIsManageOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#022c22] text-white hover:bg-[#064e3b] rounded-lg text-xs font-bold transition-all shadow-md shadow-[#022c22]/20"
                                        >
                                            <Cog6ToothIcon className="w-3.5 h-3.5" />
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
            )}
         </div>

         {/* Right: Funding Chart & Recent Activity */}
         <div className="space-y-8">
            {/* Funding Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-soft">
               <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-6">Funding Velocity</h3>
               <div className="h-64 w-full">
                  {fundingStats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={fundingStats.chartData}>
                          <defs>
                            <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00DC82" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#00DC82" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            dy={10} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            tickFormatter={(val) => `₦${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val/1000).toFixed(0) + 'k'}`} 
                          />
                          <Tooltip 
                              cursor={{ stroke: '#00DC82', strokeWidth: 1, strokeDasharray: '5 5' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                              itemStyle={{ color: '#0f172a' }}
                              formatter={(value: number) => [formatCurrency(value), 'Raised']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#00DC82" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorFunding)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#00DC82' }}
                          />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                       <ArrowTrendingUpIcon className="w-10 h-10 mb-2 opacity-50" />
                       <p className="text-sm">No funding data yet</p>
                    </div>
                  )}
               </div>
            </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
          {uniqueActivities.length > 5 && (
            <button
              onClick={() => navigate('/activities')}
              className="text-xs font-bold text-[#00DC82] hover:text-[#00DC82]/80"
            >
              View All
            </button>
          )}
        </div>

        <div className="flow-root">
          {uniqueActivities.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-400">No recent activity</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {uniqueActivities.slice(0, 5).map((activity, idx) => {
                const typeValue = String(activity.type || '');
                const isInvestment = typeValue === 'investment' || typeValue === 'investment_received';
                const isWithdrawal = typeValue === 'withdrawal';
                const isDeposit = typeValue === 'deposit';

                const dateValue = activity.date || activity.createdAt || activity.requestDate;
                const date = dateValue ? new Date(dateValue) : null;
                const amount = Number(activity.amount || 0);
                const hasAmount = Number.isFinite(amount) && amount !== 0;

                const title = isDeposit ? 'Deposit' : isWithdrawal ? 'Withdrawal' : isInvestment ? 'Investment' : (typeValue ? typeValue.split('_').join(' ') : 'Activity');
                const detailBase = activity.project || activity.title || activity.description || 'Wallet Transaction';
                const detail = activity.project && activity.title ? `${activity.project} • ${activity.title}` : detailBase;

                return (
                  <li key={activity.id || idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDeposit ? 'bg-emerald-100 text-emerald-600' :
                        isWithdrawal ? 'bg-amber-100 text-amber-600' :
                        isInvestment ? 'bg-blue-100 text-blue-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {isDeposit && <ArrowDownLeftIcon className="w-4 h-4" />}
                        {isWithdrawal && <ArrowUpRightIcon className="w-4 h-4" />}
                        {isInvestment && <BriefcaseIcon className="w-4 h-4" />}
                        {!isDeposit && !isWithdrawal && !isInvestment && <ClockIcon className="w-4 h-4" />}
                      </span>
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{title}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {detail}
                          {date ? ` • ${date.toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm whitespace-nowrap ${
                      isDeposit ? 'text-emerald-600' :
                      isWithdrawal ? 'text-slate-900 dark:text-white' :
                      isInvestment ? 'text-emerald-600' :
                      'text-slate-900 dark:text-white'
                    }`}>
                      {hasAmount ? `${isWithdrawal ? '-' : '+'}${formatCurrency(amount)}` : '-'}
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

      <WithdrawRequestModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        projects={myProjects}
        withdrawals={withdrawals}
        onSubmit={async (projectUuid, amount, reason, phase) => {
          try {
             // 1. Submit withdrawal request to backend
             await api.requestProjectWithdrawal(projectUuid, amount, reason, phase);
             
             // 2. Reload funding stats to update Available Balance in real-time
             await loadFundingStats();
             await loadMyProjects();
             await loadWithdrawals();
             
             // 3. Reload activities to show the new pending withdrawal
             await loadActivities();
             
             setIsWithdrawOpen(false);
          } catch (error) {
             console.error("Withdrawal request failed", error);
             alert("Failed to process withdrawal. Please try again.");
          }
        }} 
      />

      <ManageProjectModal 
        isOpen={isManageOpen} 
        onClose={() => setIsManageOpen(false)} 
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectOwnerDashboard;
