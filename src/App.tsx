import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Lock, 
  Unlock, 
  FileText, 
  Download,
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';

// Import Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Toolkit from './pages/Toolkit';
import Guestbook from './pages/Guestbook';
import TerminalQuest from './pages/TerminalQuest';
import AdminDashboard from './pages/AdminDashboard';

// Import Firebase CRUD operations
import {
  isFirebaseEnabled,
  signInAdmin,
  onAdminAuthChange,
  fetchPortfolioData,
  saveFirebaseConfig,
  initFirebase
} from './lib/firebase';

import { DEFAULT_BIO, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_EXPERIENCE } from './constants';

// Custom Brand SVGs
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Mail = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Theme state: default to 'dark'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  // Admin state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Firebase Config State
  const [firebaseConnected, setFirebaseConnected] = useState(isFirebaseEnabled());
  const [firebaseConfigInput, setFirebaseConfigInput] = useState('');
  const [configError, setConfigError] = useState('');

  // Portfolio Data States
  const [bioData, setBioData] = useState<any>(DEFAULT_BIO);
  const [projectsList, setProjectsList] = useState<any[]>(DEFAULT_PROJECTS);
  const [skillsList, setSkillsList] = useState<any[]>(DEFAULT_SKILLS);
  const [experienceHistory, setExperienceHistory] = useState<any[]>(DEFAULT_EXPERIENCE);

  // Resume Customizer Modal States
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeFocus, setResumeFocus] = useState<'frontend' | 'fullstack' | 'all'>('all');
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeCerts, setIncludeCerts] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Track Firebase connection and admin login session
  useEffect(() => {
    const unsubscribe = onAdminAuthChange((user) => {
      setAdminUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch portfolio data from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      if (isFirebaseEnabled()) {
        const data = await fetchPortfolioData();
        if (data.bio) setBioData(data.bio);
        if (data.projects) setProjectsList(data.projects);
        if (data.skills) setSkillsList(data.skills);
        if (data.experience) setExperienceHistory(data.experience);
      }
    };
    loadData();
  }, []);

  // Firebase Config Handler
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigError('');
    const success = saveFirebaseConfig(firebaseConfigInput);
    if (success) {
      initFirebase();
      const connected = isFirebaseEnabled();
      setFirebaseConnected(connected);
      if (connected) {
        // Load data from Firebase now that it's connected
        const loadData = async () => {
          const data = await fetchPortfolioData();
          if (data.bio) setBioData(data.bio);
          if (data.projects) setProjectsList(data.projects);
          if (data.skills) setSkillsList(data.skills);
          if (data.experience) setExperienceHistory(data.experience);
        };
        loadData();
        alert("Firebase connected successfully!");
      } else {
        setConfigError("Failed to initialize Firebase with the provided configuration.");
      }
    } else {
      setConfigError("Invalid Firebase configuration format. Make sure it contains apiKey and projectId.");
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await signInAdmin(adminEmail, adminPassword);
    if (res.success) {
      setAdminUser(res.user);
      setIsAdminLoginOpen(false);
      setAdminEmail('');
      setAdminPassword('');
      navigate('/admin');
    } else {
      setAuthError(res.message);
    }
  };

  // Dynamic Resume PDF Compiler (using jsPDF)
  const handleCompileResume = () => {
    setIsCompiling(true);

    setTimeout(() => {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(bioData.name.toUpperCase(), 20, y);
      
      y += 8;
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(`${bioData.role}  |  ${bioData.location}  |  mukulmbr@gmail.com  |  8919866652`, 20, y);

      y += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);

      // Executive Summary
      if (includeSummary) {
        y += 10;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('EXECUTIVE SUMMARY', 20, y);
        y += 6;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        const summaryText = doc.splitTextToSize(bioData.bioText1, 170);
        doc.text(summaryText, 20, y);
        y += (summaryText.length * 5) + 4;
      }

      // Professional Experience
      y += 4;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PROFESSIONAL EXPERIENCE', 20, y);
      y += 6;

      experienceHistory.forEach((exp) => {
        // Filter experience based on focus toggle
        if (resumeFocus === 'frontend' && !exp.role.toLowerCase().includes('frontend')) return;
        if (resumeFocus === 'fullstack' && !exp.role.toLowerCase().includes('lead') && !exp.role.toLowerCase().includes('full')) return;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${exp.role} - ${exp.company}`, 20, y);
        doc.setFont('Helvetica', 'normal');
        doc.text(exp.period, 190, y, { align: 'right' });
        
        y += 5;
        doc.setFontSize(9);
        const descText = doc.splitTextToSize(exp.description, 170);
        doc.text(descText, 20, y);
        y += (descText.length * 4.5) + 6;
      });

      // Key Skills Stack
      y += 2;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TECHNICAL SKILLS STACK', 20, y);
      y += 6;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      const skillsLine = skillsList.map(s => s.name).join('  |  ');
      const skillsText = doc.splitTextToSize(skillsLine, 170);
      doc.text(skillsText, 20, y);
      y += (skillsText.length * 5) + 8;

      // Certifications
      if (includeCerts) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('CERTIFICATIONS & SCHOLARSHIPS', 20, y);
        y += 6;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text('* Google Cloud Certified Associate Cloud Engineer (ACE)', 20, y);
        y += 5;
        doc.text('* Advanced Frontend Engineering Specialist - TCS Digit Program', 20, y);
      }

      // Save PDF
      doc.save(`MukulMBR_Resume_${resumeFocus}.pdf`);
      setIsCompiling(false);
      setIsResumeOpen(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#03060c] text-gray-300' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* ================= HEADER NAV ================= */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all ${
        isDark ? 'bg-[#03060c]/80 border-white/5' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-mono text-xs font-bold text-white tracking-widest cursor-pointer">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 animate-pulse"></span>
            MUKULMBR <span className="text-gray-500 font-normal">v1.4.2</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link to="/" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/' ? 'text-white' : ''}`}>Home</Link>
            <Link to="/projects" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/projects' ? 'text-white' : ''}`}>Projects</Link>
            <Link to="/toolkit" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/toolkit' ? 'text-white' : ''}`}>Toolkit</Link>
            <Link to="/guestbook" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/guestbook' ? 'text-white' : ''}`}>Guestbook</Link>
            <Link to="/quest" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/quest' ? 'text-white' : ''}`}>CLI Quest</Link>
            {adminUser && (
              <Link to="/admin" className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/admin' ? 'text-indigo-400' : ''}`}>Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Resume Button */}
            <button 
              onClick={() => setIsResumeOpen(true)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 flex items-center gap-1 cursor-pointer transition-all"
            >
              <FileText size={12} /> Resume
            </button>

            {/* Admin trigger Lock icon */}
            <button 
              onClick={() => {
                if (adminUser) {
                  navigate('/admin');
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className="p-2 border border-white/5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              {adminUser ? <Unlock size={14} className="text-indigo-400" /> : <Lock size={14} />}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 border border-white/5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE ROUTING CONTENT ================= */}
      <main className="relative z-10">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isDark={isDark} 
                bioData={bioData} 
                skillsList={skillsList} 
                experienceHistory={experienceHistory} 
                setEditingType={() => {}}
                setEditBioData={() => {}}
                adminUser={adminUser}
              />
            } 
          />
          <Route path="/projects" element={<Projects isDark={isDark} projectsList={projectsList} />} />
          <Route path="/toolkit" element={<Toolkit isDark={isDark} />} />
          <Route path="/guestbook" element={<Guestbook isDark={isDark} />} />
          <Route path="/quest" element={<TerminalQuest isDark={isDark} />} />
          <Route 
            path="/admin" 
            element={
              <AdminDashboard 
                isDark={isDark} 
                adminUser={adminUser} 
                setAdminUser={setAdminUser}
                bioData={bioData} 
                setBioData={setBioData}
                projectsList={projectsList}
                setProjectsList={setProjectsList}
                skillsList={skillsList}
                setSkillsList={setSkillsList}
                experienceHistory={experienceHistory}
                setExperienceHistory={setExperienceHistory}
                triggerAdminLogin={() => setIsAdminLoginOpen(true)}
              />
            } 
          />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className={`border-t py-12 px-6 transition-all ${
        isDark ? 'border-white/5 bg-[#020408]' : 'border-slate-200 bg-slate-100'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1 font-mono text-[10px] text-gray-500">
            <p>© {new Date().getFullYear()} MukulMBR. All Rights Reserved.</p>
            <p>Built with React + TS + Tailwind + Firestore</p>
          </div>

          <div className="flex gap-4 text-gray-500">
            <a href="https://github.com/MukulMBR" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/mukulmbr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:mukulmbr@gmail.com" className="hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ================= RESUME PDF CUSTOMIZER MODAL ================= */}
      <AnimatePresence>
        {isResumeOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0" onClick={() => setIsResumeOpen(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border p-6 relative z-10 space-y-6 ${
                isDark ? 'bg-[#090d16] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-center space-y-1">
                <FileText className="w-8 h-8 mx-auto text-indigo-500" />
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Resume Compiler</h3>
                <p className="text-xs text-gray-500">Tailor and compile your PDF resume dynamically.</p>
              </div>

              <div className="space-y-4 text-left">
                {/* Focus select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Focus Area</label>
                  <select 
                    value={resumeFocus}
                    onChange={(e) => setResumeFocus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All-Round Experience (Default)</option>
                    <option value="frontend">Frontend & Angular Specialist</option>
                    <option value="fullstack">Full-Stack / Tech Lead Focus</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={includeSummary} 
                      onChange={(e) => setIncludeSummary(e.target.checked)} 
                      className="rounded border-white/5 bg-black text-indigo-600 focus:ring-0"
                    />
                    Include Executive Summary
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={includeCerts} 
                      onChange={(e) => setIncludeCerts(e.target.checked)} 
                      className="rounded border-white/5 bg-black text-indigo-600 focus:ring-0"
                    />
                    Include Certifications
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setIsResumeOpen(false)}
                  className="flex-1 px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCompileResume}
                  disabled={isCompiling}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isCompiling ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                  {isCompiling ? 'Compiling...' : 'Compile PDF'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADMIN LOGIN MODAL ================= */}
      <AnimatePresence>
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0" onClick={() => setIsAdminLoginOpen(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl border p-6 relative z-10 space-y-6 ${
                isDark ? 'bg-[#090d16] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-center space-y-2">
                <Lock className="w-8 h-8 mx-auto text-indigo-500" />
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Login Portal</h3>
                <p className="text-xs text-gray-500">
                  {firebaseConnected ? 'Sign in to edit your portfolio details globally.' : 'Connect your Firebase project to enable global sync.'}
                </p>
              </div>

              {!firebaseConnected ? (
                // --- FIREBASE CONFIGURATION FORM ---
                <form onSubmit={handleSaveConfig} className="space-y-4">
                  {configError && (
                    <p className="text-xs text-rose-500 font-semibold text-center bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                      {configError}
                    </p>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Firebase Web App Config</label>
                    <textarea 
                      required
                      rows={5}
                      value={firebaseConfigInput}
                      onChange={(e) => setFirebaseConfigInput(e.target.value)}
                      placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "...",\n  projectId: "...",\n  ...\n};`}
                      className="w-full p-2.5 bg-black/60 border border-white/5 rounded-xl font-mono text-[10px] text-gray-200 focus:outline-none focus:border-indigo-500/50 resize-none text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAdminLoginOpen(false)}
                      className="flex-1 px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              ) : (
                // --- EMAIL/PASSWORD LOGIN FORM ---
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {authError && (
                    <p className="text-xs text-rose-500 font-semibold text-center bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                      {authError}
                    </p>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                    <input 
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAdminLoginOpen(false)}
                      className="flex-1 px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>

                  <div className="text-center pt-2 border-t border-white/5">
                    <button 
                      type="button"
                      onClick={() => setFirebaseConnected(false)}
                      className="text-[10px] text-gray-500 hover:text-indigo-400 font-mono cursor-pointer"
                    >
                      Change Firebase Configuration
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
