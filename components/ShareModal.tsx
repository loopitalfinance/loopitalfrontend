import React, { useMemo, useState } from 'react';
import { XMarkIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectImage?: string;
  projectUuid?: string;
}

const ShareModal: React.FC<Props> = ({ isOpen, onClose, projectTitle, projectImage, projectUuid }) => {
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const currentUrl = window.location.href;
    if (projectUuid) {
      if (currentUrl.includes(projectUuid)) return currentUrl;
      return `${window.location.origin}/projects/${projectUuid}`;
    }
    return currentUrl;
  }, [projectUuid]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(projectTitle);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
        <div className="relative">
          <div className="h-40 w-full overflow-hidden bg-slate-100">
            <img
              src={projectImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'}
              alt={projectTitle}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 rounded-full p-2 shadow-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-slate-900 mb-2">
            <ShareIcon className="w-5 h-5 text-[#00DC82]" />
            <h3 className="text-lg font-bold">Share Project</h3>
          </div>
          <p className="text-sm text-slate-500 mb-5">{projectTitle}</p>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-4">
            <LinkIcon className="w-5 h-5 text-slate-400" />
            <input
              value={shareUrl}
              readOnly
              className="w-full bg-transparent text-sm text-slate-600 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#00DC82] text-[#0A192F] hover:bg-[#00c474] transition-all"
            >
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#00DC82] hover:text-[#0A192F] transition-all"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#00DC82] hover:text-[#0A192F] transition-all"
            >
              X (Twitter)
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#00DC82] hover:text-[#0A192F] transition-all"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-[#00DC82] hover:text-[#0A192F] transition-all"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
