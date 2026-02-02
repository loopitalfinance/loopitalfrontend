import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import InvestorDashboard from './InvestorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useApp();

  if (user?.role === 'ProjectOwner') {
    return <Navigate to="/creator/dashboard" replace />;
  }

  return <InvestorDashboard />;
};

export default Dashboard;
