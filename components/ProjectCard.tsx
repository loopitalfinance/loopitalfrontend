
import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { ArrowTrendingUpIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
  onViewDetails?: (project: Project) => void;
  onManage?: (project: Project) => void;
  onClick?: () => void;
}

const ProjectCard: React.FC<Props> = ({ project, onViewDetails, onManage, onClick }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentRaised = Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));

  useEffect(() => {
    // Small delay to ensure the transition triggers after mount
    const timer = setTimeout(() => {
      setAnimatedWidth(percentRaised);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentRaised]);
  
  return (
    <div 
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (onManage) {
          onManage(project);
        } else if (onViewDetails) {
          onViewDetails(project);
        } else {
           // Default navigation if no handler provided
           window.location.href = `/projects/${project.uuid || project.id}`;
        }
      }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-32 sm:h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
           <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shadow-sm ${
             project.sector === 'Agriculture' ? 'bg-emerald-500 text-white border-emerald-400' :
             project.sector === 'Real Estate' ? 'bg-blue-500 text-white border-blue-400' :
             'bg-slate-800 text-white border-slate-700'
           }`}>
             {project.sector}
           </span>
        </div>

        {/* Verified Badge */}
        {project.isVerified && (
           <div className="absolute top-4 right-4">
              <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-[#0A192F] uppercase tracking-wide border border-white/20 flex items-center gap-1">
                <svg className="w-3 h-3 text-[#00DC82]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
           </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-lg font-bold text-[#0A192F] leading-snug mb-2 line-clamp-2">{project.title}</h3>
        <p className="hidden sm:block text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2">
           {project.description}
        </p>
        
        <div className="mt-auto space-y-5">
          {/* Progress Bar */}
          <div className="group/progress relative">
             {/* Tooltip: Exact Amounts */}
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max bg-[#0A192F] text-white text-[10px] py-2.5 px-3.5 rounded-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-xl border border-white/10 flex flex-col gap-1.5 min-w-[120px]">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-1.5 mb-0.5">
                  <span className="text-slate-400 font-medium">Target</span>
                  <span className="font-bold font-mono tracking-tight">₦{project.targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 font-medium">Raised</span>
                  <span className="font-bold text-[#00DC82] font-mono tracking-tight">₦{project.raisedAmount.toLocaleString()}</span>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A192F] rotate-45 border-r border-b border-white/10"></div>
             </div>
             
            <div className="flex justify-between items-end mb-1.5">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Funding Progress</span>
               <span className="text-xs font-bold text-[#00DC82]">
                 {percentRaised}% Funded
               </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-[#00DC82] transition-all duration-1000 ease-out relative" 
                style={{ width: `${animatedWidth}%` }}
              >
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 py-4 border-t border-slate-50">
            {project.category === 'Startup' ? (
              <>
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Equity</p>
                   <p className="text-sm font-bold text-[#00DC82]">{project.equityPercentage}% <span className="text-[10px] text-slate-400 font-normal">Offer</span></p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Valuation</p>
                   <p className="text-sm font-bold text-[#0A192F]">₦{(project.valuation ? project.valuation / 1000000 : 0).toFixed(1)}M</p>
                </div>
              </>
            ) : (
              <>
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Target ROI</p>
                   <p className="text-sm font-bold text-[#00DC82]">{project.roi}% <span className="text-[10px] text-slate-400 font-normal">/ yr</span></p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Duration</p>
                   <p className="text-sm font-bold text-[#0A192F]">{project.durationMonths} Mo</p>
                </div>
              </>
            )}
          </div>

          <button 
            type="button"
            className="w-full py-2.5 sm:py-3 bg-[#0A192F] text-white text-[11px] sm:text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
          >
            View Details <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
