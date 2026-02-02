import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserIcon,
  WalletIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  BriefcaseIcon as BriefcaseIconSolid, 
  UserIcon as UserIconSolid,
  WalletIcon as WalletIconSolid,
  PlusCircleIcon as PlusCircleIconSolid
} from '@heroicons/react/24/solid';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useApp();

  const navItems =
    user?.role === 'ProjectOwner'
      ? [
          { name: 'Home', path: '/creator/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
          { name: 'My Projects', path: '/my-projects', icon: BriefcaseIcon, activeIcon: BriefcaseIconSolid },
          { name: 'Create', path: '/create-project', icon: PlusCircleIcon, activeIcon: PlusCircleIconSolid },
          { name: 'Profile', path: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
        ]
      : [
          { name: 'Home', path: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
          { name: 'Projects', path: '/projects', icon: BriefcaseIcon, activeIcon: BriefcaseIconSolid },
          { name: 'Portfolio', path: '/portfolio', icon: WalletIcon, activeIcon: WalletIconSolid },
          { name: 'Profile', path: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
        ];

  // Hide on auth pages or home page if public
  if (location.pathname === '/' || location.pathname.startsWith('/auth')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-50 safe-area-bottom">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname.startsWith('/dashboard')) ||
            (item.path === '/creator/dashboard' && location.pathname.startsWith('/creator/dashboard')) ||
            (item.path !== '/dashboard' &&
              item.path !== '/creator/dashboard' &&
              location.pathname.startsWith(item.path));
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#00DC82]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
