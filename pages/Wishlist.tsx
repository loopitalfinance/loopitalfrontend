import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon,
  HeartIcon,
  MagnifyingGlassIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Wishlist: React.FC = () => {
  const { projects, user } = useApp();
  const navigate = useNavigate();
  const [wishlistVersion, setWishlistVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  if (user?.role !== 'Investor') {
    return <Navigate to={user?.role === 'ProjectOwner' ? '/creator/dashboard' : '/dashboard'} replace />;
  }

  const wishlistIds: Array<string | number> = useMemo(() => {
    const raw = localStorage.getItem('wishlist_project_ids');
    return JSON.parse(raw || '[]') as Array<string | number>;
  }, [wishlistVersion]);

  const removeFromWishlist = (projectId: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const raw = localStorage.getItem('wishlist_project_ids');
    const current = (JSON.parse(raw || '[]') as Array<string | number>) || [];
    const next = current.filter((id) => String(id) !== String(projectId));
    localStorage.setItem('wishlist_project_ids', JSON.stringify(next));
    setWishlistVersion((v) => v + 1);
  };

  const clearWishlist = () => {
    localStorage.setItem('wishlist_project_ids', JSON.stringify([]));
    setWishlistVersion((v) => v + 1);
  };

  const filteredProjects = projects.filter(p => {
    const isWishlisted = wishlistIds.some((id) => String(id) === String(p.id));
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return isWishlisted && matchesSearch;
  });

  const formatCurrency = (value: number) => {
    const safe = Number.isFinite(value) ? value : 0;
    return `₦${Math.round(safe).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] to-[#022c22]"></div>
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00DC82]/10 blur-3xl"></div>

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                <HeartIcon className="h-3.5 w-3.5 text-[#00DC82]" />
                Saved Projects
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Your Wishlist</h1>
              <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
                Curate your investment strategy. Track high-potential opportunities and move when you're ready.
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-4">
                 <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <HeartIcon className="h-5 w-5 text-[#00DC82]" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Saved Items</p>
                       <p className="text-xl font-bold text-white">{wishlistIds.length}</p>
                    </div>
                 </div>
                 
                 {wishlistIds.length > 0 && (
                    <button
                      type="button"
                      onClick={clearWishlist}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 transition-all hover:scale-105 active:scale-95"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Clear All
                    </button>
                 )}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-4">
               <div className="relative w-full md:w-80 group">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-[#00DC82] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search wishlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/30 focus:border-[#00DC82]/40 transition-all backdrop-blur-sm shadow-lg shadow-black/10"
                  />
               </div>
               
               <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[#0A192F] hover:bg-slate-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Browse Marketplace <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {filteredProjects.map(project => (
              <div key={project.id} className="relative group">
                <div 
                  onClick={() => navigate(`/projects/${project.uuid || project.id}`)}
                  className="cursor-pointer h-full flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <BuildingOfficeIcon className="h-10 w-10 opacity-50" />
                      </div>
                    )}
                    
                    {/* Overlay Badges */}
                    <div className="absolute inset-x-4 top-4 flex items-start justify-between">
                       <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00DC82]" />
                          {project.category || 'Project'}
                       </div>
                       
                       <button
                          onClick={(e) => removeFromWishlist(project.id, e)}
                          className="p-2 rounded-full bg-white/90 backdrop-blur text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                          title="Remove from Wishlist"
                       >
                          <TrashIcon className="h-4 w-4" />
                       </button>
                    </div>

                    {/* Bottom Stats Overlay */}
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-md text-white shadow-lg">
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Returns</div>
                          <div className="text-sm font-bold flex items-center gap-1">
                             <ArrowTrendingUpIcon className="h-3 w-3 text-[#00DC82]" />
                             {project.category === 'Startup' ? `${project.equityPercentage || 0}% Equity` : `${project.roi || 0}% ROI`}
                          </div>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Min Entry</div>
                          <div className="text-sm font-bold">{formatCurrency(Number(project.minInvestment || 0))}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        {project.sector || 'General'}
                      </span>
                      {project.location && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 text-slate-600 px-2.5 py-1 text-[10px] font-bold border border-slate-200">
                          <MapPinIcon className="h-3 w-3" />
                          {project.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-display font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-xs font-medium text-slate-400">
                          {project.isVerified ? 'Verified Opportunity' : 'Pending Verification'}
                       </span>
                       <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details <ArrowRightIcon className="h-4 w-4" />
                       </span>
                    </div>
                  </div>
                </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <HeartIcon className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="mt-2 text-slate-500 max-w-sm mx-auto">
            Save interesting projects here to track them or invest later.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            Explore Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;