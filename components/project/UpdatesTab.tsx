import React from 'react';
import { Project } from '../../types';
import { CheckBadgeIcon, ClockIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
}

const UpdatesTab: React.FC<Props> = ({ project }) => {
  return (
    <div className="animate-fade-in space-y-6">
       {project.milestones && project.milestones.length > 0 ? (
          project.milestones.map((m, idx) => (
             <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${m.status === 'completed' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      {m.status === 'completed' ? <CheckBadgeIcon className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />}
                   </div>
                   {idx !== (project.milestones?.length || 0) - 1 && (
                       <div className="w-0.5 flex-1 bg-slate-100 my-1"></div>
                   )}
                </div>
                <div className="pb-8">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase">{new Date(m.date).toLocaleDateString()}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                         {m.status}
                      </span>
                   </div>
                   <h4 className="text-base font-bold text-slate-900 mb-1">{m.title}</h4>
                   <p className="text-slate-600 text-sm">{m.description}</p>
                   {m.proofDocument && (
                      <a href={m.proofDocument} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                         <DocumentTextIcon className="w-3.5 h-3.5" /> View Document
                      </a>
                   )}
                </div>
             </div>
          ))
       ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
             <p className="text-slate-500 font-medium">No updates posted yet.</p>
          </div>
       )}
    </div>
  );
};

export default UpdatesTab;
