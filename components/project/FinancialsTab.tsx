import React, { useMemo } from 'react';
import { Project } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  project: Project;
}

const FinancialsTab: React.FC<Props> = ({ project }) => {
  // Funding History for Chart
  const fundingHistory = useMemo(() => {
    return [
       { name: 'Start', amount: 0 },
       { name: 'Wk 2', amount: project.raisedAmount * 0.15 },
       { name: 'Wk 4', amount: project.raisedAmount * 0.35 },
       { name: 'Wk 6', amount: project.raisedAmount * 0.60 },
       { name: 'Wk 8', amount: project.raisedAmount * 0.85 },
       { name: 'Today', amount: project.raisedAmount },
    ];
  }, [project.raisedAmount]);

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Funding Roadmap Table */}
       {project.fundingRoadmap && project.fundingRoadmap.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Funding Roadmap</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Phase</th>
                         <th className="px-6 py-4">Activity</th>
                         <th className="px-6 py-4">Funding Required</th>
                         <th className="px-6 py-4">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {project.fundingRoadmap.map((phase, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">Phase {phase.phaseNumber}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{phase.title}</td>
                            <td className="px-6 py-4 text-slate-900 font-mono">₦{phase.fundingRequired.toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  phase.status === 'Ready to Disburse' ? 'bg-emerald-100 text-emerald-800' :
                                  phase.status === 'Locked' ? 'bg-slate-100 text-slate-500' :
                                  'bg-blue-100 text-blue-800'
                               }`}>
                                  {phase.status}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       )}

       <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Funding Velocity</h3>
             <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-100">Live Tracking</div>
          </div>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingHistory}>
                   <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#94a3b8'}} 
                      tickFormatter={(value) => `₦${(value/1000000).toFixed(0)}M`}
                   />
                   <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Raised']}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAmount)" 
                   />
                </AreaChart>
             </ResponsiveContainer>
          </div>
       </div>

       <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                {project.category === 'Startup' ? 'Equity Offered' : 'Target Return (ROI)'}
             </p>
             <p className="text-3xl font-bold text-slate-900">
                {project.category === 'Startup' ? `${project.equityPercentage}%` : `${project.roi}%`}
             </p>
             <p className="text-xs text-slate-400 mt-1">
                {project.category === 'Startup' ? 'Ownership Stake' : 'Annualized based on projections'}
             </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                {project.category === 'Startup' ? 'Valuation' : 'Investment Duration'}
             </p>
             <p className="text-3xl font-bold text-slate-900">
                {project.category === 'Startup' 
                   ? `₦${Number(project.valuation).toLocaleString()}` 
                   : <>{project.durationMonths} <span className="text-lg text-slate-400 font-medium">Months</span></>}
             </p>
             <p className="text-xs text-slate-400 mt-1">
                {project.category === 'Startup' ? 'Pre-money Valuation' : 'From funding completion'}
             </p>
          </div>
       </div>
    </div>
  );
};

export default FinancialsTab;
