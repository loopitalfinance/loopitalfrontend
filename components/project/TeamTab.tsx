import React from 'react';
import { Project } from '../../types';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
  onViewProfile: () => void;
}

const TeamTab: React.FC<Props> = ({ project, onViewProfile }) => {
  return (
    <div className="animate-fade-in bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
       <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
          <BuildingOfficeIcon className="w-10 h-10 text-slate-400" />
       </div>
       <h3 className="text-xl font-bold text-slate-900 mb-2">{project.owner}</h3>
       <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
          We are a dedicated team of professionals with over 10 years of experience in the {project.sector} industry.
       </p>
       <button onClick={onViewProfile} className="text-emerald-600 font-bold text-sm hover:underline">
          View Full Profile
       </button>
    </div>
  );
};

export default TeamTab;
