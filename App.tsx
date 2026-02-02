import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Portfolio from './pages/Portfolio';
import Community from './pages/Community';
import Profile from './pages/Profile';
import CreateProject from './pages/CreateProject';
import Spinner from './components/Spinner';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import MyProjects from './pages/MyProjects';
import Activities from './pages/Activities';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useApp();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/auth/login" />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route (Layout optional)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<Home onGetStarted={() => navigate('/auth/login')} />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/register" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/creator/dashboard" element={<ProtectedRoute><CreatorDashboardPage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:uuid" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
      <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AppProvider>
  );
};

export default App;
