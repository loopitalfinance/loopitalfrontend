import React, { useState } from 'react';
import { Project } from '../../types';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ShareModal: React.FC<Props> = ({ isOpen, onClose, project }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const projectUrl = typeof window !== 'undefined' ? window.location.href : `https://loopital.com/projects/${project.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { 
      name: 'WhatsApp', 
      icon: (props: any) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${project.title} on Loopital! ${projectUrl}`)}`,
      color: 'bg-[#25D366] text-white'
    },
    { 
      name: 'Twitter', 
      icon: (props: any) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.title} on Loopital!`)}&url=${encodeURIComponent(projectUrl)}`,
      color: 'bg-black text-white'
    },
    { 
      name: 'LinkedIn', 
      icon: (props: any) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`,
      color: 'bg-[#0077b5] text-white'
    },
    { 
      name: 'Email', 
      icon: EnvelopeIcon,
      url: `mailto:?subject=${encodeURIComponent(`Investment Opportunity: ${project.title}`)}&body=${encodeURIComponent(`I found this interesting project on Loopital: ${project.description}\n\nCheck it out here: ${projectUrl}`)}`,
      color: 'bg-slate-600 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
       <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Share Project</h3>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-5 h-5" />
             </button>
          </div>
          
          <div className="p-6">
             <div className="flex gap-4 justify-center mb-8">
                {shareLinks.map((link) => (
                   <a 
                     key={link.name}
                     href={link.url}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color} hover:scale-110 transition-transform shadow-md group`}
                     title={`Share on ${link.name}`}
                   >
                      <link.icon className="w-5 h-5" />
                   </a>
                ))}
             </div>

             <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Project Link</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                   <input 
                     readOnly 
                     value={projectUrl} 
                     className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-600 outline-none truncate"
                   />
                   <button 
                     onClick={handleCopy}
                     className={`px-4 py-2 text-xs font-bold transition-all border-l border-slate-200 ${
                        copied 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-white hover:bg-slate-50 text-slate-700'
                     }`}
                   >
                     {copied ? 'Copied!' : 'Copy'}
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ShareModal;
