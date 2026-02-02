
import React, { useState, useEffect } from 'react';
import { User, Notification } from '../types';
import NotificationsPanel from './NotificationsPanel';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  ChartPieIcon, 
  UserCircleIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  ArrowRightOnRectangleIcon,
  Bars3BottomLeftIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface Props {
  user: User | null;
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout?: () => void;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
  notifications?: Notification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

const Navbar: React.FC<Props> = ({ 
  user, 
  currentView, 
  onChangeView, 
  onLogout, 
  isCollapsed, 
  toggleSidebar,
  notifications = [],
  onMarkNotificationRead = () => {},
  onMarkAllNotificationsRead = () => {}
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavItems = () => {
    if (!user) return [];
    if (user.role === 'ProjectOwner') {
      return [
        { id: 'dashboard', label: 'Home', icon: HomeIcon },
        { id: 'create-project', label: 'Raise Funds', icon: ChartPieIcon }, 
        { id: 'my-projects', label: 'My Projects', icon: BriefcaseIcon },
        { id: 'projects', label: 'Invest', icon: MagnifyingGlassIcon },
        { id: 'community', label: 'Community', icon: UserGroupIcon },
        { id: 'portfolio', label: 'Portfolio', icon: Squares2X2Icon },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
      ];
    }
    if (user.role === 'Admin') {
       return [
        { id: 'dashboard', label: 'Home', icon: HomeIcon },
        { id: 'vetting', label: 'Vetting', icon: ShieldCheckIcon },
        { id: 'users', label: 'User Mgmt', icon: UserGroupIcon },
        { id: 'projects', label: 'Invest', icon: MagnifyingGlassIcon },
        { id: 'community', label: 'Community', icon: UserGroupIcon },
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
      ];
    }
    // Investor
    return [
      { id: 'dashboard', label: 'Home', icon: HomeIcon },
      { id: 'projects', label: 'Invest', icon: MagnifyingGlassIcon },
      { id: 'community', label: 'Community', icon: UserGroupIcon },
      { id: 'portfolio', label: 'Portfolio', icon: ChartPieIcon },
      { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    ];
  };

  const navItems = getNavItems();

  // Public Navbar
  if (!user) {
    const isHome = currentView === 'home';
    const isTransparent = isHome && !scrolled;

    return (
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isTransparent 
            ? 'bg-transparent py-6' 
            : 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12 items-center">
            <div 
              className="flex items-center cursor-pointer group gap-1"
              onClick={() => onChangeView('home')}
            >
              <span className={`text-2xl font-bold tracking-tight transition-colors text-[#0A192F]`}>loopital</span>
              <span className="w-2 h-2 rounded-full bg-[#00DC82] mt-3 group-hover:scale-125 transition-transform"></span>
            </div>
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => onChangeView('auth')}
                 className="font-semibold text-sm text-slate-600 hover:text-[#0A192F] transition-colors"
               >
                 Log In
               </button>
               <button 
                 onClick={() => onChangeView('auth')}
                 className="font-semibold text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 bg-[#0A192F] text-white hover:bg-slate-800 shadow-md"
               >
                 Get Started
               </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated Sidebar & Mobile Header
  return (
    <>
      <aside 
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-[#0A192F] text-slate-300 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
           {!isCollapsed ? (
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => onChangeView('dashboard')}>
              <span className="text-2xl font-bold tracking-tight text-white">loopital</span>
              <span className="w-2 h-2 rounded-full bg-[#00DC82] mt-3"></span>
            </div>
           ) : (
             <div className="w-full flex justify-center">
               <span className="w-3 h-3 rounded-full bg-[#00DC82]"></span>
             </div>
           )}
           
           {!isCollapsed && (
             <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <Bars3BottomLeftIcon className="w-5 h-5" />
             </button>
           )}
        </div>

        {/* Collapsed Toggle (If Collapsed) */}
        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-white/5">
             <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <Bars3BottomLeftIcon className="w-6 h-6" />
             </button>
          </div>
        )}

        {/* Wallet Summary */}
        <div className={`mt-6 mb-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
           <div className={`bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm ${isCollapsed ? 'py-4 flex justify-center' : 'p-4'}`}>
              {isCollapsed ? (
                <div className="text-[#00DC82] font-mono font-bold text-sm">₦</div>
              ) : (
                <>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Balance</p>
                  <p className="text-lg font-bold text-white font-mono flex items-center gap-1">
                    <span className="text-[#00DC82]">₦</span> 
                    {user.walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0, notation: "compact" })}
                  </p>
                </>
              )}
           </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center relative group ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00DC82] text-[#0A192F] font-bold shadow-md shadow-green-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'text-[#0A192F]' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                {!isCollapsed && <span>{item.label}</span>}
                
                {isCollapsed && (
                   <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
                      {item.label}
                   </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors group relative`}
          >
            <ArrowRightOnRectangleIcon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isCollapsed && <span>Sign Out</span>}
            {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
                  Sign Out
                </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header / Desktop Top Bar */}
      <div className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between transition-all duration-300 ${isCollapsed ? 'md:pl-24' : 'md:pl-64'}`}>
         {/* Mobile Logo */}
         <div 
            className="md:hidden flex items-center gap-1"
            onClick={() => onChangeView(user ? 'dashboard' : 'home')}
          >
            <span className="text-xl font-bold tracking-tight text-[#0A192F]">loopital</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DC82] mt-2"></span>
         </div>
         
         {/* Desktop Placeholder / Breadcrumb */}
         <div className="hidden md:block">
            <h2 className="font-bold text-[#0A192F] capitalize">{currentView.replace('-', ' ')}</h2>
         </div>

         <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#0A192F] transition-colors relative"
               >
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
               </button>
               {/* Notification Panel Component */}
               <NotificationsPanel 
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  notifications={notifications}
                  onMarkAsRead={onMarkNotificationRead}
                  onClearAll={onMarkAllNotificationsRead}
               />
            </div>

            <div className="bg-[#0A192F] rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <span className="text-[10px] text-[#00DC82] font-bold">₦</span>
              <span className="text-xs font-bold text-white font-mono">{user.walletBalance.toLocaleString(undefined, { maximumFractionDigits: 0, notation: "compact" })}</span>
            </div>
            
            <button onClick={() => onChangeView('profile')} className="w-8 h-8 rounded-full ring-2 ring-slate-100 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0A192F&color=fff`} alt="Profile" />
            </button>
         </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <div className={`p-1 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#0A192F] stroke-[2.5px]' : 'text-slate-400 stroke-2'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
