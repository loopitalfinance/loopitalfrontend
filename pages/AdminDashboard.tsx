import React, { useState } from 'react';
import { User, Project, ProjectWithdrawalRequest } from '../types';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, MagnifyingGlassIcon, ChartBarSquareIcon, BanknotesIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Props {
  user: User;
  allProjects: Project[];
  withdrawalRequests: ProjectWithdrawalRequest[];
  onApproveProject: (id: string) => void;
  onRejectProject: (id: string) => void;
  onApproveWithdrawal: (id: number) => void;
  onDistributeReturns: (projectId: string, percentage: number) => void;
}

const AdminDashboard: React.FC<Props> = ({ user, allProjects, withdrawalRequests, onApproveProject, onRejectProject, onApproveWithdrawal, onDistributeReturns }) => {
  const pendingProjects = allProjects.filter(p => p.status === 'pending');
  const activeProjects = allProjects.filter(p => p.status === 'active');
  const pendingWithdrawals = withdrawalRequests.filter(r => r.status === 'pending');
  
  const [distributionProjectId, setDistributionProjectId] = useState<string | null>(null);
  const [returnPercentage, setReturnPercentage] = useState<string>('');

  const handleDistributeClick = (projectId: string) => {
    if (distributionProjectId === projectId) {
        setDistributionProjectId(null);
        setReturnPercentage('');
    } else {
        setDistributionProjectId(projectId);
        setReturnPercentage('');
    }
  };

  const submitDistribution = (projectId: string) => {
      if(!returnPercentage) return;
      onDistributeReturns(projectId, parseFloat(returnPercentage));
      setDistributionProjectId(null);
      setReturnPercentage('');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex justify-between items-center">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Admin Access
           </div>
           <h1 className="text-3xl font-bold text-[#0A192F]">Platform Administration</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input type="text" placeholder="Search Users or Projects" className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]" />
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A192F] p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <ChartBarSquareIcon className="w-20 h-20" />
           </div>
           <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Projects</p>
           <h3 className="text-4xl font-bold">{pendingProjects.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Withdrawals</p>
           <h3 className="text-4xl font-bold text-[#0A192F]">{pendingWithdrawals.length}</h3>
           {pendingWithdrawals.length > 0 && <p className="text-amber-600 text-sm mt-2 font-medium flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4"/> Action Required</p>}
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Users</p>
           <h3 className="text-4xl font-bold text-[#0A192F]">12,402</h3>
           <p className="text-[#00DC82] text-sm mt-2 font-medium">+120 this week</p>
        </div>
      </div>

      {/* Withdrawal Queue */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
         <div className="px-6 py-5 border-b border-slate-100">
           <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
             <BanknotesIcon className="text-slate-400 w-5 h-5" /> Withdrawal Requests
           </h3>
         </div>
         <div className="p-6 space-y-4">
            {pendingWithdrawals.length === 0 ? <p className="text-slate-500 text-sm">No pending withdrawals.</p> : pendingWithdrawals.map((req) => (
              <div key={req.id} className="flex flex-col md:flex-row justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div>
                   <h4 className="text-md font-bold text-[#0A192F]">{req.projectTitle} (Phase {req.phase})</h4>
                   <p className="text-slate-600 text-sm">Amount: ₦{Number(req.amount).toLocaleString()}</p>
                   <p className="text-slate-500 text-xs mt-1">Reason: {req.reason}</p>
                </div>
                <button 
                  onClick={() => onApproveWithdrawal(Number(req.id))}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-white text-sm font-bold rounded-lg hover:bg-slate-800"
                >
                   <CheckCircleIcon className="w-4 h-4" /> Approve
                </button>
              </div>
            ))}
         </div>
      </div>

      {/* Vetting Queue */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
         <div className="px-6 py-5 border-b border-slate-100">
           <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
             <DocumentTextIcon className="text-slate-400 w-5 h-5" /> Vetting Queue (Pending Approval)
           </h3>
         </div>
         <div className="p-6 space-y-4">
            {pendingProjects.length === 0 ? <p className="text-slate-500 text-sm">No pending projects.</p> : pendingProjects.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row gap-6 p-6 border border-slate-100 rounded-xl bg-slate-50">
                <div className="w-full md:w-48 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={project.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="thumb" />
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{project.sector}</span>
                        <h4 className="text-xl font-bold text-[#0A192F]">{project.title}</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Review Pending</span>
                   </div>
                   <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                   
                   <div className="flex gap-4">
                      <button 
                        onClick={() => onApproveProject(String(project.id))}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-teal-700 text-sm font-bold rounded-lg hover:bg-teal-50"
                      >
                         <CheckCircleIcon className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => onRejectProject(String(project.id))}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50"
                      >
                         <XCircleIcon className="w-4 h-4" /> Reject
                      </button>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Active Projects Management */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
         <div className="px-6 py-5 border-b border-slate-100">
           <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
             <CurrencyDollarIcon className="text-slate-400 w-5 h-5" /> Active Projects Management
           </h3>
         </div>
         <div className="p-6 space-y-4">
            {activeProjects.length === 0 ? <p className="text-slate-500 text-sm">No active projects.</p> : activeProjects.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div>
                   <h4 className="text-md font-bold text-[#0A192F]">{project.title}</h4>
                   <p className="text-slate-600 text-sm">Target: ₦{Number(project.targetAmount).toLocaleString()} | Raised: ₦{Number(project.raisedAmount).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    {distributionProjectId === project.id ? (
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm animate-fade-in">
                            <input 
                                type="number" 
                                placeholder="%" 
                                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                                value={returnPercentage}
                                onChange={(e) => setReturnPercentage(e.target.value)}
                            />
                            <button 
                                onClick={() => submitDistribution(project.id)}
                                className="px-3 py-1 bg-[#00DC82] text-[#0A192F] text-xs font-bold rounded hover:bg-[#00c976]"
                            >
                                Pay
                            </button>
                            <button 
                                onClick={() => handleDistributeClick(project.id)}
                                className="px-2 py-1 text-slate-400 hover:text-slate-600"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleDistributeClick(project.id)}
                            className="px-4 py-2 bg-slate-200 text-[#0A192F] text-sm font-bold rounded-lg hover:bg-slate-300"
                        >
                           Distribute Returns
                        </button>
                    )}
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;