
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { WithdrawModal } from '../components/WalletModals';
import { 
  BanknotesIcon, 
  ArrowUpTrayIcon, 
  CalendarDaysIcon, 
  BriefcaseIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { Project } from '../types';
import { BACKEND_URL } from '../services/api';

const BASE_URL = BACKEND_URL;

const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
};

const Portfolio: React.FC = () => {
  const { user, investments, projects, refreshData } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'holdings' | 'payouts'>('holdings');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Handle loading state if user is null
  if (!user) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading...</div>;

  const totalInvested = React.useMemo(() => investments.reduce((sum, inv) => sum + Number(inv.amount), 0), [investments]);
  const currentValue = React.useMemo(() => investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0), [investments]);
  const totalProfit = currentValue - totalInvested;

  const handleWithdrawSuccess = (amount: number) => {
    // Optimistic UI update or just refresh
    refreshData();
    setIsWithdrawOpen(false);
  };

  // Real Payout Schedule
  const upcomingPayouts = React.useMemo(() => {
    const allPayouts = investments.flatMap(inv => {
        // If investment is fully exited (currentValue is 0), ignore pending payouts
        // We only show historical processed payouts for exited investments.
        const isExited = Number(inv.currentValue) === 0;
        
        // Resolve project safely
        let project: Project | undefined;
        let projectTitle = 'Unknown Project';
        
        if (typeof inv.project === 'object' && inv.project !== null) {
            project = inv.project as Project;
            projectTitle = project.title;
        } else if (inv.projectTitle) {
            projectTitle = inv.projectTitle;
            // Try to find project object if we only have title/ID
            project = projects.find(p => p.title === inv.projectTitle || p.id == inv.project);
        } else {
             project = projects.find(p => p.id == inv.project);
             if (project) projectTitle = project.title;
        }

        const existingPayouts = inv.payouts ? inv.payouts
            .filter(p => !isExited || p.status === 'processed')
            .map(payout => ({
                id: String(payout.id),
                projectTitle: projectTitle,
                amount: Number(payout.amount),
                date: payout.dueDate, // Keep raw date for sorting
                displayDate: payout.dueDate && !isNaN(new Date(payout.dueDate).getTime()) 
                    ? new Date(payout.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Pending',
                status: payout.status.charAt(0).toUpperCase() + payout.status.slice(1),
                rawStatus: payout.status,
                isProjected: false
            })) 
            : [];
            
        // If no pending payouts exist, and project is active/funded, project one
        const hasPending = existingPayouts.some(p => p.rawStatus === 'pending');
        
        if (!hasPending && project && (project.status === 'active' || project.status === 'funded') && project.roi && project.durationMonths) {
             const investDate = new Date(inv.date);
             const dueDate = new Date(investDate);
             dueDate.setMonth(dueDate.getMonth() + Number(project.durationMonths));
             
             const projectedAmount = Number(inv.amount) + (Number(inv.amount) * Number(project.roi) / 100);
             
             existingPayouts.push({
                 id: `projected-${inv.id}`,
                 projectTitle: projectTitle,
                 amount: projectedAmount,
                 date: dueDate.toISOString(),
                 displayDate: dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                 status: 'Scheduled',
                 rawStatus: 'pending',
                 isProjected: true
             });
        }
        
        return existingPayouts;
    });

    // Filter out Pending payouts if a Processed payout exists for the same Project + Date + Amount
    // This handles cases where an active investment has both a scheduled and processed record for the same event.
    const processedKeys = new Set(
        allPayouts
            .filter(p => p.rawStatus === 'processed')
            .map(p => `${p.projectTitle}-${p.date}-${p.amount}`)
    );

    return allPayouts
        .filter(p => {
            if (p.rawStatus === 'processed') return true;
            const key = `${p.projectTitle}-${p.date}-${p.amount}`;
            return !processedKeys.has(key);
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [investments, projects]);

  // Aggregate Investments by Project
  const groupedInvestments = React.useMemo(() => {
    const groups: { [key: string]: any } = {};

    investments.forEach(inv => {
        // Resolve Project
        let project: Project | undefined;
        if (typeof inv.project === 'object' && inv.project !== null) {
            project = inv.project as Project;
        } else {
            project = projects.find(p => p.id == inv.project);
        }

        if (!project) return;

        const projectId = String(project.id);
        
        if (!groups[projectId]) {
            groups[projectId] = {
                project: project,
                totalAmount: 0,
                currentValue: 0,
                investmentsCount: 0,
                payouts: [],
                lastInvestDate: inv.date
            };
        }

        groups[projectId].totalAmount += Number(inv.amount);
        groups[projectId].currentValue += Number(inv.currentValue);
        groups[projectId].investmentsCount += 1;
        if (inv.payouts) {
            groups[projectId].payouts = [...groups[projectId].payouts, ...inv.payouts];
        }
        // Update last invest date if this one is more recent
        if (new Date(inv.date) > new Date(groups[projectId].lastInvestDate)) {
             groups[projectId].lastInvestDate = inv.date;
        }
    });

    return Object.values(groups).filter(group => {
        if (!searchTerm) return true;
        return group.project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
               group.project.sector.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [investments, projects, searchTerm]);





  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        onSuccess={handleWithdrawSuccess}
        currentBalance={Number(user.walletBalance || 0)}
        user={user}
      />

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#0A192F] to-[#022c22]"></div>
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-[#00DC82]/10 blur-3xl"></div>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                <WalletIcon className="h-3.5 w-3.5 text-[#00DC82]" />
                Portfolio
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                My Portfolio
              </h1>
              <p className="mt-2 text-sm text-white/70 max-w-2xl">
                Track holdings, monitor performance, and manage payouts—built for clarity and speed.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Total Asset Value</p>
              <p className="mt-2 text-2xl font-bold font-mono text-white">
                ₦{(Number(user.walletBalance || 0) + currentValue).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Wallet + holdings
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Wallet Balance</p>
                <p className="mt-2 text-2xl font-bold font-mono text-white truncate">
                  ₦{Number(user.walletBalance || 0).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setIsWithdrawOpen(true)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0A192F] text-xs font-bold hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
              >
                <ArrowUpTrayIcon className="w-4 h-4" /> Withdraw
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Net Profit</p>
              <p className={`mt-2 text-2xl font-bold font-mono ${totalProfit >= 0 ? 'text-[#00DC82]' : 'text-rose-300'}`}>
                ₦{Number(totalProfit).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Based on current holdings value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl p-6 flex items-start gap-4">
         <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#00DC82]">
            <BanknotesIcon className="w-6 h-6" />
         </div>
         <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">How do I receive payments?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
               Returns (dividends) and capital repayments are automatically credited to your <strong>Wallet Balance</strong> on the scheduled payout dates. 
               You can reinvest these funds into new projects or withdraw them directly to your verified bank account at any time using the "Withdraw" button above.
            </p>
         </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit">
            <button 
            onClick={() => setActiveTab('holdings')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'holdings' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
            Active Holdings
            </button>
            <button 
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'payouts' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
            Payout Schedule
            </button>
        </div>

        <div className="relative w-full md:w-64">
             <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
                type="text" 
                placeholder="Search portfolio..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00DC82] transition-all"
             />
        </div>
      </div>

      {activeTab === 'holdings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
           {groupedInvestments.filter(g => g.currentValue > 0).length === 0 ? (
               <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                  <div className="mx-auto h-12 w-12 text-slate-300">
                     <BriefcaseIcon />
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">No active holdings</h3>
                  <p className="mt-1 text-sm text-slate-500">You don't have any active investments yet.</p>
                  <button 
                     onClick={() => navigate('/projects')}
                     className="mt-4 px-4 py-2 bg-[#00DC82] text-[#0A192F] text-sm font-bold rounded-xl hover:bg-[#00DC82]/90 transition-colors"
                  >
                     Explore Projects
                  </button>
               </div>
           ) : (
               groupedInvestments.filter(g => g.currentValue > 0).map((group) => {
                  const { project, totalAmount, currentValue, payouts, investmentsCount } = group;
              
              const percentReturn = totalAmount > 0 ? ((currentValue - totalAmount) / totalAmount) * 100 : 0;
              const hasReturns = payouts?.some((p: any) => p.status === 'processed');
              
              // Find the next upcoming payout
              let nextPayout = payouts
                  ?.filter((p: any) => p.status === 'pending')
                  .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

              // Fallback to projected if no real payout exists
              if (!nextPayout && project && (project.status === 'funded') && project.roi && project.durationMonths) {
                   const investDate = new Date(group.lastInvestDate);
                   const dueDate = new Date(investDate);
                   dueDate.setMonth(dueDate.getMonth() + Number(project.durationMonths));
                   
                   const projectedAmount = Number(totalAmount) + (Number(totalAmount) * Number(project.roi) / 100);
                   
                   nextPayout = {
                       id: `projected-${project.id}`,
                       amount: projectedAmount,
                       dueDate: dueDate.toISOString(),
                       status: 'pending'
                   } as any;
              }

              return (
                 <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                              {getImageUrl(project.image) || getImageUrl(project.images?.[0]?.image) ? (
                                  <img src={getImageUrl(project.image) || getImageUrl(project.images?.[0]?.image) || ''} alt="" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <BuildingOfficeIcon className="w-6 h-6" />
                                  </div>
                              )}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{project.title}</h3>
                             <p className="text-xs text-slate-500 mb-1">{project.sector}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">
                                Raised: <span className="text-slate-600 dark:text-slate-300">₦{(project.raisedAmount/1000000).toFixed(1)}M</span> / ₦{(project.targetAmount/1000000).toFixed(1)}M
                             </p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                           {hasReturns && (
                               <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-100 dark:border-teal-900/30">
                                   Returns Paid
                               </span>
                           )}
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border ${
                               project.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30' :
                               project.status === 'funded' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30' :
                               'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-600'
                           }`}>
                               {project.status === 'active' ? 'Active' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                           </span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Invested</p>
                              {investmentsCount > 1 && (
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300">{investmentsCount} rounds</span>
                              )}
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">₦{Number(totalAmount).toLocaleString()}</p>
                       </div>
                       
                       {nextPayout ? (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                             <p className="text-[10px] text-blue-400 font-bold uppercase">Upcoming Payout</p>
                             <p className="text-sm font-bold text-blue-900 dark:text-blue-200">₦{Number(nextPayout.amount).toLocaleString()}</p>
                             <p className="text-[10px] text-blue-400 mt-0.5">
                                {new Date(nextPayout.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                             </p>
                          </div>
                       ) : (
                          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Current Value</p>
                             <p className={`text-sm font-bold ${percentReturn >= 0 ? 'text-[#00DC82]' : 'text-red-500'}`}>
                                ₦{Number(currentValue).toLocaleString()}
                             </p>
                          </div>
                       )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <ArrowTrendingUpIcon className="w-4 h-4 text-[#00DC82]" />
                          <span>{percentReturn.toFixed(1)}% Return</span>
                       </div>
                       <button 
                       onClick={() => navigate(`/projects/${project?.uuid || project?.id}`)}
                       className="text-xs font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                     >
                        View Details
                     </button>
                    </div>
                 </div>
               );
            }))}
         </div>
      )}

      {activeTab === 'payouts' && (
         <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
               <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-slate-500" /> Upcoming Distributions
               </h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
               {upcomingPayouts.map((payout, i) => (
                  <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-600">
                           {payout.displayDate === 'Pending' ? (
                               <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Pending</span>
                           ) : (
                               <>
                                   <span className="text-xs uppercase text-slate-500 dark:text-slate-400">{payout.displayDate.split(' ')[1]}</span>
                                   <span className="text-lg">{payout.displayDate.split(' ')[0]}</span>
                               </>
                           )}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">{payout.projectTitle}</h4>
                           <p className="text-xs text-slate-500">Quarterly Dividend Payment</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between md:justify-end gap-8 flex-grow">
                        <div className="text-right">
                           <p className="text-xs text-slate-400 font-bold uppercase">Amount</p>
                           <p className="font-bold text-[#00DC82] font-mono">₦{payout.amount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                           payout.rawStatus === 'processed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 
                           payout.rawStatus === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                           'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                           {payout.status}
                        </span>
                     </div>
                  </div>
               ))}
               {upcomingPayouts.length === 0 && (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                     No upcoming payouts scheduled.
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default Portfolio;
