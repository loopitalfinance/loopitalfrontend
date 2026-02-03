
import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { toast } from 'react-hot-toast';
import { 
  XMarkIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { Project, User } from '../types';
import { api } from '../services/api';

interface TopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, newBalance?: number) => void;
  email: string;
}

interface WithdrawProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, newBalance?: number) => void;
  currentBalance: number;
  user?: User;
}

interface InvestProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  project: Project;
  userBalance: number;
}

// Reusable Amount Input Component
const AmountInput = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => (
  <div className="mb-6">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">₦</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-3xl font-bold text-[#0A192F] focus:outline-none focus:border-[#00DC82] focus:bg-white transition-all placeholder:text-slate-200"
        placeholder="0.00"
        autoFocus
      />
    </div>
  </div>
);

export const TopUpModal: React.FC<TopUpProps> = ({ isOpen, onClose, onSuccess, email }) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [newBalance, setNewBalance] = useState<number | null>(null);
  
  // Use a stable reference per session or generate only when needed
  // Since we need to pass config to usePaystackPayment, we should memoize it
  const reference = React.useMemo(() => (new Date()).getTime().toString(), [isOpen]);

  const config = {
      reference: reference,
      email: email,
      amount: parseFloat(amount || '0') * 100, // Paystack is in kobo
      publicKey: 'pk_test_13449920aaa915f243a95926ec029dfe609dbbee',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccessPayment = async (reference: any) => {
      console.log("Paystack Success Callback:", reference);
      setStep('processing');
      try {
          const data = await api.verifyDeposit(reference.reference);
          setNewBalance(data.newBalance);
          setStep('success');
          toast.success(data.message || 'Deposit successful');
      } catch (error: any) {
          console.error("Deposit Verification Error:", error);
          toast.error(error.message || 'Deposit verification failed');
          setStep('input');
      }
  };

  const onClosePayment = () => {
      toast('Payment cancelled');
  };

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setStep('input');
      setNewBalance(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProcess = () => {
    if (!amount || parseFloat(amount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
    }
    initializePayment({ onSuccess: onSuccessPayment, onClose: onClosePayment });
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess(parseFloat(amount), newBalance || undefined);
      // Reload page to ensure balance is reflected from backend
      window.location.reload();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0A192F]/60 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-[#0A192F]">Fund Wallet</h3>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {step === 'input' && (
            <>
              <AmountInput value={amount} onChange={setAmount} label="Amount to Deposit" />
              
              <div className="mb-8">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                   <div className="p-2 bg-white rounded-full shadow-sm">
                      <CreditCardIcon className="w-6 h-6 text-[#00DC82]" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-[#0A192F]">Paystack Secure Payment</p>
                      <p className="text-xs text-slate-500">Cards, USSD, Bank Transfer</p>
                   </div>
                   <CheckCircleIcon className="w-6 h-6 text-[#00DC82] ml-auto" />
                </div>
              </div>

              <button 
                onClick={handleProcess}
                disabled={!amount}
                className="w-full py-4 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                Pay ₦{amount ? parseFloat(amount).toLocaleString() : '0.00'}
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-[#00DC82] rounded-full border-t-transparent animate-spin"></div>
                 <BanknotesIcon className="absolute inset-0 m-auto w-8 h-8 text-[#0A192F]" />
              </div>
              <h4 className="text-xl font-bold text-[#0A192F] mb-2">Processing Payment</h4>
              <p className="text-slate-500 text-sm">Securely communicating with gateway...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-10 h-10 text-[#00DC82]" />
              </div>
              <h4 className="text-2xl font-bold text-[#0A192F] mb-2">Deposit Successful!</h4>
              <p className="text-slate-500 mb-8">
                <span className="font-bold text-[#0A192F]">₦{parseFloat(amount).toLocaleString()}</span> has been added to your wallet.
              </p>
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-[#00DC82] hover:bg-[#00c474] text-[#0A192F] font-bold rounded-xl shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const WithdrawModal: React.FC<WithdrawProps> = ({ isOpen, onClose, onSuccess, currentBalance, user }) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'link' | 'input' | 'processing' | 'success'>('input');
  const [newBalance, setNewBalance] = useState<number | null>(null);

  // Bank Linking State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNewBalance(null);
      
      // Check if user has bank account
      if (user && !user.bankAccount) {
         setStep('link');
      } else {
         setStep('input');
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleLinkBank = async () => {
      if (!bankName || !accountNumber || !accountName) {
          toast.error("Please fill in all bank details");
          return;
      }
      setIsLinking(true);
      try {
          // Pass empty string for bankCode since it's not captured here
          await api.linkBank(bankName, accountNumber, accountName, '');
          toast.success("Bank account linked successfully");
          // Ideally update user object here, but for now proceed to input
          setStep('input');
          // Reload page to refresh user data context if possible, or just proceed
          // We can assume it's linked now for the session
      } catch (e: any) {
          toast.error(e.message || "Failed to link bank account");
      } finally {
          setIsLinking(false);
      }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance) return;
    
    setStep('processing');
    try {
        const data = await api.withdraw(parseFloat(amount));
        setNewBalance(data.newBalance);
        setStep('success');
        toast.success(data.message || 'Withdrawal request submitted');
    } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Withdrawal failed');
        setStep('input');
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess(parseFloat(amount), newBalance || undefined);
      window.location.reload();
    }
    onClose();
  };

  const handleMax = () => {
    setAmount(currentBalance.toString());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0A192F]/60 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-[#0A192F]">
            {step === 'link' ? 'Link Bank Account' : 'Withdraw Funds'}
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {step === 'link' && (
             <div className="space-y-4">
                 <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm mb-4">
                    Please link a bank account to receive withdrawals.
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                    <input 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        placeholder="e.g. GTBank"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Number</label>
                    <input 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        placeholder="0123456789"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Name</label>
                    <input 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        placeholder="John Doe"
                        value={accountName}
                        onChange={e => setAccountName(e.target.value)}
                    />
                 </div>
                 <button 
                    onClick={handleLinkBank}
                    disabled={isLinking}
                    className="w-full py-4 bg-[#0A192F] text-white font-bold rounded-xl mt-4 hover:bg-slate-800 transition-all"
                 >
                    {isLinking ? 'Linking...' : 'Link Account'}
                 </button>
             </div>
          )}

          {step === 'input' && (
            <>
              {/* Show linked account info if available */}
              {user?.bankAccount && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Withdraw to</p>
                          <p className="font-bold text-[#0A192F]">{user.bankAccount.bankName}</p>
                          <p className="text-sm text-slate-500">{user.bankAccount.accountNumber}</p>
                      </div>
                      <BuildingLibraryIcon className="w-6 h-6 text-slate-300" />
                  </div>
              )}

              <div className="flex justify-between items-end mb-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
                 <button onClick={handleMax} className="text-xs font-bold text-[#00DC82] hover:underline">
                    Max: ₦{currentBalance.toLocaleString()}
                 </button>
              </div>
              
              <div className="relative mb-8">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">₦</span>
                 <input
                   type="number"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className={`w-full pl-10 pr-4 py-4 bg-slate-50 border-2 rounded-xl text-3xl font-bold text-[#0A192F] focus:outline-none focus:bg-white transition-all placeholder:text-slate-200 ${parseFloat(amount) > currentBalance ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-[#00DC82]'}`}
                   placeholder="0.00"
                 />
                 {parseFloat(amount) > currentBalance && (
                    <p className="text-red-500 text-xs mt-1 absolute -bottom-5 font-bold">Insufficient balance</p>
                 )}
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                className="w-full py-4 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                Confirm Withdrawal
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-[#00DC82] rounded-full border-t-transparent animate-spin"></div>
                 <ArrowPathIcon className="absolute inset-0 m-auto w-8 h-8 text-[#0A192F]" />
              </div>
              <h4 className="text-xl font-bold text-[#0A192F] mb-2">Processing Withdrawal</h4>
              <p className="text-slate-500 text-sm">Please wait...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-10 h-10 text-[#00DC82]" />
              </div>
              <h4 className="text-2xl font-bold text-[#0A192F] mb-2">Request Submitted!</h4>
              <p className="text-slate-500 mb-8">
                Your withdrawal of <span className="font-bold text-[#0A192F]">₦{parseFloat(amount).toLocaleString()}</span> is pending processing.
              </p>
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-[#00DC82] hover:bg-[#00c474] text-[#0A192F] font-bold rounded-xl shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const InvestModal: React.FC<InvestProps> = ({ isOpen, onClose, onConfirm, project, userBalance }) => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
    const minAmount = project.minInvestment;

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setStep('input');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const parsedAmount = parseFloat(amount) || 0;
    const isValid = parsedAmount >= minAmount && parsedAmount <= userBalance;
    const projectedReturn = parsedAmount * (1 + project.roi / 100);
    const profit = projectedReturn - parsedAmount;

    const handleInvest = async () => {
        if (!isValid) return;
        setStep('processing');
        try {
            await api.investInProject(project.id, parsedAmount);
            setStep('success');
            // Allow user to see success message briefly before callback
            setTimeout(() => {
               onConfirm(parsedAmount);
            }, 1500);
        } catch (error: any) {
            console.error('Investment Error:', error);
            // Parse error message if it's a JSON string
            let msg = error.message;
            try {
                const parsed = JSON.parse(msg);
                if (parsed.error) msg = parsed.error;
                else if (parsed.detail) msg = parsed.detail;
            } catch (e) {
                // Not JSON, use as is
            }
            toast.error(msg || 'Investment failed');
            setStep('input');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up border border-slate-100">
                {step === 'input' && (
                  <>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Invest In</p>
                            <h3 className="text-lg font-bold text-[#0A192F] line-clamp-1">{project.title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm">
                            <XMarkIcon className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-end mb-2">
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Investment Amount</label>
                             <p className="text-xs font-bold text-[#00DC82]">Wallet: ₦{userBalance.toLocaleString()}</p>
                        </div>
                        
                        <div className="relative mb-2">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-300">₦</span>
                             <input
                               type="number"
                               value={amount}
                               onChange={(e) => setAmount(e.target.value)}
                               className={`w-full pl-10 pr-4 py-4 bg-slate-50 border-2 rounded-xl text-3xl font-bold text-[#0A192F] focus:outline-none focus:bg-white transition-all placeholder:text-slate-200 ${!isValid && amount ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-[#00DC82]'}`}
                               placeholder="0.00"
                               autoFocus
                             />
                        </div>
                        <div className="flex justify-between text-xs font-medium mb-6">
                             <span className={`${parsedAmount < minAmount && amount ? 'text-red-500 font-bold' : 'text-slate-400'}`}>Min: ₦{minAmount.toLocaleString()}</span>
                             <span className={`${parsedAmount > userBalance ? 'text-red-500 font-bold' : 'text-slate-400'}`}>Max: ₦{userBalance.toLocaleString()}</span>
                        </div>

                        {/* ROI Preview */}
                        <div className="bg-[#0A192F] rounded-2xl p-5 text-white mb-8 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#00DC82]/10 rounded-full -mr-10 -mt-10"></div>
                           <div className="relative z-10 flex justify-between items-center">
                              <div>
                                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Est. Returns ({project.roi}%)</p>
                                 <p className="text-2xl font-bold font-mono text-[#00DC82]">₦{profit > 0 ? profit.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Payout</p>
                                 <p className="text-xl font-bold font-mono text-white">₦{projectedReturn > 0 ? projectedReturn.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3 mb-8">
                             <div className="flex items-center gap-3 text-xs text-slate-500">
                                <ShieldCheckIcon className="w-4 h-4 text-[#00DC82]" />
                                <span>Funds secured in escrow until funding goal is met.</span>
                             </div>
                             <div className="flex items-center gap-3 text-xs text-slate-500">
                                <LockClosedIcon className="w-4 h-4 text-[#00DC82]" />
                                <span>Transaction encrypted via 256-bit SSL.</span>
                             </div>
                        </div>

                        <button 
                            onClick={handleInvest}
                            disabled={!isValid}
                            className="w-full py-4 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Confirm Investment
                        </button>
                    </div>
                  </>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-16 px-8">
                        <div className="relative w-24 h-24 mb-8">
                             <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
                             <div className="absolute inset-0 border-[6px] border-[#00DC82] rounded-full border-t-transparent animate-spin"></div>
                             <ArrowTrendingUpIcon className="absolute inset-0 m-auto w-8 h-8 text-[#0A192F]" />
                        </div>
                        <h4 className="text-2xl font-bold text-[#0A192F] mb-2">Processing Investment</h4>
                        <p className="text-slate-500 text-sm text-center">Allocating equity and generating contract...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-12 px-8 text-center animate-fade-in bg-white">
                         <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                            <CheckCircleIcon className="w-12 h-12 text-[#00DC82]" />
                         </div>
                         <h4 className="text-3xl font-bold text-[#0A192F] mb-2">You're an Investor!</h4>
                         <p className="text-slate-500 mb-2">You have successfully invested</p>
                         <p className="text-2xl font-bold text-[#00DC82] font-mono mb-8">₦{parsedAmount.toLocaleString()}</p>
                         <p className="text-xs text-slate-400">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
