import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChartPieIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Handle Dark Mode - Disabled/Removed
  useEffect(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
  }, []);

  const navigation = [
    { name: userRole === 'ProjectOwner' ? 'Owner Dashboard' : 'Dashboard', href: userRole === 'ProjectOwner' ? '/creator/dashboard' : '/dashboard', icon: HomeIcon, roles: ['all'] },
    { name: 'Projects', href: '/projects', icon: BriefcaseIcon, roles: ['Investor'] },
    { name: 'Raise Funds', href: '/create-project', icon: PlusCircleIcon, roles: ['ProjectOwner'] },
    { name: 'My Projects', href: '/my-projects', icon: BriefcaseIcon, roles: ['ProjectOwner'] },
    { name: 'Portfolio', href: '/portfolio', icon: ChartPieIcon, roles: ['Investor'] },
    { name: 'Wishlist', href: '/wishlist', icon: HeartIcon, roles: ['Investor'] },
    { name: 'Community', href: '/community', icon: UserGroupIcon, roles: ['all'] },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon, roles: ['all'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const isActive = (path: string) => location.pathname === path;
  
  const currentRole = userRole || 'Investor';

  return (
    <>
      <div className={`
        hidden lg:flex flex-col
        fixed inset-y-0 left-0 z-50 
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-brand-950 text-slate-200 border-r border-brand-900/60 lg:static h-screen
        transition-all duration-300 relative
      `}>
        
        {/* Header: Logo & Toggle */}
        <div className={`flex items-center h-20 px-4 shrink-0 border-b border-brand-900/60 ${isCollapsed ? 'justify-center gap-2' : 'justify-between'}`}>
          <Link to="/" className="flex items-center justify-center">
            {isCollapsed ? (
               <span className="text-2xl font-display font-bold text-brand-100 tracking-tight">L</span>
            ) : (
               <span className="text-2xl font-display font-bold text-brand-100 tracking-tight animate-fade-in truncate">Loopital</span>
            )}
          </Link>
          
          <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg hover:bg-brand-900/60 text-slate-400 hover:text-white transition-colors ${isCollapsed ? '' : ''}`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
              {isCollapsed ? <ChevronRightIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {navigation.filter(item => item.roles.includes('all') || item.roles.includes(currentRole)).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : ''}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active 
                    ? 'text-white bg-brand-900/80 font-bold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-brand-900/50'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`
                  w-6 h-6 transition-colors shrink-0
                  ${active ? 'text-brand-100' : 'text-slate-400 group-hover:text-brand-100'}
                `} />
                {!isCollapsed && <span className="animate-fade-in truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-brand-900/60 bg-brand-950 shrink-0 space-y-2">
            
           <div className={`flex items-center gap-3 mb-2 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.firstName} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-900/60"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-900/60 flex items-center justify-center text-brand-100 font-bold shrink-0 border border-brand-900/60">
                   {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden animate-fade-in">
                    <p className="text-sm font-bold text-white truncate">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'My Account'}
                    </p>
                </div>
              )}
           </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-300 rounded-lg hover:bg-red-500/10 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Sign Out' : ''}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span className="animate-fade-in">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
