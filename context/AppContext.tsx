import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, User, Investment, Transaction, Notification } from '../types';
import { toast } from 'react-hot-toast';

interface AppContextType {
  user: User | null;
  projects: Project[];
  investments: Investment[];
  transactions: Transaction[];
  notifications: Notification[];
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    checkSession();
    loadProjects();
  }, []);

  // Load User Data when User changes
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user?.id]);

  const checkSession = async () => {
    const token = localStorage.getItem('loopital_token');
    if (token) {
      try {
        const userData = await api.getUser();
        const profile = userData?.profile || {};
        const firstName = userData?.firstName || '';
        const lastName = userData?.lastName || '';
        const role: User['role'] = profile?.role || 'Investor';
        const walletBalanceValue = profile?.walletBalance ?? profile?.balance ?? 0;
        const bankAccount =
          profile?.accountNumber && profile?.bankName && profile?.accountName
            ? {
                accountNumber: profile.accountNumber,
                bankName: profile.bankName,
                accountName: profile.accountName,
              }
            : undefined;

        const mappedUser: User = {
          id: String(userData?.id),
          name: `${firstName} ${lastName}`.trim() || userData?.username || userData?.email || 'Account',
          firstName,
          lastName,
          username: userData?.username,
          email: userData?.email,
          role,
          walletBalance: typeof walletBalanceValue === 'number' ? walletBalanceValue : parseFloat(walletBalanceValue) || 0,
          companyName: profile?.companyName,
          isVerified: profile?.isVerified,
          profilePicture: profile?.avatarUrl,
          bankAccount,
        };
        setUser(mappedUser);
        localStorage.setItem('loopital_user', JSON.stringify(mappedUser));
      } catch (error) {
        console.error("Session check failed", error);
        localStorage.removeItem('loopital_token');
      }
    }
    setIsLoading(false);
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const loadUserData = async () => {
    try {
      const [investData, transData, notifData] = await Promise.all([
        api.getInvestments(),
        api.getTransactions(),
        api.getNotifications()
      ]);
      setInvestments(investData);
      setTransactions(transData);
      setNotifications(notifData);
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('loopital_user', JSON.stringify(userData));
    loadUserData();
  };

  const logout = () => {
    setUser(null);
    setInvestments([]);
    setTransactions([]);
    setNotifications([]);
    localStorage.removeItem('loopital_token');
    localStorage.removeItem('loopital_user');
  };

  const refreshData = async () => {
    await Promise.all([loadProjects(), user ? loadUserData() : Promise.resolve()]);
  };

  return (
    <AppContext.Provider value={{
      user,
      projects,
      investments,
      transactions,
      notifications,
      isLoading,
      login,
      logout,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
