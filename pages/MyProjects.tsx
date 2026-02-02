import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import { ManageProjectModal } from '../components/OwnerModals';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [manageProject, setManageProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.role === 'ProjectOwner';

  useEffect(() => {
    if (!isOwner) return;
    loadMyProjects();
  }, [isOwner]);

  if (!isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  const loadMyProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getMyListings();
      setMyProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-950">
            My Projects
          </h1>
          <p className="text-slate-500 mt-1">View and manage all your created projects.</p>
        </div>
        <button 
          onClick={() => navigate('/create-project')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#15803d] hover:bg-[#14532d] text-white rounded-xl font-medium shadow-lg shadow-[#15803d]/30 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Project
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
           <ArrowPathIcon className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : myProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="mx-auto w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
             <PlusIcon className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-bold text-brand-950 mb-2">No projects yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">Start your fundraising journey by creating your first project.</p>
          <button 
            onClick={() => navigate('/create-project')}
            className="text-brand-600 font-bold hover:text-brand-700 hover:underline"
          >
            Create Project &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {myProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onViewDetails={(p) => navigate(`/projects/${p.id}`)}
              onManage={(p) => setManageProject(p)}
            />
          ))}
        </div>
      )}
      
      {manageProject && (
        <ManageProjectModal
          isOpen={!!manageProject}
          onClose={() => setManageProject(null)}
          project={manageProject}
        />
      )}
    </div>
  );
};

export default MyProjects;
