import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Search, 
  ChevronRight, 
  Star, 
  ExternalLink,
  Info,
  BookOpen,
  CheckCircle,
  Sliders,
  Zap,
  Award,
  Code
} from 'lucide-react';
import { logAnalyticsEvent } from '../lib/firebase';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  languages: string[];
  challenge: string;
  research: string;
  solution: string;
  challenges: string;
  performanceOptimizations: string;
  outcome: string;
  lessonsLearned: string;
  impact: string;
  architecture: string;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectsProps {
  isDark: boolean;
  projectsList: Project[];
}

export default function Projects({ isDark, projectsList }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'saas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Log page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page: 'projects' });
  }, []);

  const list = projectsList || [];

  // Filter projects
  const filteredProjects = list.filter((p) => {
    const matchesCategory = 
      activeCategory === 'all' || 
      (activeCategory === 'frontend' && p.category.toLowerCase().includes('frontend')) ||
      (activeCategory === 'saas' && p.category.toLowerCase().includes('saas'));
    
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.languages || []).some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    logAnalyticsEvent('view_project', { projectId: project.id, projectName: project.name });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
          <FolderGit2 size={14} /> Case Studies
        </div>
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Engineering Showcase
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Explore deep-dives into production-ready architectures, performance optimization logs, and product engineering journeys.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 rounded-2xl border border-white/5 glass-card">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', name: 'All Work' },
            { id: 'frontend', name: 'Frontend Eng' },
            { id: 'saas', name: 'SaaS Platforms' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Search size={14} />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <motion.div 
            layoutId={`proj-card-${p.id}`}
            key={p.id}
            onClick={() => handleProjectClick(p)}
            className="group rounded-2xl border border-white/5 p-6 glass-card bg-gradient-to-br from-[#0a0f1d]/40 to-[#03060c]/40 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/5 min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
                  {p.category}
                </span>
                {p.featured && (
                  <Star size={12} fill="#eab308" className="text-amber-500" />
                )}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-gray-450 leading-relaxed line-clamp-3">
                {p.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
              <span className="text-[10px] text-gray-500 font-mono">
                {(p.languages || []).slice(0, 3).join(' • ')}
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Details <ChevronRight size={12} />
              </span>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-xs text-gray-500 italic">No projects found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            {/* Overlay click to close */}
            <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)}></div>

            <motion.div 
              layoutId={`proj-card-${selectedProject.id}`}
              className="w-full max-w-3xl rounded-2xl border border-white/10 p-6 relative z-10 max-h-[85vh] overflow-y-auto space-y-8 bg-[#060913] text-left scrollbar-thin scrollbar-thumb-white/5"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{selectedProject.name}</h3>
                  <p className="text-xs text-indigo-400 mt-1">{selectedProject.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left metadata column */}
                <div className="md:col-span-1 space-y-6">
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Technologies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedProject.languages || []).map((l) => (
                        <span key={l} className="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.description}</p>
                  </div>
                </div>

                {/* Right content column */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Info size={12} className="text-indigo-500" /> Challenge
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.challenge}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <BookOpen size={12} className="text-purple-500" /> Research & Design
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.research}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-emerald-500" /> Solution
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.solution}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Sliders size={12} className="text-amber-500" /> Technical Bottlenecks
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.challenges}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Zap size={12} className="text-blue-500" /> Performance Optimization
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.performanceOptimizations}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Award size={12} className="text-emerald-500" /> Business Impact
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedProject.outcome}</p>
                    <p className="text-xs text-emerald-500 font-semibold bg-emerald-500/5 p-2 rounded border border-emerald-500/10 mt-1">
                      Impact: {selectedProject.impact}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Code size={12} className="text-indigo-500" /> Architecture Flow
                    </h4>
                    <div className="p-3 bg-black/60 border border-white/5 rounded-lg font-mono text-[10px] text-indigo-300">
                      {selectedProject.architecture}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                {selectedProject.liveUrl && (
                  <a 
                    href={selectedProject.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Live Demo <ExternalLink size={12} />
                  </a>
                )}
                <a 
                  href={selectedProject.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-semibold glass-card hover:bg-white/5 text-gray-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Repository <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
