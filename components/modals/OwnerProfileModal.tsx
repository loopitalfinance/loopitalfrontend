import React from 'react';
import { XMarkIcon, BuildingOfficeIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { VerificationDetails, ProjectOwnerDetails } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
  sector: string;
  verificationDetails?: VerificationDetails;
  ownerDetails?: ProjectOwnerDetails;
}

const OwnerProfileModal: React.FC<Props> = ({ isOpen, onClose, ownerName, sector, verificationDetails, ownerDetails }) => {
  if (!isOpen) return null;
  
  const isVerified = ownerDetails?.identityStatus === 'Verified' || verificationDetails?.statusBadge === 'Verified';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
          <div className="p-6">
             <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                   <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                      <BuildingOfficeIcon className="w-8 h-8 text-slate-400" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900">{ownerName}</h3>
                      <p className="text-sm text-slate-500">{sector} Developer</p>
                      <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                         isVerified
                         ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                         : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                         {isVerified ? <CheckBadgeIcon className="w-3.5 h-3.5" /> : <ExclamationTriangleIcon className="w-3.5 h-3.5" />}
                         {isVerified ? 'Verified Identity' : 'Verification Pending'}
                      </div>
                   </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                   <XMarkIcon className="w-5 h-5" />
                </button>
             </div>
             
             <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-slate-900">{ownerDetails?.projectsCompleted || 0}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Projects</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-emerald-600">{ownerDetails?.rating ? `${ownerDetails.rating}/5` : 'N/A'}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Rating</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-slate-900">--</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Tenure</p>
                </div>
             </div>
             
             {verificationDetails && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Verification Status</h4>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                         <span className="text-slate-500">Verified By</span>
                         <span className="font-medium text-slate-900">{verificationDetails.verifiedBy}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-slate-500">Last Inspection</span>
                         <span className="font-medium text-slate-900">{verificationDetails.lastInspectionDate}</span>
                      </div>
                   </div>
                </div>
             )}
             
             <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">About</h4>
             <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {ownerName} is a developer in the {sector} sector. 
                {isVerified 
                   ? ' Their identity and business credentials have been verified by Loopital.'
                   : ' Their identity verification is currently in progress.'}
             </p>
             
             <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-200">
                Contact Business
             </button>
          </div>
       </div>
    </div>
  );
};

export default OwnerProfileModal;
