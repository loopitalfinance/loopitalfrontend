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
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button
            onClick={() => navigate(isLogin ? '/register' : '/login')}
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            {isLogin ? 'register a new account' : 'sign in to existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a...
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'Investor' | 'ProjectOwner')}
                  >
                    <option value="Investor">Investor</option>
                    <option value="ProjectOwner">Project Owner</option>
                  </select>
                </div>

                {role === 'ProjectOwner' && (
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
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
