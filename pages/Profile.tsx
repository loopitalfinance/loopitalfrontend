import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { ShieldCheckIcon, UserIcon, LockClosedIcon, CreditCardIcon, BellIcon, ChevronRightIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Bank = {
  name: string;
  code: string;
};

const Profile: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('account');
  const displayName = useMemo(() => user?.name || user?.email || 'Account', [user]);
  const [firstName, lastName] = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean);
    return [parts[0] || '', parts.slice(1).join(' ') || ''];
  }, [displayName]);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBankSaved, setIsBankSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setBankName(user.bankAccount?.bankName || '');
    setAccountNumber(user.bankAccount?.accountNumber || '');
    setAccountName(user.bankAccount?.accountName || '');
    setIsBankSaved(!!user.bankAccount?.accountNumber);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    api
      .getBanks()
      .then((data) => {
        if (!isMounted) return;
        setBanks(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setBanks([]);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  const handleVerifyAccount = async () => {
    if (!accountNumber || !bankCode) return;
    if (accountNumber.trim().length !== 10) {
      toast.error('Enter a 10-digit account number');
      return;
    }

    setIsVerifying(true);
    try {
      const data: any = await api.resolveAccount(accountNumber.trim(), bankCode);
      const resolvedAccountName = data?.accountName || data?.account_name;
      if (!resolvedAccountName) {
        toast.error('Could not verify account details');
        return;
      }
      setAccountName(resolvedAccountName);
      toast.success('Account verified');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to verify account');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLinkBank = async () => {
      setIsLinkingBank(true);
      try {
          await api.linkBank(bankName, accountNumber, accountName, bankCode);
          toast.success('Bank account linked successfully');
          setIsBankSaved(true);
      } catch (error) {
          toast.error('Failed to link bank account');
      } finally {
          setIsLinkingBank(false);
      }
  };

  const effectiveBankName = bankName || user.bankAccount?.bankName || '';
  const effectiveAccountName = accountName || user.bankAccount?.accountName || '';
  const effectiveAccountNumber = accountNumber || user.bankAccount?.accountNumber || '';
  const maskedAccountNumber = effectiveAccountNumber
    ? `${effectiveAccountNumber.slice(0, 2)}••••••${effectiveAccountNumber.slice(-2)}`
    : '';

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-20 font-inter">
      <header className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-[#0A192F]">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information and security preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {[
            { id: 'account', label: 'My Profile', icon: UserIcon },
            { id: 'kyc', label: 'Verification', icon: ShieldCheckIcon },
            { id: 'security', label: 'Security', icon: LockClosedIcon },
            { id: 'bank', label: 'Bank Details', icon: CreditCardIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-[#0A192F] shadow-sm border border-slate-100 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#00DC82]' : 'text-slate-400'}`} />
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRightIcon className="w-3 h-3 text-slate-300" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-fade-in">
          {activeTab === 'account' && (
              <>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="w-20 h-20 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-3xl font-bold">
                  {displayName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A192F]">{displayName}</h3>
                  <p className="text-slate-500 text-sm">{user.role}</p>
                  <button className="text-xs text-[#00DC82] font-bold mt-2 hover:underline">Change Picture</button>
                </div>
              </div>
              <div className="space-y-6 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-[#0A192F] mb-2">First Name</label>
                     <input type="text" defaultValue={firstName} className="w-full p-2.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#0A192F] mb-2">Last Name</label>
                     <input type="text" defaultValue={lastName} className="w-full p-2.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" />
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A192F] mb-2">Email Address</label>
                  <input type="email" defaultValue={user.email || 'user@example.com'} className="w-full p-2.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" />
                </div>
                <div className="pt-4">
                  <button className="px-6 py-2.5 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm shadow-lg shadow-slate-900/10">
                    Save Changes
                  </button>
                </div>
              </div>
              </>
          )}

          {activeTab === 'kyc' && (
             <>
              <h3 className="text-lg font-bold text-[#0A192F] mb-6">Identity Verification</h3>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-4 mb-8">
                <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Account Verified</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">Your identity has been verified. You can now invest up to ₦50,000,000 without limits.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A192F] text-sm">BVN Verification</h4>
                      <p className="text-xs text-slate-500">Bank Verification Number</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wide">Verified</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <CreditCardIcon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A192F] text-sm">NIN Verification</h4>
                      <p className="text-xs text-slate-500">National Identity Number</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wide">Verified</span>
                </div>
              </div>
             </>
          )}
          
          {activeTab === 'security' && (
             <>
                <h3 className="text-lg font-bold text-[#0A192F] mb-6">Security Settings</h3>
                <div className="flex items-center justify-between p-5 border border-slate-100 rounded-xl mb-6">
                   <div>
                      <h4 className="font-bold text-[#0A192F] text-sm">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 mt-1">Secure your account with 2FA via SMS or Authenticator App.</p>
                   </div>
                   <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                       <div className="w-11 h-6 bg-slate-200 rounded-full shadow-inner"></div>
                       <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0"></div>
                   </div>
                </div>
                <div className="p-5 border border-red-100 bg-red-50/50 rounded-xl">
                   <h4 className="font-bold text-red-700 flex items-center gap-2 text-sm"><ExclamationTriangleIcon className="w-4 h-4"/> Danger Zone</h4>
                   <p className="text-xs text-red-600 mt-1 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                   <button className="text-xs font-bold text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 shadow-sm">Delete Account</button>
                </div>
             </>
          )}

          {activeTab === 'bank' && (
            <>
                <h3 className="text-lg font-bold text-[#0A192F] mb-6">Bank Account Details</h3>
                <p className="text-sm text-slate-500 mb-6">Link your bank account for withdrawals. Ensure the name matches your profile.</p>
                
                {isBankSaved ? (
                  <div className="max-w-xl">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] to-[#022c22]"></div>
                      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
                      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00DC82]/10 blur-3xl"></div>

                      <div className="relative z-10 p-6 md:p-8 text-white">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                              <LockClosedIcon className="h-3.5 w-3.5 text-[#00DC82]" />
                              Withdrawal Account
                            </div>
                            <p className="mt-3 text-2xl font-display font-bold tracking-tight">
                              {effectiveBankName || 'Bank Account'}
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                              This account is locked after saving for security.
                            </p>
                          </div>
                          <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Status</p>
                            <p className="text-xs font-bold text-[#00DC82] mt-0.5">Saved</p>
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Account Name</p>
                            <p className="mt-1 text-sm font-bold text-white truncate">{effectiveAccountName || '-'}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Account Number</p>
                            <p className="mt-1 text-sm font-mono font-bold text-white">{maskedAccountNumber || '-'}</p>
                          </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs text-white/70">
                              To change bank details, contact support.
                            </p>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00DC82]/10 px-3 py-1 text-[10px] font-bold text-[#00DC82] border border-[#00DC82]/20">
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                              Secured
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xl">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</p>
                          <h4 className="text-lg font-bold text-[#0A192F] mt-1">Select your bank</h4>
                          <p className="text-sm text-slate-500 mt-1">We’ll use this for withdrawals and payouts.</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-[#0A192F] flex items-center justify-center shadow-lg shadow-slate-900/10">
                          <CreditCardIcon className="h-6 w-6 text-[#00DC82]" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bank</label>
                          <select 
                            value={bankCode}
                            onChange={(e) => {
                              setBankCode(e.target.value);
                              setBankName(e.target.options[e.target.selectedIndex].text);
                              setAccountName('');
                            }}
                            className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" 
                          >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                              <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Account Number</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={accountNumber}
                              onChange={(e) => {
                                setAccountNumber(e.target.value);
                                setAccountName('');
                              }}
                              placeholder="0123456789"
                              className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" 
                            />
                            <button
                              onClick={handleVerifyAccount}
                              disabled={!accountNumber || !bankCode || isVerifying}
                              className="px-4 py-3 bg-[#0A192F] text-white font-bold rounded-2xl hover:bg-slate-800 text-xs disabled:opacity-50"
                            >
                              {isVerifying ? '...' : 'Verify'}
                            </button>
                          </div>
                        </div>

                        {accountName && (
                          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified Name</p>
                            <p className="text-sm font-bold text-emerald-900 mt-1">{accountName}</p>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Account Name</label>
                          <input 
                            type="text" 
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A192F] text-sm" 
                          />
                        </div>

                        <div className="pt-2">
                          <button 
                            onClick={handleLinkBank}
                            disabled={isLinkingBank || !bankCode || !accountNumber || !accountName}
                            className="w-full px-6 py-3 bg-[#0A192F] text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors text-sm shadow-lg shadow-slate-900/10 disabled:opacity-50"
                          >
                            {isLinkingBank ? 'Saving...' : 'Save Bank Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
