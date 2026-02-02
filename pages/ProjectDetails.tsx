import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, Investment } from '../types';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import ShareModal from '../components/ShareModal';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ShareIcon,
  HeartIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

// --- Sub-Components defined outside to prevent re-renders/shaking ---

const OverviewTab: React.FC<{ project: Project }> = ({ project }) => (
  <div className="space-y-8">
    <div className="prose prose-slate max-w-none">
      <h3 className="text-xl font-bold text-[#0A192F] mb-4">Executive Summary</h3>
      <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#00DC82]/30 transition-all">
          <h4 className="font-bold text-[#0A192F] mb-2 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-[#00DC82]" /> Risk Mitigation
          </h4>
          <p className="text-sm text-slate-500">
            {project.riskMitigationPlan || "This project is backed by physical assets valued at 150% of the loan amount. Insurance coverage is provided by Leadway Assurance."}
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#00DC82]/30 transition-all">
           <h4 className="font-bold text-[#0A192F] mb-2 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-[#00DC82]" /> Market Validation
          </h4>
          <p className="text-sm text-slate-500">
            {project.tractionData?.summary || "Demand for affordable housing in this location has grown by 25% YoY. Pre-sales have already reached 40% of total units."}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#0A192F] mb-4">The Opportunity</h3>
      <p className="text-slate-600 leading-relaxed">
        {project.fullDetails || "Investors have the unique opportunity to participate in a high-growth real estate development located in the heart of the Lekki Free Trade Zone."}
      </p>
    </div>

    {/* Gallery Grid */}
    {project.images && project.images.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {project.images.map((img, i) => (
           <div key={img.id || i} className="aspect-square rounded-xl overflow-hidden bg-slate-200">
              <img 
                src={img.image} 
                alt={img.caption || "Gallery Image"} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
           </div>
         ))}
      </div>
    ) : null}
  </div>
);

const FinancialsTab: React.FC<{ project: Project; chartData: any[]; minInvest: number }> = ({ project, chartData, minInvest }) => (
  <div className="space-y-8">
     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-[#0A192F] mb-6">Projected Revenue Growth</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00DC82" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00DC82" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Area type="monotone" dataKey="value" stroke="#00DC82" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Valuation</p>
           <p className="text-2xl font-bold text-[#0A192F]">₦{(project.valuation || 50000000).toLocaleString()}</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Min. Investment</p>
           <p className="text-2xl font-bold text-[#0A192F]">₦{minInvest.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Share Price</p>
           <p className="text-2xl font-bold text-[#0A192F]">₦1,000</p>
        </div>
     </div>
  </div>
);

const CalculatorTab: React.FC<{ 
  project: Project; 
  amount: number; 
  setAmount: (val: number) => void;
  estimatedReturn: number;
  profit: number;
}> = ({ project, amount, setAmount, estimatedReturn, profit }) => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-[#0A192F] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
       <div className="absolute top-0 right-0 p-40 bg-[#00DC82] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
       
       <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <CalculatorIcon className="w-6 h-6 text-[#00DC82]" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Profit Calculator</h3>
            <p className="text-slate-400 text-sm">Estimate your potential returns</p>
          </div>
       </div>
       
       <div className="space-y-6 relative z-10">
          <div>
             <label className="text-xs text-slate-400 font-bold uppercase mb-3 block">Investment Amount</label>
             <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00DC82] transition-colors">₦</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00DC82] transition-all"
                />
             </div>
          </div>
          
          <div className="pt-6 border-t border-white/10 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-slate-400">ROI Rate</span>
                <span className="font-bold text-[#00DC82] text-lg">{project.roi || 15}%</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-400">Duration</span>
                <span className="font-bold text-white text-lg">{project.durationMonths || 12} Months</span>
             </div>
             
             <div className="mt-6 p-6 bg-[#00DC82]/10 rounded-2xl border border-[#00DC82]/20">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-[#00DC82] uppercase font-bold">Estimated Returns</p>
                  <p className="text-xs text-[#00DC82] uppercase font-bold">Profit</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-3xl font-bold text-white">₦{estimatedReturn.toLocaleString()}</p>
                  <p className="text-xl font-bold text-[#00DC82]">+₦{profit.toLocaleString()}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

const UpdatesTab: React.FC<{ project: Project }> = ({ project }) => {
  // Use milestones as updates if available, otherwise fallback to existing updates array
  const updates = project.milestones && project.milestones.length > 0 
      ? project.milestones 
      : (project.updates || []);

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-[#0A192F] mb-4">Project Updates & Milestones</h3>
      {updates.length > 0 ? (
        updates.map((update: any) => (
          <div key={update.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-4">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#0A192F]">{update.title}</h4>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    update.status === 'completed' ? 'bg-green-100 text-green-700' :
                    update.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-200 text-slate-600'
                }`}>
                    {update.status || 'Update'}
                </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{update.description || update.content}</p>
            
            {/* Show proof document if available */}
            {update.proof_document && (
                <div className="mt-4">
                    <a 
                        href={update.proof_document} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                        <DocumentTextIcon className="w-4 h-4" />
                        View Proof Document
                    </a>
                </div>
            )}
            
            <p className="text-xs text-slate-400 mt-2">{new Date(update.date || update.created_at).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No updates released yet.</p>
          <p className="text-sm text-slate-400 mt-1">Updates will be posted here as the project progresses.</p>
        </div>
      )}
    </div>
  );
};

const ProjectDetailsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white pb-20 font-inter animate-pulse">
    <div className="h-[60vh] bg-slate-200 w-full relative">
       <div className="absolute bottom-0 left-0 w-full p-12 max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-slate-300 rounded-full mb-4"></div>
          <div className="h-12 w-3/4 bg-slate-300 rounded-lg mb-4"></div>
          <div className="flex gap-4">
             <div className="h-6 w-24 bg-slate-300 rounded"></div>
             <div className="h-6 w-24 bg-slate-300 rounded"></div>
          </div>
       </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 py-12">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
             <div className="flex gap-6 mb-8 border-b border-slate-100 pb-4">
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
             </div>
             <div className="space-y-4">
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
             </div>
          </div>
          <div className="h-96 bg-slate-100 rounded-3xl"></div>
       </div>
    </div>
  </div>
);

// --- Main Component ---

const ProjectDetails: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { projects, user, refreshData } = useApp();
  
  // Support UUID only lookup - Memoize project lookup
  const project = React.useMemo(() => 
    projects.find(p => p && (p.uuid === uuid || String(p.id) === String(uuid))),
    [projects, uuid]
  );

  // Ensure data is loaded
  useEffect(() => {
    if (projects.length === 0) {
        refreshData();
    }
  }, [projects.length, refreshData]);

  const userBalance = user?.walletBalance || 0;

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'updates' | 'calculator'>('overview');
  const [investAmount, setInvestAmount] = useState<string>('');
  
  // Investors State
  const [investorCount, setInvestorCount] = useState<number>(0);
  const [hasFetchedInvestors, setHasFetchedInvestors] = useState(false);
  const [currentUserInvested, setCurrentUserInvested] = useState(false);
  
  // Investment Action State
  const [investing, setInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  
  // Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Profit Calculator State
  const [calculatorAmount, setCalculatorAmount] = useState<number>(100000);

  // Load real investor count - Prevent re-fetching loop
  useEffect(() => {
    const fetchInvestorCount = async () => {
      // Use fallback for id if project is not yet loaded, though effect should handle it
      if (!project?.id || hasFetchedInvestors) return;
      try {
        const allInvestments = await api.getInvestments();
        // Filter investments for this project
        const projectInvestments = allInvestments.filter((inv: any) => {
           const pId = typeof inv.project === 'object' ? inv.project.id : inv.project;
           return String(pId) === String(project.id);
        });
        setInvestorCount(projectInvestments.length);
        
        // Check if current user has invested
        if (user) {
            const hasInvested = projectInvestments.some((inv: any) => {
                const userId = typeof inv.user === 'object' ? inv.user.id : inv.user;
                return String(userId) === String(user.id);
            });
            setCurrentUserInvested(hasInvested);
        }

        setHasFetchedInvestors(true);
      } catch (error: any) {
        console.error('Failed to load investors count', error);
        // Only log out if explicitly 401 and not already handled globally
        if (error.status === 401) {
             // Let the global interceptor handle it, or do nothing if it's just a sub-fetch
        }
      }
    };
    fetchInvestorCount();
  }, [project?.id, hasFetchedInvestors]);

  // Check wishlist state on mount
  useEffect(() => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist_project_ids') || '[]');
      // Ensure we compare as strings to avoid type mismatches
      if (project && wishlist.some((id: string | number) => String(id) === String(project.id))) {
          setIsLiked(true);
      }
  }, [project]);

  if (!project) {
    return <ProjectDetailsSkeleton />;
  }

  const handleInvest = async () => {
    if (!investAmount || !project.id) return;
    
    const amount = Number(investAmount);
    const minimum = project.minInvestment || 50000;
    
    if (amount < minimum) {
       toast.error(`Minimum investment is ₦${minimum.toLocaleString()}`);
       return;
    }
    
    if (userBalance < amount) {
       toast.error("Insufficient wallet balance");
       return;
    }
    
    setInvesting(true);
    setInvestSuccess(false);
    
    try {
      await api.investInProject(project.uuid || project.id, amount);
      setInvestSuccess(true);
       toast.success("Investment successful!");
       refreshData();
       setInvestAmount('');
       // Update local investor count only if not already invested
       if (!currentUserInvested) {
           setInvestorCount(prev => prev + 1);
           setCurrentUserInvested(true);
       }
       // Reset success state after delay
       setTimeout(() => setInvestSuccess(false), 3000);
    } catch (error: any) {
       console.error('Investment failed', error);
       toast.error(error.message || "Investment failed");
       setInvestSuccess(false);
    } finally {
       setInvesting(false);
    }
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist_project_ids') || '[]');
    let newWishlist;
    
    if (isLiked) {
        // Remove - compare as strings
        newWishlist = wishlist.filter((id: string | number) => String(id) !== String(project.id));
        toast.success('Removed from wishlist');
    } else {
        // Add
        if (!wishlist.some((id: string | number) => String(id) === String(project.id))) {
            newWishlist = [...wishlist, project.id];
            toast.success('Added to wishlist');
        } else {
            newWishlist = wishlist;
        }
    }
    
    localStorage.setItem('wishlist_project_ids', JSON.stringify(newWishlist));
    setIsLiked(!isLiked);
  };

  // Calculations
  const progress = Math.min(100, (project.raisedAmount / project.targetAmount) * 100);
  const timeLeft = Math.max(0, Math.ceil((new Date(project.endDate || '2024-12-31').getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const minInvest = project.minInvestment || 50000;
  
  // Profit Calculator Logic
  const estimatedReturn = Math.round(calculatorAmount * (1 + (project.roi || 15)/100));
  const profit = estimatedReturn - calculatorAmount;

  // Chart Data
  const generateChartData = () => {
    if (!project) return [];
    const data = [];
    const months = project.durationMonths || 12;
    const roi = project.roi || 15;
    const startValue = 1000; // Normalized start
    const monthlyGrowth = (roi / 100) / months;
    
    for (let i = 0; i <= Math.min(months, 6); i++) {
       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       const currentMonth = new Date().getMonth();
       const monthLabel = monthNames[(currentMonth + i) % 12];
       
       data.push({
         month: monthLabel,
         value: Math.round(startValue * (1 + (monthlyGrowth * i)))
       });
    }
    return data;
  };
  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-white pb-20 font-inter">
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectTitle={project.title}
        projectImage={project.image}
        projectUuid={project.uuid}
      />
      {/* -- Hero Section -- */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <img 
          src={project.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
           <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 group"
          >
            <ArrowLeftIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
           <div className="flex gap-3">
              <button 
                onClick={handleWishlistToggle}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
              >
                {isLiked ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 max-w-7xl mx-auto z-10">
           <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-end justify-between">
              <div className="flex-1 w-full">
                 <div className="flex gap-2 mb-3 md:mb-4">
                    <span className="px-2.5 py-1 bg-[#00DC82] text-[#0A192F] text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-full">
                       {project.sector}
                    </span>
                    <span className="px-2.5 py-1 bg-white/10 backdrop-blur text-white text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-full border border-white/10">
                       {project.status}
                    </span>
                 </div>
                 <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
                    {project.title}
                 </h1>
                 <div className="flex flex-wrap gap-4 md:gap-6 text-slate-300 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-[#00DC82]" />
                       {project.location || "Lekki, Lagos"}
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-[#00DC82]" />
                       {timeLeft} days left
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5 text-[#00DC82]" />
                       {investorCount > 0 ? investorCount : "Be the first"} Investor{investorCount !== 1 ? 's' : ''}
                    </div>
                 </div>
              </div>
              
              <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl md:min-w-[300px]">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-300 text-xs md:text-sm">Raised Amount</span>
                    <span className="text-xl md:text-2xl font-bold text-white font-mono">₦{project.raisedAmount.toLocaleString()}</span>
                 </div>
                 <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
                    <div className="h-full bg-[#00DC82] rounded-full" style={{ width: `${progress}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[10px] md:text-xs text-slate-400">
                    <span>{progress.toFixed(1)}% Funded</span>
                    <span>Target: ₦{project.targetAmount.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* -- Main Content -- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-2">
               {/* Tabs */}
               <div className="flex gap-6 border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                  {['overview', 'financials', 'updates', 'calculator'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                           activeTab === tab 
                           ? 'border-[#00DC82] text-[#0A192F]' 
                           : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                     >
                        {tab}
                     </button>
                  ))}
               </div>

               {/* Tab Content */}
               <div className="min-h-[400px]">
                  {activeTab === 'overview' && <OverviewTab project={project} />}
                  {activeTab === 'financials' && <FinancialsTab project={project} chartData={chartData} minInvest={minInvest} />}
                  {activeTab === 'calculator' && (
                     <CalculatorTab 
                        project={project} 
                        amount={calculatorAmount} 
                        setAmount={setCalculatorAmount}
                        estimatedReturn={estimatedReturn}
                        profit={profit}
                     />
                  )}
                  {activeTab === 'updates' && <UpdatesTab project={project} />}
               </div>
            </div>

            {/* Right Column (Invest Card) */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
                  <h3 className="text-xl font-bold text-[#0A192F] mb-6">Invest in this Project</h3>
                  
                  <div className="space-y-4 mb-6">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Min. Investment</span>
                        <span className="font-bold text-[#0A192F]">₦{minInvest.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Target Returns</span>
                        <span className="font-bold text-[#00DC82]">{project.roi || 15}%</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-bold text-[#0A192F]">{project.durationMonths || 12} Months</span>
                     </div>
                  </div>

                  <div className="mb-6">
                     <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Amount to Invest</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                        <input 
                           type="number" 
                           value={investAmount}
                           onChange={(e) => setInvestAmount(e.target.value)}
                           placeholder={minInvest.toString()}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 font-bold text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                        />
                     </div>
                  </div>

                  <button 
                     onClick={handleInvest}
                     disabled={investing || investSuccess}
                     className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                        investSuccess 
                        ? 'bg-green-500 text-white cursor-default' 
                        : 'bg-[#0A192F] text-white hover:bg-slate-800'
                     }`}
                  >
                     {investing ? (
                        <>
                           <Spinner size="sm" color="border-white" />
                           <span>Processing...</span>
                        </>
                     ) : investSuccess ? (
                        <>
                           <CheckCircleIcon className="w-6 h-6" />
                           <span>Successful!</span>
                        </>
                     ) : (
                        "Invest Now"
                     )}
                  </button>
                  
                  <p className="text-xs text-slate-400 text-center mt-4">
                     By investing, you agree to our Terms of Service and Risk Disclosure.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
