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
        email: user.email
      };
      
      login(mappedUser);
      navigate(mappedUser.role === 'ProjectOwner' ? '/creator/dashboard' : '/dashboard');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-8 px-4 sm:px-0">
          <div>
            <div className="text-2xl font-display font-bold text-[#0A192F]">
              Loopital<span className="text-[#00DC82]">.</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </div>
          </div>
          <div className="inline-flex rounded-xl bg-white border border-slate-200 shadow-sm p-1">
            <button
              type="button"
              onClick={() => navigate('/auth/login', { replace: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isLogin ? 'bg-[#0A192F] text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth/register', { replace: true })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                !isLogin ? 'bg-[#0A192F] text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-900/5 sm:rounded-3xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-[#0A192F] tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started for free'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start your investment journey in minutes.'}
            </p>
          </div>

          {!isLogin && (
            <div className="mb-6 flex p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button 
                type="button"
                onClick={() => setRole('Investor')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === 'Investor' ? 'bg-white text-[#0A192F] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" /> Investor
              </button>
              <button 
                type="button"
                onClick={() => setRole('ProjectOwner')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === 'ProjectOwner' ? 'bg-white text-[#0A192F] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BriefcaseIcon className="w-3.5 h-3.5" /> Business
              </button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] text-sm"
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
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] text-sm"
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
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] text-sm"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Email address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1.5">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/20 focus:border-[#00DC82] text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign in' : 'Create account'} 
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;