import React from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import ProjectOwnerDashboard from './ProjectOwnerDashboard';

const CreatorDashboardPage: React.FC = () => {
  const { user } = useApp();

  if (user?.role !== 'ProjectOwner') {
    return <Navigate to="/dashboard" replace />;
  }

  return <ProjectOwnerDashboard />;
};

export default CreatorDashboardPage;
