import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  HeartIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface TopNavProps {
  onMenuClick: () => void;
  user: any;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick, user }) => {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // Poll for notifications every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value;
      if (query.trim()) {
        navigate(`/projects?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (data && data.length > 0) {
        // Check local storage for read notifications (fallback for mock/stateless backend)
        const readIds = JSON.parse(localStorage.getItem('mock_notifications_read') || '[]');
        
        const processedData = data.map((n: any) => ({
          ...n,
          isRead: n.isRead || readIds.includes(n.id)
        }));

        setNotifications(processedData);
        setUnreadCount(processedData.filter((n: any) => !n.isRead).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead(undefined);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      
      // Persist read status for mock data
      const allIds = notifications.map(n => n.id);
      localStorage.setItem('mock_notifications_read', JSON.stringify(allIds));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
      // Still update UI and local storage for mock fallback
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      const allIds = notifications.map(n => n.id);
      localStorage.setItem('mock_notifications_read', JSON.stringify(allIds));
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile Logo (Replaces Menu Toggle) */}
      <div className="lg:hidden">
        <Link to="/" className="flex items-center gap-2">
           <span className="text-lg font-display font-bold text-brand-900 dark:text-white tracking-tight">Loopital<span className="text-[#00DC82]">.</span></span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-2xl mx-auto px-4">
        <div className="hidden md:flex items-center w-full relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search projects, investments..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400 dark:text-white"
          />
        </div>
      </div>

      {/* Right: Currency & Notifications */}
      <div className="flex items-center gap-4">
        {user?.role === 'ProjectOwner' && (
          <button
            onClick={() => navigate('/create-project')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[#022c22] hover:bg-[#064e3b] text-white rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            New Project
          </button>
        )}
        {/* Currency Toggle Removed */}
        {/* <div className="hidden sm:flex bg-slate-100 rounded-full p-1 items-center">
            <button className="px-3 py-1 rounded-full bg-white text-xs font-bold shadow-sm text-slate-900">NGN</button>
            <button className="px-3 py-1 rounded-full text-slate-500 text-xs font-bold hover:text-slate-900">USD</button>
        </div> */}

        {user?.role === 'Investor' && (
          <Link to="/wishlist" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-pink-50 hover:text-pink-500 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none md:hidden">
            <HeartIcon className="w-6 h-6" />
          </Link>
        )}

        <Menu as="div" className="relative">
          <Menu.Button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-[#f0fdf4] hover:text-[#00DC82] dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none">
            <style>{`
              @keyframes bell-shake {
                0% { transform: rotate(0deg); }
                15% { transform: rotate(15deg); }
                30% { transform: rotate(-15deg); }
                45% { transform: rotate(10deg); }
                60% { transform: rotate(-10deg); }
                75% { transform: rotate(5deg); }
                90% { transform: rotate(-5deg); }
                100% { transform: rotate(0deg); }
              }
              .animate-bell-shake {
                animation: bell-shake 2s infinite;
                transform-origin: top center;
              }
            `}</style>
            <BellIcon className={`w-6 h-6 ${unreadCount > 0 ? 'animate-bell-shake text-[#00DC82]' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none py-2 z-[100] border border-slate-100 dark:border-slate-700 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-[#00DC82] font-bold hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors ${active ? 'bg-[#f0fdf4] dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700'} ${!notification.isRead ? 'bg-slate-50/50 dark:bg-slate-700/30' : ''}`}>
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-[#00DC82]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                          <div>
                            <p className={`text-sm text-slate-800 dark:text-white ${!notification.isRead ? 'font-bold' : 'font-medium'}`}>{notification.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                              {new Date(notification.timestamp).toLocaleDateString('en-GB', {
                                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <Menu as="div" className="relative">
          <Menu.Button className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-xs font-bold">
                {String(user?.name || 'U').trim().substring(0, 2).toUpperCase()}
              </span>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none py-2 z-[100] border border-slate-100 dark:border-slate-700 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Account'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold ${
                      active ? 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <UserCircleIcon className="w-5 h-5 text-slate-400" />
                    Profile
                  </button>
                )}
              </Menu.Item>
              {user?.role === 'Investor' && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/wishlist')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold ${
                        active ? 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <HeartIcon className="w-5 h-5 text-pink-400" />
                      Wishlist
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/auth/login');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold ${
                      active ? 'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-slate-400" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default TopNav;
