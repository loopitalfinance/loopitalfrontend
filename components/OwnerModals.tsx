import React, { useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  XMarkIcon,
  PhotoIcon,
  FlagIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { Project } from '../types';
import CreateProject from '../pages/CreateProject';

interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
}

export const CreateProjectModal: React.FC<CreateProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        <div className="flex justify-end p-4 absolute top-0 right-0 z-20">
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-white/80 backdrop-blur">
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1">
           <CreateProject 
              onBack={onClose} 
              onSuccess={(project: Project | undefined) => {
                if (project) onSubmit(project);
                onClose();
              }} 
           />
        </div>
      </div>
    </div>
  );
};

interface WithdrawProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectUuid: string, amount: number, reason: string, phase: number) => void;
  projects: Project[];
  withdrawals?: any[]; // Array of withdrawals to calculate remaining balance
}

export const WithdrawRequestModal: React.FC<WithdrawProps> = ({ isOpen, onClose, onSubmit, projects, withdrawals = [] }) => {
    const { user } = useApp();
    const navigate = useNavigate();
    const hasBankAccount = !!(user?.bankAccount?.accountNumber);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const fundedProjects = projects.filter(p => p.status === 'funded');
    const selectedProject = projects.find(p => p.uuid === selectedProjectId);
    const selectedProjectUuid = selectedProject?.uuid ? String(selectedProject.uuid) : '';
    const selectedProjectIdValue = selectedProject?.id ? String(selectedProject.id) : '';

    const matchesSelectedProject = (w: any) => {
        const key =
            w?.projectUuid ??
            w?.project_uuid ??
            w?.project ??
            w?.projectId ??
            w?.project_id;
        if (key === undefined || key === null) return false;
        const keyStr = String(key);
        return (selectedProjectUuid && keyStr === selectedProjectUuid) || (selectedProjectIdValue && keyStr === selectedProjectIdValue);
    };
    
    // Calculate available balance for the selected project
    const calculateAvailableBalance = () => {
        if (!selectedProject) return 0;

        // Use backend-calculated balance if available
        if (selectedProject.availableBalance !== undefined) {
            return Number(selectedProject.availableBalance);
        }
        
        const raised = Number(selectedProject.raisedAmount) || 0;
        const netAfterFee = raised * 0.98;
        
        // If amountReleased is available (from backend), use it for approved withdrawals
        if (selectedProject.amountReleased !== undefined) {
             const released = Number(selectedProject.amountReleased) || 0;
             
             // Sum of PENDING withdrawals only (since approved are in amountReleased)
             const pendingWithdrawals = withdrawals
                .filter(w => matchesSelectedProject(w) && String(w.status) === 'pending')
                .reduce((sum, w) => sum + Number(w.amount), 0);
                
             return Math.max(0, netAfterFee - released - pendingWithdrawals);
        }
        
        // Fallback if amountReleased is missing
        const projectWithdrawals = withdrawals
            .filter(w => matchesSelectedProject(w) && (String(w.status) === 'pending' || String(w.status) === 'approved'))
            .reduce((sum, w) => sum + Number(w.amount), 0);
            
        return Math.max(0, netAfterFee - projectWithdrawals);
    };

    const availableBalance = calculateAvailableBalance();
    const hasPendingRequest = !!selectedProject && withdrawals.some(w => matchesSelectedProject(w) && String(w.status) === 'pending');

    const handleSubmit = () => {
        if (!selectedProjectId || !amount || !selectedProject) return;
        if (selectedProject.status !== 'funded') return;
        if (hasPendingRequest) return;
        const numericAmount = parseFloat(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) return;
        if (numericAmount > availableBalance) return;
        const phase = selectedProject.currentPhase || 1;
        if (!selectedProject.uuid) return;
        onSubmit(selectedProject.uuid, numericAmount, reason, phase);
        onClose();
        setAmount('');
        setReason('');
        setSelectedProjectId('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-inter">
            <div className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Main Modal Card - Compact Dark Green Theme */}
            <div className="bg-[#022c22] w-full max-w-lg md:max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up flex flex-col border border-[#064e3b] max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 md:p-6 border-b border-[#064e3b] bg-[#022c22] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00DC82]/10 flex items-center justify-center text-[#00DC82]">
                            <ArrowUpTrayIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Request Withdrawal</h3>
                            <p className="text-[10px] text-emerald-100/60">Withdraw funds to your account</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full transition-colors group">
                        <XMarkIcon className="w-5 h-5 text-emerald-100/40 group-hover:text-white" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-5 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {!hasBankAccount ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <FlagIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-400">No Bank Account Linked</h4>
                                <p className="text-xs text-red-300/80 mt-1">Please add a bank account in your profile settings before requesting a withdrawal.</p>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/profile');
                                    }}
                                    className="text-xs font-bold text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg mt-3 inline-block transition-colors"
                                >
                                    Go to Settings
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bank Account Info */}
                                <div className="p-4 bg-[#064e3b]/30 border border-[#064e3b] rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-0.5">Withdraw to</p>
                                        <p className="text-sm font-bold text-white">{user?.bankAccount?.bankName}</p>
                                        <p className="text-xs text-emerald-100/70 font-mono">{user?.bankAccount?.accountNumber}</p>
                                        <p className="text-[10px] text-emerald-100/50 mt-0.5">{user?.bankAccount?.accountName}</p>
                                    </div>
                                    <div className="p-2 bg-[#064e3b]/50 rounded-lg">
                                        <BuildingLibraryIcon className="w-5 h-5 text-[#00DC82]" />
                                    </div>
                                </div>

                                {/* Project Select */}
                                <div>
                                    <label className="block text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-1.5">Select Project</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedProjectId} 
                                            onChange={(e) => setSelectedProjectId(e.target.value)}
                                            className="w-full p-3 pl-3 pr-8 bg-[#064e3b]/30 border border-[#064e3b] rounded-xl focus:ring-2 focus:ring-[#00DC82] focus:border-transparent outline-none text-xs font-medium text-white appearance-none cursor-pointer transition-all hover:bg-[#064e3b]/50 placeholder-emerald-100/30 h-[74px] disabled:opacity-60 disabled:cursor-not-allowed"
                                            disabled={fundedProjects.length === 0}
                                        >
                                            <option value="" className="bg-[#022c22] text-slate-400">-- Select a funded project --</option>
                                            {fundedProjects.map(p => (
                                                <option key={p.id} value={p.uuid} className="bg-[#022c22] text-white">{p.title}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-100/40">
                                            <ChevronRightIcon className="w-3 h-3 rotate-90" />
                                        </div>
                                    </div>
                                    {fundedProjects.length === 0 && (
                                        <p className="mt-2 text-[10px] text-emerald-100/50">
                                            No funded projects available for withdrawal.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {selectedProject && (
                                <div className="animate-fade-in space-y-6">
                                    {/* Balance Card */}
                                    <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] p-5 rounded-xl border border-[#064e3b] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-[#00DC82]/20 blur-xl group-hover:bg-[#00DC82]/30 transition-all"></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-emerald-200/70 uppercase tracking-wider mb-0.5">Available Balance</p>
                                                        <p className="text-3xl font-display font-bold text-white tracking-tight">₦{availableBalance.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-100/80 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                                                            <CheckCircleIcon className="w-3 h-3 text-[#00DC82]" />
                                                            <span>Phase {selectedProject.currentPhase || 1} {selectedProject.totalPhases ? `/ ${selectedProject.totalPhases}` : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Ledger Breakdown */}
                                                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px]">
                                                    <div className="text-emerald-100/60">
                                                        Raised (Net): <span className="text-white">₦{(Number(selectedProject.raisedAmount || 0) * 0.98).toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-emerald-100/60">
                                                        Released: <span className="text-white">₦{Number(selectedProject.amountReleased || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {hasPendingRequest && (
                                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                                            <ClockIcon className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-amber-200">Pending request exists</h4>
                                                <p className="text-xs text-amber-100/70 mt-1">You already have a pending withdrawal request for this project.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Amount Input */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-1.5">Withdrawal Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-100/40 font-bold text-sm">₦</span>
                                                <input 
                                                    type="number" 
                                                    value={amount} 
                                                    onChange={(e) => setAmount(e.target.value)} 
                                                    className="w-full p-3 pl-7 bg-[#064e3b]/30 border border-[#064e3b] rounded-xl focus:ring-2 focus:ring-[#00DC82] focus:border-transparent outline-none text-base font-bold font-display text-white placeholder:text-emerald-100/20 transition-all"
                                                    placeholder="0.00"
                                                    max={availableBalance}
                                                />
                                            </div>
                                        </div>

                                        {/* Reason Input */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-emerald-100/60 uppercase tracking-wider mb-1.5">Reason for Withdrawal</label>
                                            <textarea 
                                                value={reason} 
                                                onChange={(e) => setReason(e.target.value)} 
                                                className="w-full p-3 bg-[#064e3b]/30 border border-[#064e3b] rounded-xl focus:ring-2 focus:ring-[#00DC82] focus:border-transparent outline-none text-xs font-medium text-white h-[50px] resize-none transition-all placeholder:text-emerald-100/20"
                                                placeholder="Describe clearly..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 md:p-6 border-t border-[#064e3b] bg-[#022c22] flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2.5 text-emerald-100/60 font-bold text-xs hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={
                            !selectedProjectId ||
                            !amount ||
                            !hasBankAccount ||
                            !selectedProject ||
                            selectedProject.status !== 'funded' ||
                            hasPendingRequest ||
                            !Number.isFinite(parseFloat(amount)) ||
                            parseFloat(amount) <= 0 ||
                            parseFloat(amount) > availableBalance
                        }
                        className="px-6 py-2.5 bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#022c22] font-bold rounded-xl text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00DC82]/20 flex items-center gap-2"
                    >
                        <span>Submit</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ManageProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ManageProjectModal: React.FC<ManageProps> = ({ isOpen, onClose, project }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'gallery'>('overview');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // Milestone State
    const [milestone, setMilestone] = useState<{ title: string; description: string; date: string; proof: File | null }>({ title: '', description: '', date: '', proof: null });
    
    // Gallery State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');

    if (!isOpen || !project) return null;

    const clearMessages = () => {
        setSuccessMsg('');
        setErrorMsg('');
    };

    const handleMilestoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearMessages();
        try {
            const formData = new FormData();
            formData.append('title', milestone.title);
            formData.append('description', milestone.description);
            formData.append('date', milestone.date);
            if (milestone.proof) formData.append('proof_document', milestone.proof);
            
            await api.addProjectMilestone(project.id, formData);
            setSuccessMsg('Milestone added successfully');
            setMilestone({ title: '', description: '', date: '', proof: null });
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to add milestone');
        } finally {
            setLoading(false);
        }
    };

    const handleImageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return;
        setLoading(true);
        clearMessages();
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('caption', caption);
            
            await api.uploadProjectImage(project.id, formData);
            setSuccessMsg('Image uploaded to gallery');
            setImageFile(null);
            setCaption('');
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab; label: string; icon: any }) => {
        const isActive = activeTab === id;
        return (
            <button
                type="button"
                onClick={() => { setActiveTab(id); clearMessages(); }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                    isActive
                        ? 'bg-white/15 text-white border-white/20 shadow-lg shadow-black/10'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
                <Icon className="w-4 h-4" />
                {label}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-inter">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="w-full h-[100dvh] sm:h-[85vh] max-w-6xl bg-white dark:bg-[#0f172a] sm:rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up flex flex-col border border-slate-100 dark:border-slate-700">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0A192F] to-[#022c22] px-5 sm:px-8 py-5 sm:py-6">
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#00DC82]/10 blur-3xl"></div>

                    <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Manage Project</div>
                            <h3 className="mt-1 text-lg sm:text-2xl font-display font-bold text-white truncate">{project.title}</h3>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    project.status === 'active'
                                        ? 'bg-emerald-500/15 text-emerald-100 border-emerald-500/25'
                                        : 'bg-white/10 text-white/80 border-white/15'
                                }`}>
                                    {project.status}
                                </span>
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/15">
                                    ₦{Number(project.raisedAmount || 0).toLocaleString()} raised
                                </span>
                            </div>
                        </div>

                        <button onClick={onClose} className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative z-10 mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <TabButton id="overview" label="Overview" icon={ChartBarIcon} />
                        <TabButton id="milestones" label="Milestones" icon={FlagIcon} />
                        <TabButton id="gallery" label="Gallery" icon={PhotoIcon} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-white dark:bg-[#0f172a]">
                    {(successMsg || errorMsg) && (
                        <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-sm font-medium animate-fade-in ${
                            successMsg
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${successMsg ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            {successMsg || errorMsg}
                        </div>
                    )}

                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-500/20">
                                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Raised</p>
                                        <p className="text-xl md:text-2xl font-mono font-bold text-emerald-800 dark:text-emerald-400">₦{project.raisedAmount.toLocaleString()}</p>
                                        <div className="w-full bg-emerald-200/20 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (project.raisedAmount / project.targetAmount) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Target</p>
                                        <p className="text-xl md:text-2xl font-mono font-bold text-slate-700 dark:text-slate-200">₦{project.targetAmount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400 mt-3">Goal Amount</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800/20 shadow-sm">
                                    <h4 className="font-bold text-[#0A192F] dark:text-white mb-4 flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                        Quick Actions
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => setActiveTab('milestones')}
                                            className="p-3 text-left rounded-xl transition-colors border group bg-slate-50 hover:bg-slate-100 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                                        >
                                            <FlagIcon className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                                            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Add Milestone</p>
                                            <p className="text-xs text-slate-400">Update progress</p>
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('gallery')}
                                            className="p-3 text-left rounded-xl transition-colors border group bg-slate-50 hover:bg-slate-100 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                                        >
                                            <PhotoIcon className="w-6 h-6 text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                                            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Upload Photos</p>
                                            <p className="text-xs text-slate-400">Showcase work</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'milestones' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-500/20 p-6 rounded-2xl border relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 mb-1">Add New Milestone</h4>
                                        <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mb-4">Milestones are critical for unlocking your next funding phase.</p>
                                        
                                        <form onSubmit={handleMilestoneSubmit} className="space-y-4 bg-white/50 border-indigo-100 dark:bg-slate-900/50 dark:border-indigo-500/20 backdrop-blur-sm p-4 rounded-xl border">
                                            <div>
                                                <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Title</label>
                                                <input 
                                                    required 
                                                    value={milestone.title}
                                                    onChange={e => setMilestone({...milestone, title: e.target.value})}
                                                    className="w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm bg-white border-indigo-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                                    placeholder="e.g. Phase 1 Complete"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Date</label>
                                                    <input 
                                                        type="date"
                                                        required 
                                                        value={milestone.date}
                                                        onChange={e => setMilestone({...milestone, date: e.target.value})}
                                                        className="w-full mt-1 p-2 rounded-lg border border-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Proof</label>
                                                    <input 
                                                        type="file"
                                                        onChange={e => setMilestone({...milestone, proof: e.target.files ? e.target.files[0] : null})}
                                                        className="w-full mt-1 text-xs dark:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Description</label>
                                                <textarea 
                                                    required 
                                                    value={milestone.description}
                                                    onChange={e => setMilestone({...milestone, description: e.target.value})}
                                                    className="w-full mt-1 p-2 rounded-lg border border-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm h-20 resize-none"
                                                    placeholder="Details about this milestone..."
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/20"
                                            >
                                                {loading ? 'Saving...' : 'Publish Milestone'}
                                            </button>
                                        </form>
                                    </div>
                                    <FlagIcon className="absolute -right-6 -bottom-6 w-40 h-40 text-indigo-100 rotate-12" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 relative overflow-hidden dark:bg-pink-900/10 dark:border-pink-500/20">
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-pink-900 dark:text-pink-400 mb-1">Upload to Gallery</h4>
                                        <p className="text-sm text-pink-700/80 dark:text-pink-300/80 mb-4">Share visual progress with your investors.</p>
                                        
                                        <form onSubmit={handleImageSubmit} className="space-y-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-pink-100 dark:bg-slate-900/50 dark:border-pink-500/20">
                                            <div className="border-2 border-dashed border-pink-200 dark:border-pink-500/30 rounded-xl p-6 text-center hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
                                                <input 
                                                    type="file" 
                                                    required
                                                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <PhotoIcon className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                                                <p className="text-sm font-bold text-pink-800 dark:text-pink-300">
                                                    {imageFile ? imageFile.name : 'Click to select image'}
                                                </p>
                                                <p className="text-xs text-pink-500">JPG, PNG up to 5MB</p>
                                            </div>
                                            
                                            <div>
                                                <label className="text-xs font-bold text-pink-900 dark:text-pink-300 uppercase">Caption</label>
                                                <input 
                                                    value={caption}
                                                    onChange={e => setCaption(e.target.value)}
                                                    className="w-full mt-1 p-2 rounded-lg border border-pink-100 dark:border-pink-500/30 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
                                                    placeholder="Describe this image..."
                                                />
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={loading || !imageFile}
                                                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-sm transition-colors shadow-lg shadow-pink-600/20 disabled:opacity-50"
                                            >
                                                {loading ? 'Uploading...' : 'Upload Image'}
                                            </button>
                                        </form>
                                    </div>
                                    <PhotoIcon className="absolute -right-6 -bottom-6 w-40 h-40 text-pink-100 rotate-12" />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};
