import React from 'react';
import { Project } from '../../types';
import { ShieldCheckIcon, CheckBadgeIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
}

const OverviewTab: React.FC<Props> = ({ project }) => {
  return (
    <div className="space-y-10 animate-fade-in">
       
       <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h3>
          <p className="text-slate-600 leading-relaxed text-lg">
             {project.fullDetails || project.description}
          </p>
       </div>

       {/* Metric Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <ArrowTrendingUpIcon className="w-6 h-6 text-[#00DC82]" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
               {project.category === 'Startup' ? 'Equity Offer' : 'Expected ROI'}
             </p>
             <p className="text-2xl font-bold text-slate-900">{project.financialMetrics?.expectedRoi || project.roi + '%'}</p>
             <p className="text-xs font-semibold text-[#00DC82] mt-1">
               {project.category === 'Startup' ? 'Ownership' : 'Annualized'}
             </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-blue-500" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
               {project.category === 'Startup' ? 'Exit Strategy' : 'Cycle Duration'}
             </p>
             <p className="text-2xl font-bold text-slate-900">
               {project.category === 'Startup' ? (project.exitStrategy || 'IPO/Acquisition') : (project.financialMetrics?.tenureMonths || project.durationMonths) + ' Months'}
             </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-orange-500" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Level</p>
             <p className="text-2xl font-bold text-slate-900">{project.riskAssessment?.level || project.riskLevel || 'Moderate'}</p>
          </div>
       </div>
       
       {/* Risk Analysis Note */}
       {project.riskAssessment?.notes && (
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex gap-4">
             <ShieldCheckIcon className="w-6 h-6 text-orange-500 flex-shrink-0" />
             <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Risk Assessment</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{project.riskAssessment.notes}</p>
             </div>
          </div>
       )}
       
       {/* Why Invest Section */}
       <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
             Why Invest in this Economy?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
             {[
                "High demand for maize in biofuel and food processing industries globally.",
                "Advanced soil sensors and satellite imaging to optimize fertilizer usage.",
                "Government backed agricultural incentives ensuring stability.",
                "Direct partnership with major offtakers securing sales upfront."
             ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckBadgeIcon className="w-4 h-4 text-[#00DC82]" />
                   </div>
                   <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default OverviewTab;
