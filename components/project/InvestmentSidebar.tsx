import React from 'react';
import { Project } from '../../types';
import { ArrowTrendingUpIcon, UserCircleIcon, ClockIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
  percentRaised: number;
  investorCount: number;
  daysLeft: number;
  onInvest: () => void;
}

const InvestmentSidebar: React.FC<Props> = ({ project, percentRaised, investorCount, daysLeft, onInvest }) => {
  return (
    <div className="sticky top-24 space-y-6">
       
       {/* Dark Investment Card */}
       <div className="bg-[#0F172A] rounded-3xl shadow-2xl shadow-slate-200/50 p-6 overflow-hidden text-white relative">
          {/* Green Glow Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="flex justify-between items-end mb-4 relative z-10">
             <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Funding Progress</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-3xl font-bold text-white">₦{project.raisedAmount.toLocaleString()}</p>
                   <span className="text-sm text-slate-400">/ ₦{(project.targetAmount / 1000000).toFixed(1)}M</span>
                </div>
             </div>
             <p className="text-[#00DC82] font-bold text-xl">{percentRaised.toFixed(0)}%</p>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-8 relative z-10">
             <div 
               className="h-full bg-[#00DC82] rounded-full shadow-[0_0_12px_rgba(0,220,130,0.5)] transition-all duration-1000 ease-out" 
               style={{ width: `${percentRaised}%` }}
             ></div>
          </div>

          <div className="space-y-4 mb-8 relative z-10">
             <div>
                <label className="block text-xs text-slate-400 font-bold uppercase mb-2">Investment Amount</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                   <input 
                      type="number" 
                      placeholder="5000"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-8 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00DC82] transition-colors font-bold"
                   />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-medium">
                   <span>Min: ₦{project.minInvestment.toLocaleString()}</span>
                   <span>Max: ₦{(project.targetAmount - project.raisedAmount).toLocaleString()}</span>
                </div>
             </div>
          </div>

          <button 
             onClick={onInvest}
             className="w-full py-4 bg-[#00DC82] hover:bg-[#00C675] text-[#0F172A] font-bold rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6 relative z-10"
          >
             Invest Now <ArrowTrendingUpIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 relative z-10">
             <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Investors</p>
                <p className="font-bold text-white flex items-center gap-1 justify-center"><UserCircleIcon className="w-4 h-4" /> {investorCount}</p>
             </div>
             <div className="w-px h-8 bg-slate-800"></div>
             <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Time Left</p>
                <p className="font-bold text-white flex items-center gap-1 justify-center"><ClockIcon className="w-4 h-4" /> {daysLeft} Days</p>
             </div>
          </div>
       </div>

       {/* Secured Ecosystem Card */}
       <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
             <ShieldCheckIcon className="w-6 h-6 text-[#00DC82]" />
          </div>
          <div>
             <h4 className="font-bold text-slate-900 text-sm">SECURED ECOSYSTEM</h4>
             <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Assets are fully insured and collateralized by the project manager.
             </p>
          </div>
       </div>

       {/* Project Manager Card */}
       <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden">
                {/* Placeholder for manager image */}
                <UserCircleIcon className="w-full h-full text-slate-400" />
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Project Manager</p>
                <h4 className="font-bold text-slate-900">{project.ownerDetails?.companyName || project.owner}</h4>
                {project.ownerDetails?.rating && (
                   <div className="flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-600">{project.ownerDetails.rating}</span>
                   </div>
                )}
             </div>
             <button className="ml-auto p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
             </button>
          </div>
       </div>
    </div>
  );
};

export default InvestmentSidebar;
