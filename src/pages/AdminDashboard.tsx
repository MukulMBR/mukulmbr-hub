import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  BarChart3, 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  User,
  FolderGit2,
  Code,
  Briefcase
} from 'lucide-react';
import { 
  signOutAdmin, 
  fetchContactMessages, 
  deleteContactMessage, 
  fetchAnalyticsEvents,
  savePortfolioBio,
  savePortfolioProject,
  deletePortfolioProject,
  savePortfolioSkill,
  deletePortfolioSkill,
  savePortfolioExperience,
  deletePortfolioExperience
} from '../lib/firebase';
import { DEFAULT_BIO, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EXPERIENCE } from '../constants';

interface AdminDashboardProps {
  isDark: boolean;
  adminUser: any;
  setAdminUser: (user: any) => void;
  bioData: any;
  setBioData: React.Dispatch<React.SetStateAction<any>>;
  projectsList: any[];
  setProjectsList: React.Dispatch<React.SetStateAction<any[]>>;
  skillsList: any[];
  setSkillsList: React.Dispatch<React.SetStateAction<any[]>>;
  experienceHistory: any[];
  setExperienceHistory: React.Dispatch<React.SetStateAction<any[]>>;
  triggerAdminLogin: () => void;
}

export default function AdminDashboard({
  isDark,
  adminUser,
  setAdminUser,
  bioData,
  setBioData,
  projectsList,
  setProjectsList,
  skillsList,
  setSkillsList,
  experienceHistory,
  setExperienceHistory,
  triggerAdminLogin
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'messages' | 'content'>('analytics');
  const [messages, setMessages] = useState<any[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // CRUD Modal States
  const [editingType, setEditingType] = useState<'bio' | 'project' | 'skill' | 'experience' | null>(null);
  const [editBioData, setEditBioData] = useState<any>({});
  const [editProjectData, setEditProjectData] = useState<any>({});
  const [editSkillData, setEditSkillData] = useState<any>({});
  const [editExpData, setEditExpData] = useState<any>({});

  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch admin data
  useEffect(() => {
    if (!adminUser) return;

    const loadAdminData = async () => {
      setLoading(true);
      const [msgs, events] = await Promise.all([
        fetchContactMessages(),
        fetchAnalyticsEvents()
      ]);
      setMessages(msgs);
      setAnalyticsEvents(events);
      setLoading(false);
    };

    loadAdminData();
  }, [adminUser]);

  // Render Analytics Canvas Chart
  useEffect(() => {
    if (activeTab !== 'analytics' || !chartCanvasRef.current || analyticsEvents.length === 0) return;
    const canvas = chartCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Process last 7 days page views
    const pageViewsPerDay: { [key: string]: number } = {};
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      days.push(dateStr);
      pageViewsPerDay[dateStr] = 0;
    }

    analyticsEvents.forEach(e => {
      if (e.type === 'page_view' && e.timestamp) {
        const dateStr = new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
        if (pageViewsPerDay[dateStr] !== undefined) {
          pageViewsPerDay[dateStr]++;
        }
      }
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartW = canvas.width - padding * 2;
    const chartH = canvas.height - padding * 2;

    const values = days.map(d => pageViewsPerDay[d]);
    const maxVal = Math.max(...values, 5);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Label y-axis
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px monospace';
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toString(), padding - 25, y + 3);
    }

    // Draw chart line & glowing gradient
    const points = days.map((d, i) => {
      const x = padding + (chartW / (days.length - 1)) * i;
      const y = padding + chartH - (pageViewsPerDay[d] / maxVal) * chartH;
      return { x, y };
    });

    // Draw gradient area under the line
    const grad = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw the main line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw dots and x-axis labels
    points.forEach((p, i) => {
      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label x-axis
      ctx.fillStyle = '#6b7280';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(days[i], p.x, canvas.height - padding + 15);
    });

  }, [activeTab, analyticsEvents]);

  const handleLogout = async () => {
    await signOutAdmin();
    setAdminUser(null);
  };

  // Sync Database Seeder
  const handleSyncDatabase = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      // Seed Bio
      await savePortfolioBio(DEFAULT_BIO);
      setBioData(DEFAULT_BIO);

      // Seed Projects
      for (const p of DEFAULT_PROJECTS) {
        await savePortfolioProject(p);
      }
      setProjectsList(DEFAULT_PROJECTS);

      // Seed Skills
      for (const s of DEFAULT_SKILLS) {
        await savePortfolioSkill(s);
      }
      setSkillsList(DEFAULT_SKILLS);

      // Seed Experience
      for (const e of DEFAULT_EXPERIENCE) {
        await savePortfolioExperience(e);
      }
      setExperienceHistory(DEFAULT_EXPERIENCE);

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      alert("Seeding failed: " + (e as any).message);
    }
    setSyncing(false);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    await deleteContactMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // CRUD Save Handlers
  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePortfolioBio(editBioData);
    setBioData(editBioData);
    setEditingType(null);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectToSave = {
      ...editProjectData,
      id: editProjectData.id || `proj-${Date.now()}`
    };
    await savePortfolioProject(projectToSave);
    setProjectsList((prev: any[]) => {
      const idx = prev.findIndex((p: any) => p.id === projectToSave.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = projectToSave;
        return copy;
      }
      return [...prev, projectToSave];
    });
    setEditingType(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await deletePortfolioProject(id);
    setProjectsList((prev: any[]) => prev.filter((p: any) => p.id !== id));
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePortfolioSkill(editSkillData);
    setSkillsList((prev: any[]) => {
      const idx = prev.findIndex((s: any) => s.name === editSkillData.name);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = editSkillData;
        return copy;
      }
      return [...prev, editSkillData];
    });
    setEditingType(null);
  };

  const handleDeleteSkill = async (name: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    await deletePortfolioSkill(name);
    setSkillsList((prev: any[]) => prev.filter((s: any) => s.name !== name));
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePortfolioExperience(editExpData);
    setExperienceHistory((prev: any[]) => {
      const idx = prev.findIndex((ex: any) => ex.company === editExpData.company);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = editExpData;
        return copy;
      }
      return [...prev, editExpData];
    });
    setEditingType(null);
  };

  const handleDeleteExperience = async (company: string) => {
    if (!confirm("Are you sure you want to delete this experience milestone?")) return;
    await deletePortfolioExperience(company);
    setExperienceHistory((prev: any[]) => prev.filter((ex: any) => ex.company !== company));
  };

  // Compute metrics
  const totalPageViews = analyticsEvents.filter(e => e.type === 'page_view').length;
  const totalDownloads = analyticsEvents.filter(e => e.type === 'resume_download').length;
  const totalMessages = messages.length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-sm w-full p-8 rounded-2xl border border-white/5 glass-card space-y-6">
          <Lock className="w-10 h-10 mx-auto text-indigo-500" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Admin Dashboard Secure</h3>
            <p className="text-xs text-gray-500">Authentication is required to view analytics and manage portfolio content.</p>
          </div>
          <button 
            onClick={triggerAdminLogin}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            Authenticate Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6 text-left">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Unlock className="text-indigo-400 w-6 h-6" /> Admin Control Deck
          </h2>
          <p className="text-xs text-gray-500">Logged in as {adminUser.email}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSyncDatabase}
            disabled={syncing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {syncing ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />} 
            {syncSuccess ? 'Database Seeded!' : 'Seed Database'}
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6">
        {[
          { id: 'analytics', name: 'Live Analytics', icon: BarChart3 },
          { id: 'messages', name: 'Message Center', icon: Mail },
          { id: 'content', name: 'Content CRUD Panels', icon: Edit2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={14} /> {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        
        {/* ================= ANALYTICS TAB ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Total Page Views', value: totalPageViews, color: 'text-indigo-400', desc: 'Total homepage & page visits logged.' },
                { name: 'Resume Downloads', value: totalDownloads, color: 'text-purple-400', desc: 'Customizer compiles and downloads.' },
                { name: 'Contact Submissions', value: totalMessages, color: 'text-emerald-400', desc: 'Messages received in your inbox.' }
              ].map((s, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-white/5 glass-card space-y-2 text-left">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.name}</span>
                  <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                  <p className="text-[10px] text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-4 text-left">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Page Views (Last 7 Days)</h3>
              <div className="w-full overflow-x-auto">
                <canvas 
                  ref={chartCanvasRef} 
                  width={800} 
                  height={260} 
                  className="w-full max-w-[800px] aspect-[16/5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= MESSAGES TAB ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Inbox Contact Messages</h3>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-5 rounded-2xl border border-white/5 glass-card bg-black/40 flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-white">{msg.name}</span>
                      <span className="text-[10px] font-mono text-indigo-400">{msg.email}</span>
                      <span className="text-[9px] font-mono text-gray-500">
                        {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl">
                  <p className="text-xs text-gray-500 italic">No contact messages received yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= CONTENT CRUD TAB ================= */}
        {activeTab === 'content' && (
          <div className="space-y-8 text-left">
            
            {/* Bio CRUD Panel */}
            <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <User size={14} className="text-indigo-400" /> Biography Content
                </h4>
                <button 
                  onClick={() => { setEditBioData(bioData); setEditingType('bio'); }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={12} /> Edit Biography
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div><span className="text-gray-500 block">Name:</span> <span className="text-white font-semibold">{bioData.name}</span></div>
                <div><span className="text-gray-500 block">Role:</span> <span className="text-white font-semibold">{bioData.role}</span></div>
                <div><span className="text-gray-500 block">Experience:</span> <span className="text-white font-semibold">{bioData.experience} Years</span></div>
                <div><span className="text-gray-500 block">Location:</span> <span className="text-white font-semibold">{bioData.location}</span></div>
              </div>
            </div>

            {/* Projects CRUD Panel */}
            <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <FolderGit2 size={14} className="text-purple-400" /> Projects Portfolio ({projectsList.length})
                </h4>
                <button 
                  onClick={() => { setEditProjectData({ languages: [] }); setEditingType('project'); }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Project
                </button>
              </div>
              
              <div className="space-y-3">
                {projectsList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-mono">{p.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditProjectData(p); setEditingType('project'); }}
                        className="p-2 bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills CRUD Panel */}
            <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Code size={14} className="text-emerald-400" /> Skills Matrix ({skillsList.length})
                </h4>
                <button 
                  onClick={() => { setEditSkillData({}); setEditingType('skill'); }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Skill
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillsList.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-white block">{s.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{s.level}% Expertise</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditSkillData(s); setEditingType('skill'); }}
                        className="p-1.5 bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSkill(s.name)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience CRUD Panel */}
            <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase size={14} className="text-amber-400" /> Experience Timeline ({experienceHistory.length})
                </h4>
                <button 
                  onClick={() => { setEditExpData({ skills: [] }); setEditingType('experience'); }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Milestone
                </button>
              </div>
              
              <div className="space-y-3">
                {experienceHistory.map((ex) => (
                  <div key={ex.company} className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-white block">{ex.role} at {ex.company}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{ex.period}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditExpData(ex); setEditingType('experience'); }}
                        className="p-2 bg-white/5 hover:bg-indigo-600 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExperience(ex.company)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ================= CRUD EDITOR MODALS ================= */}
      <AnimatePresence>
        {editingType && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0" onClick={() => setEditingType(null)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl border p-6 relative z-10 max-h-[85vh] overflow-y-auto space-y-6 ${
                isDark ? 'bg-[#090d16] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {editingType === 'bio' ? 'Edit Biography Details' :
                   editingType === 'project' ? (editProjectData.id ? 'Edit Project' : 'Add New Project') :
                   editingType === 'skill' ? (editSkillData.name ? 'Edit Skill' : 'Add New Skill') :
                   editingType === 'experience' ? (editExpData.company ? 'Edit Experience' : 'Add Experience Entry') : ''}
                </h3>
                <button onClick={() => setEditingType(null)} className="text-xs text-gray-500 hover:text-white cursor-pointer">Close</button>
              </div>

              {/* Bio Editor */}
              {editingType === 'bio' && (
                <form onSubmit={handleSaveBio} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
                      <input 
                        type="text"
                        value={editBioData.name || ''}
                        onChange={(e) => setEditBioData({...editBioData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Professional Role</label>
                      <input 
                        type="text"
                        value={editBioData.role || ''}
                        onChange={(e) => setEditBioData({...editBioData, role: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Years Exp</label>
                      <input 
                        type="number"
                        value={editBioData.experience || 0}
                        onChange={(e) => setEditBioData({...editBioData, experience: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Shipped Repos</label>
                      <input 
                        type="number"
                        value={editBioData.shippedRepos || 0}
                        onChange={(e) => setEditBioData({...editBioData, shippedRepos: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Location</label>
                      <input 
                        type="text"
                        value={editBioData.location || ''}
                        onChange={(e) => setEditBioData({...editBioData, location: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Biography Paragraph 1</label>
                    <textarea 
                      rows={3}
                      value={editBioData.bioText1 || ''}
                      onChange={(e) => setEditBioData({...editBioData, bioText1: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Biography Paragraph 2</label>
                    <textarea 
                      rows={3}
                      value={editBioData.bioText2 || ''}
                      onChange={(e) => setEditBioData({...editBioData, bioText2: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer">
                    Save Changes
                  </button>
                </form>
              )}

              {/* Project Editor */}
              {editingType === 'project' && (
                <form onSubmit={handleSaveProject} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Project Name</label>
                      <input 
                        type="text"
                        required
                        value={editProjectData.name || ''}
                        onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
                      <select 
                        value={editProjectData.category || 'Frontend Eng'}
                        onChange={(e) => setEditProjectData({...editProjectData, category: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Frontend Eng">Frontend Eng</option>
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="Mobile App">Mobile App</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Brief Description</label>
                    <textarea 
                      required
                      rows={2}
                      value={editProjectData.description || ''}
                      onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">GitHub Repository URL</label>
                      <input 
                        type="url"
                        required
                        value={editProjectData.githubUrl || ''}
                        onChange={(e) => setEditProjectData({...editProjectData, githubUrl: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Live Demo URL (Optional)</label>
                      <input 
                        type="url"
                        value={editProjectData.liveUrl || ''}
                        onChange={(e) => setEditProjectData({...editProjectData, liveUrl: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Tech Stack (Comma separated)</label>
                    <input 
                      type="text"
                      value={editProjectData.languages ? editProjectData.languages.join(', ') : ''}
                      onChange={(e) => setEditProjectData({
                        ...editProjectData, 
                        languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="React, TypeScript, Tailwind"
                      className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Riddle/Challenge Details</label>
                    <textarea 
                      rows={2}
                      value={editProjectData.challenge || ''}
                      onChange={(e) => setEditProjectData({...editProjectData, challenge: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Solution Details</label>
                    <textarea 
                      rows={2}
                      value={editProjectData.solution || ''}
                      onChange={(e) => setEditProjectData({...editProjectData, solution: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer">
                    Save Project
                  </button>
                </form>
              )}

              {/* Skill Editor */}
              {editingType === 'skill' && (
                <form onSubmit={handleSaveSkill} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Skill Name</label>
                    <input 
                      type="text"
                      required
                      value={editSkillData.name || ''}
                      onChange={(e) => setEditSkillData({...editSkillData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Expertise Level ({editSkillData.level || 80}%)</label>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={editSkillData.level || 80}
                      onChange={(e) => setEditSkillData({...editSkillData, level: parseInt(e.target.value) || 80})}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer">
                    Save Skill
                  </button>
                </form>
              )}

              {/* Experience Editor */}
              {editingType === 'experience' && (
                <form onSubmit={handleSaveExperience} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Company Name</label>
                      <input 
                        type="text"
                        required
                        value={editExpData.company || ''}
                        onChange={(e) => setEditExpData({...editExpData, company: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Role Title</label>
                      <input 
                        type="text"
                        required
                        value={editExpData.role || ''}
                        onChange={(e) => setEditExpData({...editExpData, role: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Period (e.g. 2022 - Present)</label>
                      <input 
                        type="text"
                        required
                        value={editExpData.period || ''}
                        onChange={(e) => setEditExpData({...editExpData, period: e.target.value})}
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Milestone Skills (Comma separated)</label>
                      <input 
                        type="text"
                        value={editExpData.skills ? editExpData.skills.join(', ') : ''}
                        onChange={(e) => setEditExpData({
                          ...editExpData, 
                          skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="Angular, RxJS, NgRx"
                        className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Milestone Achievements</label>
                    <textarea 
                      required
                      rows={3}
                      value={editExpData.description || ''}
                      onChange={(e) => setEditExpData({...editExpData, description: e.target.value})}
                      className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer">
                    Save Milestone
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
