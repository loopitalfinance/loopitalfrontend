import React from 'react';
import { Project } from '../../types';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Props {
  project: Project;
}

const BusinessPlanTab: React.FC<Props> = ({ project }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       {/* Download Section */}
       {project.media?.businessPlanPdf && (
         <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                  <DocumentTextIcon className="w-6 h-6 text-slate-500" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900">Official Business Plan</h4>
                  <p className="text-sm text-slate-500">PDF Document • 2.4 MB</p>
               </div>
            </div>
            <a 
               href={project.media.businessPlanPdf} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
               <ArrowDownTrayIcon className="w-4 h-4" /> Download
            </a>
         </div>
       )}

       <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          {project.problemStatement ? (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Problem Statement</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.problemStatement}
               </p>
             </>
          ) : (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.description} This project aims to revolutionize the {project.sector} sector by leveraging modern technology and sustainable practices. Our goal is to provide high returns to investors while ensuring positive social impact.
               </p>
             </>
          )}

          {project.businessModel ? (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Business Model</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.businessModel}
               </p>
             </>
          ) : (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Market Analysis</h3>
               <p className="text-slate-600 leading-relaxed">
                  The market for {project.sector} is growing rapidly, with an annual CAGR of 5.2%. Demand currently outstrips supply, presenting a significant opportunity for growth and profitability.
               </p>
             </>
          )}
          
          {project.targetMarket && (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Target Market</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.targetMarket}
               </p>
             </>
          )}

          {project.productDescription && (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Product Description</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.productDescription}
               </p>
             </>
          )}

          {project.useOfFunds && (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Use of Funds</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {typeof project.useOfFunds === 'string' ? project.useOfFunds : project.useOfFunds.description || JSON.stringify(project.useOfFunds)}
               </p>
             </>
          )}

          {project.riskMitigationPlan && (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Risk Mitigation Plan</h3>
               <p className="text-slate-600 leading-relaxed mb-6">
                  {project.riskMitigationPlan}
               </p>
             </>
          )}

          {project.exitStrategy && (
             <>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Exit Strategy</h3>
               <p className="text-slate-600 leading-relaxed">
                  {project.exitStrategy}
               </p>
             </>
          )}
       </div>
    </div>
  );
};

export default BusinessPlanTab;
