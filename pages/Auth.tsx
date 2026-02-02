import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowRightIcon, ArrowPathIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Auth: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'Investor' | 'ProjectOwner'>('Investor');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    setIsLogin(!location.pathname.endsWith('/register'));
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let user;
      if (isLogin) {
        user = await api.login(email, password);
      } else {
        user = await api.register(email, password, firstName, lastName, role, companyName);
      }

      const mappedUser: User = {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`.trim() || user.username,
        role: user.profile?.role || user.role || 'Investor',
        walletBalance: Number(user.profile?.walletBalance ?? user.profile?.balance ?? 0),
        companyName: user.profile?.companyName,
        email: user.email // Ensure email is passed if available
      };
      
      login(mappedUser);
      navigate(mappedUser.role === 'ProjectOwner' ? '/creator/dashboard' : '/dashboard');

    } catch (error: any) {
      alert((isLogin ? 'Login' : 'Registration') + ' failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-inter bg-slate-50">
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0A192F]">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -top-24 -right-24 h-[520px] w-[520px] bg-gradient-to-br from-[#00DC82]/25 via-white/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-28 -left-20 h-[520px] w-[520px] bg-gradient-to-tr from-teal-400/15 via-white/5 to-transparent rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-md px-12 text-left">
            <div className="mb-10">
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                Loopital<span className="text-[#00DC82]">.</span>
              </h1>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Secure access to vetted, high-yield opportunities across real assets and startups.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl shadow-black/20">
              <div className="text-xs font-bold uppercase tracking-wider text-white/60">Built for</div>
              <div className="mt-2 text-2xl font-bold text-white">
                {role === 'ProjectOwner' ? 'Founders & Operators' : 'Modern Investors'}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-white/70">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-white font-bold">Transparent</div>
                  <div className="mt-1 text-white/60">Clear terms & payout schedules.</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-white font-bold">Effortless</div>
                  <div className="mt-1 text-white/60">Invest, track, withdraw.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100"></div>
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-[#0A192F] to-[#022c22] opacity-[0.08]"></div>

          <div className="relative w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="lg:hidden">
                <div className="text-lg font-display font-bold text-[#0A192F]">
                  Loopital<span className="text-[#00DC82]">.</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {isLogin ? 'Sign in to continue' : 'Create your account'}
                </div>
              </div>
              <div className="hidden lg:block"></div>
              <div className="inline-flex rounded-2xl bg-white border border-slate-200 shadow-sm p-1">
                <button
                  type="button"
                  onClick={() => navigate('/auth/login', { replace: true })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isLogin ? 'bg-[#0A192F] text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth/register', { replace: true })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isLogin ? 'bg-[#0A192F] text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create account
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="text-left">
                  <h2 className="text-2xl font-display font-bold text-[#0A192F] tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    {isLogin ? 'Enter your details to access your dashboard.' : 'Set up your profile in under a minute.'}
                  </p>
                </div>

                {!isLogin && (
                  <div className="mt-6 flex p-1 bg-slate-100 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setRole('Investor')}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        role === 'Investor' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Investor
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('ProjectOwner')}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        role === 'ProjectOwner' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <BriefcaseIcon className="w-3.5 h-3.5" /> Business
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {!isLogin && (
                    <>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block text-xs font-bold text-[#0A192F] mb-1.5">First Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 focus:border-[#0A192F]/30 transition-all"
                              placeholder="John"
                            />
                          </div>
                        </div>
                        <div className="w-1/2">
                          <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Last Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 focus:border-[#0A192F]/30 transition-all"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                      </div>
                      {role === 'ProjectOwner' && (
                        <div>
                          <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Company Name</label>
                          <div className="relative">
                            <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 focus:border-[#0A192F]/30 transition-all"
                              placeholder="Tech Solutions Ltd."
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Email</label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 focus:border-[#0A192F]/30 transition-all"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Password</label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 focus:border-[#0A192F]/30 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-slate-900/10 text-sm font-bold text-white bg-[#0A192F] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F]/20 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="animate-spin h-5 w-5" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {isLogin ? 'Sign In' : 'Create Account'} <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => navigate(isLogin ? '/auth/register' : '/auth/login', { replace: true })}
                    className="text-[#00DC82] font-bold hover:underline"
                  >
                    {isLogin ? 'Create one' : 'Log in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
