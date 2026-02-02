import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon,
  HeartIcon,
  MagnifyingGlassIcon, 
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Projects: React.FC = () => {
  const { projects, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlistView = location.pathname === '/wishlist';
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const [filterSector, setFilterSector] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const sectors = ['All', 'Agriculture', 'Real Estate', 'Logistics', 'Tech Infrastructure', 'Renewables'];
  const categories = ['All', 'Project', 'Startup'];

  if (isWishlistView && user?.role !== 'Investor') {
    return <Navigate to={user?.role === 'ProjectOwner' ? '/creator/dashboard' : '/dashboard'} replace />;
  }

  const wishlistIds: Array<string | number> = useMemo(() => {
    if (!isWishlistView) return [];
    const raw = localStorage.getItem('wishlist_project_ids');
    return JSON.parse(raw || '[]') as Array<string | number>;
  }, [isWishlistView, wishlistVersion]);

  const removeFromWishlist = (projectId: string | number) => {
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
    const isWishlisted = !isWishlistView || wishlistIds.some((id) => String(id) === String(p.id));
    const matchesSector = filterSector === 'All' || p.sector === filterSector;
    const matchesCategory = filterCategory === 'All' || (p.category || 'Project') === filterCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return isWishlisted && matchesSector && matchesCategory && matchesSearch;
  }).sort((a, b) => {
     if (sortBy === 'Newest') return new Date(b.id).getTime() - new Date(a.id).getTime();
     if (sortBy === 'Highest ROI') return (b.roi || 0) - (a.roi || 0);
     if (sortBy === 'Shortest Duration') return (a.durationMonths || 999) - (b.durationMonths || 999);
     if (sortBy === 'Highest Valuation') return (b.valuation || 0) - (a.valuation || 0);
     return 0;
  });

  const formatCurrency = (value: number) => {
    const safe = Number.isFinite(value) ? value : 0;
    return `₦${Math.round(safe).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      {isWishlistView ? (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] to-[#022c22]"></div>
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00DC82]/10 blur-3xl"></div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                  <HeartIcon className="h-3.5 w-3.5 text-[#00DC82]" />
                  Saved Projects
                </div>
                <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Wishlist</h1>
                <p className="mt-1 text-sm text-white/70 max-w-xl">
                  Keep your favorite deals here and invest when the timing is right.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <HeartIcon className="h-5 w-5 text-[#00DC82]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Saved</p>
                    <p className="text-lg font-bold text-white">{wishlistIds.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0A192F] hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
                >
                  Browse Marketplace <ArrowRightIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={clearWishlist}
                  disabled={wishlistIds.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear Wishlist
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative w-full group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-[#00DC82] transition-colors" />
                <input
                  type="text"
                  placeholder="Search your saved projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#00DC82]/30 focus:border-[#00DC82]/40 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">Marketplace</h1>
            <p className="text-surface-500 mt-1">Explore high-yield vetted investment opportunities.</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects, location, sector..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`flex flex-col gap-6 ${isWishlistView ? 'hidden' : ''}`}>
         {/* Category Filter */}
         <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-surface-700">Type:</span>
            <div className="flex gap-2 bg-surface-100 p-1 rounded-lg">
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setFilterCategory(cat)}
                     className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        filterCategory === cat
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-500 hover:text-surface-800'
                     }`}
                  >
                     {cat === 'Project' ? 'Debt (Projects)' : cat === 'Startup' ? 'Equity (Startups)' : 'All'}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Sector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
               {sectors.map(sector => (
                 <button
                    key={sector}
                    onClick={() => setFilterSector(sector)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                        filterSector === sector 
                        ? 'bg-primary-50 border-primary-100 text-primary-700' 
                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50 hover:border-surface-300'
                    }`}
                 >
                    {sector}
                 </button>
               ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
               <FunnelIcon className="w-4 h-4 text-surface-500" />
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-medium text-surface-700 focus:outline-none cursor-pointer"
               >
                  <option>Newest</option>
                  <option>Highest ROI</option>
                  <option>Shortest Duration</option>
                  <option>Highest Valuation</option>
               </select>
            </div>
         </div>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
           {filteredProjects.map(project => (
              <div key={project.id} className="relative">
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${project.uuid || project.id}`)}
                  className="group w-full text-left rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  <div className="relative">
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <BuildingOfficeIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00DC82]" />
                        {project.category || 'Project'}
                      </div>

                      {isWishlistView ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          <HeartIcon className="h-3.5 w-3.5 text-[#00DC82]" />
                          Saved
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/35 px-3 py-2 backdrop-blur text-white">
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">ROI</div>
                          <div className="text-sm font-bold">
                            {project.category === 'Startup' ? `${project.equityPercentage || 0}%` : `${project.roi || 0}%`}
                          </div>
                        </div>
                        <div className="h-7 w-px bg-white/20" />
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Min</div>
                          <div className="text-sm font-bold">{formatCurrency(Number(project.minInvestment || 0))}</div>
                        </div>
                      </div>
                      {project.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00DC82]" />
                          Verified
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                            {project.sector || 'General'}
                          </span>
                          {project.location ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 text-slate-600 px-2.5 py-1 text-[10px] font-bold border border-slate-200">
                              <MapPinIcon className="h-3.5 w-3.5" />
                              {project.location}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-lg font-display font-bold text-slate-900 line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="hidden sm:flex flex-col items-end shrink-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target</div>
                        <div className="text-sm font-bold text-slate-900">{formatCurrency(Number(project.targetAmount || 0))}</div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Funding</span>
                        <span className="text-[#00DC82]">
                          {Math.min(100, Math.round((Number(project.raisedAmount || 0) / Math.max(1, Number(project.targetAmount || 0))) * 100))}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#00DC82]"
                          style={{
                            width: `${Math.min(100, Math.round((Number(project.raisedAmount || 0) / Math.max(1, Number(project.targetAmount || 0))) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Raised {formatCurrency(Number(project.raisedAmount || 0))}</span>
                        <span className="inline-flex items-center gap-1 text-slate-600 font-bold">
                          <ArrowTrendingUpIcon className="h-4 w-4 text-[#00DC82]" />
                          Invest Now
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {isWishlistView && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(project.id);
                    }}
                    className="absolute top-4 right-4 z-20 inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-white/90 backdrop-blur border border-white/30 shadow-lg shadow-black/10 hover:bg-white transition-colors"
                    title="Remove"
                  >
                    <XMarkIcon className="h-5 w-5 text-slate-900" />
                  </button>
                )}
              </div>
           ))}
        </div>
      ) : (
        <div className={`relative overflow-hidden text-center py-20 rounded-3xl border ${isWishlistView ? 'border-slate-200 bg-white' : 'border-dashed border-surface-300 bg-white'}`}>
          {isWishlistView ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50"></div>
              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#0A192F] flex items-center justify-center shadow-lg shadow-slate-900/10">
                  <HeartIcon className="h-7 w-7 text-[#00DC82]" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">Your wishlist is empty</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  Save deals from the marketplace and they’ll show up here for quick access.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A192F] px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Browse Projects <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-surface-900">No projects found</h3>
              <p className="text-surface-500">Try adjusting your filters or search term.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
