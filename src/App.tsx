import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TermIcon, 
  Cpu, 
  Mail, 
  ArrowUpRight, 
  Code, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw, 
  Shield, 
  Award, 
  Calendar, 
  Sliders, 
  Trash2,
  BookOpen,
  Info,
  CheckCircle,
  Search,
  Star,
  GitFork,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  FileText,
  Command,
  Heart,
  Download
} from 'lucide-react';
import { 
  PROJECTS, 
  SKILLS_LIST, 
  EXPERIENCE_HISTORY, 
  REPOS_LIST
} from './constants';
import type { Project, SkillNode } from './constants';
import { Analytics } from '@vercel/analytics/react';

// ================= BRAND ICON SVGS =================
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MukulLogo = () => (
  <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="22" fill="url(#logo-grad)" />
    <path d="M28 68V32L50 48L72 32V68" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
    </defs>
  </svg>
);

// Animated Counter component
const Counter = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span ref={counterRef}>{count}</span>;
};

// ================= MAIN APP COMPONENT =================
function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  
  // Theme state: default to 'dark'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  // Sync theme with HTML document element
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // --- INTERACTIVE STATE HOOKS ---
  const [expandedRole, setExpandedRole] = useState<string | null>('Tata Consultancy Services (TCS)');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [matrixRainActive, setMatrixRainActive] = useState(false);

  // --- TOOLKIT SAAS CONFIG ---
  const [searchQuery, setSearchQuery] = useState('');
  const [toolkitCategory, setToolkitCategory] = useState<'all' | 'security' | 'formatting' | 'generators'>('all');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<'jwt' | 'json' | 'uuid' | 'qr' | 'regex' | 'password'>('jwt');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('toolkit-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync favorites
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('toolkit-favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // --- TOOLKIT LOGIC STATES ---
  // JWT
  const [jwtInput, setJwtInput] = useState('');
  const [jwtOutput, setJwtOutput] = useState<{ header: string; payload: string; error?: string }>({ header: '', payload: '' });
  // JSON
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  // UUID
  const [uuidCount, setUuidCount] = useState(3);
  const [uuidList, setUuidList] = useState<string[]>([]);
  // QR
  const [qrText, setQrText] = useState('https://mukulmbr.site');
  // Regex
  const [regexPattern, setRegexPattern] = useState('\\d+');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('My credentials include 4 cloud certificates and 2 awards.');
  // Password
  const [passLength, setPassLength] = useState(16);
  const [passOptions, setPassOptions] = useState({ upper: true, lower: true, nums: true, syms: true });
  const [generatedPass, setGeneratedPass] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Mouse coordinate state for parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Track active navigation element
  const [activeNavSection, setActiveNavSection] = useState('hero');

  // --- INITIALIZATIONS ---
  useEffect(() => {
    generateUUIDs(uuidCount);
    generatePassword();
  }, []);

  // Parallax Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 30;
        const y = (e.clientY - rect.top - rect.height / 2) / 30;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard Listeners (Ctrl+K, focus search, toolkit shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      
      // Escape closes palette
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsResumeOpen(false);
      }

      // Check if user is typing inside an input/textarea
      const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      if (isTyping) return;

      // "/" focuses search in Toolkit
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' });
        searchInputRef.current?.focus();
      }

      // Numbers 1 to 6 switches toolkit panels
      if (e.key >= '1' && e.key <= '6') {
        const tools: typeof activeTool[] = ['jwt', 'json', 'uuid', 'qr', 'regex', 'password'];
        const tool = tools[parseInt(e.key) - 1];
        if (tool) {
          e.preventDefault();
          setActiveTool(tool);
          addRecentTool(tool);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position to set sticky header glass backdrop and active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'toolkit', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveNavSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // JWT Decoder Logic
  const handleJwtDecode = (token: string) => {
    setJwtInput(token);
    addRecentTool('jwt');
    if (!token.trim()) {
      setJwtOutput({ header: '', payload: '' });
      return;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      setJwtOutput({ header: '', payload: '', error: 'Invalid JWT structure (must contain 3 parts separated by dots).' });
      return;
    }
    try {
      const headerDec = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const payloadDec = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setJwtOutput({
        header: JSON.stringify(JSON.parse(headerDec), null, 2),
        payload: JSON.stringify(JSON.parse(payloadDec), null, 2)
      });
    } catch (e) {
      setJwtOutput({ header: '', payload: '', error: 'Failed to decode base64 strings or parse JSON payload.' });
    }
  };

  // JSON Formatter Logic
  const handleJsonFormat = (val: string) => {
    setJsonInput(val);
    addRecentTool('json');
    setJsonError('');
    if (!val.trim()) {
      setJsonOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(val);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON format.');
    }
  };

  // UUID Generator Logic
  const generateUUIDs = (count: number) => {
    addRecentTool('uuid');
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    }
    setUuidList(list);
  };

  // Regex Match Logic
  const regexMatches = useMemo(() => {
    if (!regexPattern) return [];
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = [];
      let match;
      if (regexFlags.includes('g')) {
        while ((match = re.exec(regexText)) !== null) {
          matches.push({ index: match.index, length: match[0].length, text: match[0] });
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        match = re.exec(regexText);
        if (match) {
          matches.push({ index: match.index, length: match[0].length, text: match[0] });
        }
      }
      return matches;
    } catch (e) {
      return [];
    }
  }, [regexPattern, regexFlags, regexText]);

  // Highlighted Regex text rendering
  const renderRegexHighlights = () => {
    if (regexMatches.length === 0 || !regexPattern) return regexText;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    
    regexMatches.forEach((m, idx) => {
      if (m.index > lastIndex) {
        elements.push(regexText.substring(lastIndex, m.index));
      }
      elements.push(
        <span key={idx} className="bg-indigo-500/30 text-indigo-200 border-b border-indigo-400 font-semibold px-0.5 rounded">
          {m.text}
        </span>
      );
      lastIndex = m.index + m.length;
    });
    
    if (lastIndex < regexText.length) {
      elements.push(regexText.substring(lastIndex));
    }
    return elements;
  };

  // Password Generator Logic
  const generatePassword = () => {
    addRecentTool('password');
    let chars = '';
    if (passOptions.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (passOptions.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passOptions.nums) chars += '0123456789';
    if (passOptions.syms) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) {
      setGeneratedPass('');
      return;
    }
    let pass = '';
    for (let i = 0; i < passLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(pass);
  };

  // Password strength checker
  const passwordStrength = useMemo(() => {
    if (!generatedPass) return { text: 'Empty', color: 'bg-gray-700', score: 0 };
    let score = 0;
    if (generatedPass.length >= 12) score += 2;
    else if (generatedPass.length >= 8) score += 1;
    if (/[A-Z]/.test(generatedPass)) score += 1;
    if (/[0-9]/.test(generatedPass)) score += 1;
    if (/[^A-Za-z0-9]/.test(generatedPass)) score += 1;
    
    if (score >= 5) return { text: 'Very Strong', color: 'bg-emerald-500', score };
    if (score >= 4) return { text: 'Strong', color: 'bg-teal-500', score };
    if (score >= 3) return { text: 'Medium', color: 'bg-amber-500', score };
    return { text: 'Weak', color: 'bg-rose-500', score };
  }, [generatedPass]);

  // Copy helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Manage Toolkit State
  const addRecentTool = (id: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((t) => t !== id);
      return [id, ...filtered].slice(0, 3);
    });
  };

  const toolkitItems = [
    { id: 'jwt', name: 'JWT Decoder', category: 'security', desc: 'Decode base64 payload strings instantly.' },
    { id: 'json', name: 'JSON Formatter', category: 'formatting', desc: 'Indent, validate, and parse JSON formats.' },
    { id: 'uuid', name: 'UUID Generator', category: 'generators', desc: 'Create batches of v4 UUID hashes.' },
    { id: 'qr', name: 'QR Generator', category: 'generators', desc: 'Generate high-resolution QR codes.' },
    { id: 'regex', name: 'Regex Tester', category: 'security', desc: 'Match regular expressions dynamically.' },
    { id: 'password', name: 'Password Builder', category: 'generators', desc: 'Calculate passwords with configurable parameters.' }
  ];

  const filteredToolkitItems = useMemo(() => {
    // Sort so favorites are pinned first
    const sorted = [...toolkitItems].sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      return bFav - aFav;
    });

    return sorted.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = toolkitCategory === 'all' || t.category === toolkitCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, toolkitCategory, favorites]);

  // --- 3D CANVAS GALAXY LOGIC ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skillsRef = useRef<(SkillNode & { projX?: number; projY?: number })[]>(
    SKILLS_LIST.map((s, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / SKILLS_LIST.length);
      const theta = Math.sqrt(SKILLS_LIST.length * Math.PI) * phi;
      const radius = 170;
      return {
        ...s,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      };
    })
  );

  const velocity = useRef({ x: 0.004, y: 0.004 });
  const isMouseDown = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 500;
      canvas.height = 420;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const focalLength = 340;

      if (!isMouseDown.current) {
        velocity.current.x *= 0.98;
        velocity.current.y *= 0.98;
        if (Math.abs(velocity.current.x) < 0.001) velocity.current.x = 0.001;
        if (Math.abs(velocity.current.y) < 0.001) velocity.current.y = 0.001;
      }

      const radX = velocity.current.y;
      const radY = velocity.current.x;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      const items = skillsRef.current;

      ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(15, 23, 42, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 170, 0, Math.PI * 2);
      ctx.stroke();

      items.sort((a, b) => b.z - a.z);

      // Connective Highlights logic: Draw lines from hovered tag first so they render underneath text labels
      if (hoveredSkillName) {
        const hoveredObj = items.find(s => s.name === hoveredSkillName);
        if (hoveredObj) {
          items.forEach((item) => {
            if (hoveredObj.connectedWith?.includes(item.name)) {
              ctx.beginPath();
              // Calculate projection on current positions
              const scaleStart = focalLength / (focalLength + hoveredObj.z);
              const startX = hoveredObj.x * scaleStart + centerX;
              const startY = hoveredObj.y * scaleStart + centerY;
              
              const scaleEnd = focalLength / (focalLength + item.z);
              const endX = item.x * scaleEnd + centerX;
              const endY = item.y * scaleEnd + centerY;

              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.strokeStyle = theme === 'dark' ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.35)';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          });
        }
      }

      // Draw the nodes
      items.forEach((item) => {
        const x1 = item.x * cosY - item.z * sinY;
        const z1 = item.x * sinY + item.z * cosY;

        const y2 = item.y * cosX - z1 * sinX;
        const z2 = item.y * sinX + z1 * cosX;

        item.x = x1;
        item.y = y2;
        item.z = z2;

        const scale = focalLength / (focalLength + item.z);
        const projX = item.x * scale + centerX;
        const projY = item.y * scale + centerY;
        item.projX = projX;
        item.projY = projY;

        const alpha = Math.max(0.12, (focalLength - item.z) / (focalLength * 1.6));
        const fontSize = Math.max(10, Math.min(20, 13.5 * scale));
        
        const isSelected = selectedSkill?.name === item.name;
        const isHovered = hoveredSkillName === item.name;
        const isConnected = selectedSkill?.connectedWith?.includes(item.name) || (hoveredSkillName && items.find(s => s.name === hoveredSkillName)?.connectedWith?.includes(item.name));
        
        if (isHovered || isSelected) {
          ctx.fillStyle = '#6366F1';
        } else if (isConnected) {
          ctx.fillStyle = theme === 'dark' ? '#34D399' : '#059669';
        } else {
          // Dim other nodes if there is a focus
          const dimAlpha = (hoveredSkillName || selectedSkill) ? alpha * 0.35 : alpha;
          if (theme === 'dark') {
            ctx.fillStyle = item.level === 'Expert' ? `rgba(16, 185, 129, ${dimAlpha})` : `rgba(226, 232, 240, ${dimAlpha})`;
          } else {
            ctx.fillStyle = item.level === 'Expert' ? `rgba(5, 150, 105, ${dimAlpha})` : `rgba(15, 23, 42, ${dimAlpha})`;
          }
        }
        
        ctx.font = `600 ${fontSize}px var(--font-sans)`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, projX, projY);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleDown = (e: MouseEvent | TouchEvent) => {
      isMouseDown.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastMousePos.current = { x: clientX, y: clientY };
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isMouseDown.current) {
        const deltaX = clientX - lastMousePos.current.x;
        const deltaY = clientY - lastMousePos.current.y;
        velocity.current = { x: deltaX * 0.005, y: deltaY * 0.005 };
        lastMousePos.current = { x: clientX, y: clientY };
      } else {
        // Hover tag detection when NOT dragging
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        const focalLength = 340;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let matched: typeof skillsRef.current[0] | null = null;
        let minDistance = 22;

        skillsRef.current.forEach((item) => {
          const scale = focalLength / (focalLength + item.z);
          const projX = item.x * scale + centerX;
          const projY = item.y * scale + centerY;
          const dist = Math.hypot(clickX - projX, clickY - projY);
          if (dist < minDistance) {
            minDistance = dist;
            matched = item;
          }
        });
        if (matched) {
          setHoveredSkillName((matched as any).name);
          setSelectedSkill(matched);
        } else {
          setHoveredSkillName(null);
        }
      }
    };

    const handleUp = () => { isMouseDown.current = false; };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const focalLength = 340;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let clickedSkill: SkillNode | null = null;
      let minDistance = 25;

      skillsRef.current.forEach((item) => {
        const scale = focalLength / (focalLength + item.z);
        const projX = item.x * scale + centerX;
        const projY = item.y * scale + centerY;
        const dist = Math.hypot(clickX - projX, clickY - projY);
        if (dist < minDistance) {
          minDistance = dist;
          clickedSkill = item;
        }
      });
      if (clickedSkill) { setSelectedSkill(clickedSkill); }
    };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', handleDown);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleUp);
    };
  }, [selectedSkill, theme, hoveredSkillName]);

  // Command palette suggest list
  const commandPaletteItems = [
    { name: 'Jump to Career Overview', action: () => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Jump to Skills Galaxy', action: () => { document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Jump to Case Studies', action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Jump to SaaS Toolkit', action: () => { document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Jump to Contact CLI', action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Switch Theme (Dark / Light)', action: () => { setTheme(t => t === 'dark' ? 'light' : 'dark'); setIsCommandPaletteOpen(false); } },
    { name: 'Quick Preview Resume', action: () => { setIsResumeOpen(true); setIsCommandPaletteOpen(false); } },
    { name: 'Launch JWT Decoder Utility', action: () => { setActiveTool('jwt'); document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Launch JSON Formatter Utility', action: () => { setActiveTool('json'); document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } },
    { name: 'Launch UUID Generator Utility', action: () => { setActiveTool('uuid'); document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' }); setIsCommandPaletteOpen(false); } }
  ];

  const filteredCmdItems = useMemo(() => {
    return commandPaletteItems.filter(item => item.name.toLowerCase().includes(cmdSearchQuery.toLowerCase()));
  }, [cmdSearchQuery]);

  // Logo easter egg trigger
  const handleLogoClick = () => {
    setLogoClicks(c => {
      const next = c + 1;
      if (next >= 5) {
        setMatrixRainActive(true);
        setTimeout(() => setMatrixRainActive(false), 8000);
        return 0;
      }
      return next;
    });
  };

  // --- TERMINAL CONTACT STATE ---
  interface TerminalLine {
    text: string;
    type: 'input' | 'output' | 'error' | 'success';
  }
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "MukulMBR Interactive contact terminal v1.0.0", type: 'success' },
    { text: "Type 'help' to see list of available options.", type: 'output' },
    { text: "[Standby] Click the social icons on the left for the fastest way to get in touch!", type: 'output' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [contactStep, setContactStep] = useState<'idle' | 'name' | 'email' | 'message'>('idle');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = terminalInput.trim();
    if (!query) return;

    const newHistory = [...terminalHistory, { text: `> ${query}`, type: 'input' as const }];
    setTerminalInput('');

    if (contactStep === 'name') {
      setContactForm(prev => ({ ...prev, name: query }));
      setTerminalHistory([...newHistory, { text: `Enter your email address:`, type: 'output' }]);
      setContactStep('email');
      return;
    }

    if (contactStep === 'email') {
      setContactForm(prev => ({ ...prev, email: query }));
      setTerminalHistory([...newHistory, { text: `Enter your message:`, type: 'output' }]);
      setContactStep('message');
      return;
    }

    if (contactStep === 'message') {
      const finalForm = { ...contactForm, message: query };
      setContactForm({ name: '', email: '', message: '' });
      setContactStep('idle');
      setTerminalHistory([
        ...newHistory,
        { text: `Saving secure socket log...`, type: 'output' },
        { text: `Sending packet successfully to motakatlamukul67@gmail.com!`, type: 'success' },
        { text: `Thank you for reaching out, ${finalForm.name}. I'll get back to you shortly.`, type: 'success' }
      ]);
      return;
    }

    // Normal command execution
    const args = query.toLowerCase().split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'help':
        setTerminalHistory([
          ...newHistory,
          { text: "Available commands:", type: 'output' },
          { text: "  contact   -- start interactive message submission flow", type: 'output' },
          { text: "  about     -- read my quick engineering bio", type: 'output' },
          { text: "  github    -- open my github repository link", type: 'output' },
          { text: "  linkedin  -- open my professional linkedin link", type: 'output' },
          { text: "  clear     -- reset terminal output", type: 'output' },
          { text: "  matrix    -- trigger retro developer matrix easter egg", type: 'output' }
        ]);
        break;
      case 'clear':
        setTerminalHistory([]);
        break;
      case 'about':
        setTerminalHistory([
          ...newHistory,
          { text: "Hi, I'm Mukul Bushi Reddy M. I construct scalable client structures using React/TypeScript.", type: 'output' },
          { text: "Currently executing web solutions as a Frontend Engineer at Tata Consultancy Services.", type: 'output' }
        ]);
        break;
      case 'github':
        window.open('https://github.com/MukulMBR', '_blank');
        setTerminalHistory([...newHistory, { text: "Opening github.com/MukulMBR in a new tab.", type: 'success' }]);
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/in/mukul-bushi-reddy-m-0170471a2/', '_blank');
        setTerminalHistory([...newHistory, { text: "Opening LinkedIn portal link in a new tab.", type: 'success' }]);
        break;
      case 'matrix':
        setMatrixRainActive(true);
        setTimeout(() => setMatrixRainActive(false), 8000);
        setTerminalHistory([...newHistory, { text: "Matrix digital rain sequence activated.", type: 'success' }]);
        break;
      case 'contact':
        setContactStep('name');
        setTerminalHistory([
          ...newHistory,
          { text: "Initializing interactive contact flow...", type: 'output' },
          { text: "Enter your name:", type: 'output' }
        ]);
        break;
      default:
        setTerminalHistory([
          ...newHistory,
          { text: `Command not found: '${cmd}'. Type 'help' to view suggestions.`, type: 'error' }
        ]);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col min-h-screen relative w-full transition-colors duration-300 ${
      isDark ? 'bg-[#030712] text-gray-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Background container that clips any overflows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid Background Overlay */}
        <div className="absolute inset-0 grid-overlay"></div>

        {/* Dynamic Background Glow Lights */}
        <div className={`absolute top-[-10%] left-[-15%] w-[800px] h-[800px] rounded-full blur-[140px] transition-opacity duration-300 animate-pulse-glow ${
          isDark ? 'bg-indigo-600/10' : 'bg-indigo-600/5'
        }`}></div>
        <div className={`absolute bottom-[-10%] right-[-15%] w-[800px] h-[800px] rounded-full blur-[140px] transition-opacity duration-300 animate-pulse-glow ${
          isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/5'
        }`}></div>
      </div>

      {/* Retro Matrix Rain overlay easter egg */}
      {matrixRainActive && (
        <div className="fixed inset-0 z-50 bg-black/90 pointer-events-none font-mono text-[10px] text-emerald-500 overflow-hidden flex flex-wrap gap-2 p-4 leading-none select-none">
          {Array.from({ length: 480 }).map((_, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 800, opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 2.5 + Math.random() * 4, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="text-emerald-400 font-bold"
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-xl font-bold bg-black/80 px-6 py-3 border border-emerald-500/25 rounded-md tracking-widest text-emerald-400 uppercase">
              Easter Egg: Matrix sequence active
            </span>
          </div>
        </div>
      )}

      {/* ================= FIXED HEADER ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        isDark ? 'border-white/5 bg-[#030712]/80' : 'border-slate-200 bg-white/80'
      } backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleLogoClick} data-logo-clicks={logoClicks} className="flex items-center gap-2 group cursor-pointer focus:outline-none">
            <MukulLogo />
            <span className={`font-bold text-lg tracking-tight bg-gradient-to-r bg-clip-text text-transparent group-hover:text-indigo-500 transition-colors ${
              isDark ? 'from-white to-gray-400' : 'from-slate-900 to-slate-600'
            }`}>
              MukulMBR
            </span>
          </button>

          {/* Nav Links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-slate-500'
          }`}>
            <a href="#about" className={`nav-link hover:text-indigo-500 transition-colors ${activeNavSection === 'about' ? 'text-indigo-500 font-semibold' : ''}`}>Overview</a>
            <a href="#skills" className={`nav-link hover:text-indigo-500 transition-colors ${activeNavSection === 'skills' ? 'text-indigo-500 font-semibold' : ''}`}>Skills</a>
            <a href="#projects" className={`nav-link hover:text-indigo-500 transition-colors ${activeNavSection === 'projects' ? 'text-indigo-500 font-semibold' : ''}`}>Case Studies</a>
            <a href="#toolkit" className={`nav-link hover:text-indigo-500 transition-colors ${activeNavSection === 'toolkit' ? 'text-indigo-500 font-semibold' : ''}`}>Toolkit</a>
            <a href="#contact" className={`nav-link hover:text-indigo-500 transition-colors ${activeNavSection === 'contact' ? 'text-indigo-500 font-semibold' : ''}`}>Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Command Palette Button */}
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title="Open Command Palette (Ctrl+K)"
            >
              <Command size={14} />
              <span className="text-[10px] font-mono hidden sm:inline text-gray-500">Ctrl+K</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-white/5 text-yellow-400 hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            
            {/* Quick Resume Button */}
            <button
              onClick={() => setIsResumeOpen(true)}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-white/5 text-indigo-400 hover:bg-indigo-500/10' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-650 hover:bg-indigo-100'
              }`}
              title="Preview Resume Details"
            >
              <FileText size={14} />
              <span className="text-[10px] font-semibold hidden sm:inline">Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer offset for Fixed Header */}
      <div className="pt-20"></div>

      {/* Main Content Wrapper (Expands to fill vertical height, pushing footer to bottom) */}
      <main className="flex-grow">
        
        {/* ================= HERO SECTION ================= */}
        <section id="hero" ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Hero text */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold glass-card">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span className={isDark ? 'text-indigo-400' : 'text-indigo-650'}>Product & Frontend Engineer</span>
              </div>

              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                I build polished, <br />
                <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-400 bg-clip-text text-transparent">
                  production-quality
                </span> <br />
                web products.
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
                Hi, I’m Mukul Bushi Reddy M. I’m a Frontend Engineer with <Counter value={2} />+ years of enterprise experience at **Tata Consultancy Services**. I specialize in React, Angular, and TypeScript to implement performant web interfaces and interactive developer tooling.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#projects" 
                  className="px-6 py-3 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  Case Studies <ChevronRight size={16} />
                </a>
                <a 
                  href="#toolkit" 
                  className="px-6 py-3 rounded-lg text-sm font-semibold glass-card hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  Developer Toolkit <Zap size={16} className="text-indigo-400" />
                </a>
              </div>
            </div>

            {/* Hero IDE Code Simulator */}
            <div className="lg:col-span-5 w-full">
              <div className={`rounded-xl border shadow-2xl overflow-hidden font-mono text-xs ${
                isDark ? 'bg-[#05070c] border-white/5' : 'bg-white border-slate-200'
              }`}>
                {/* IDE Top Bar */}
                <div className={`px-4 py-2 border-b flex items-center justify-between ${
                  isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-gray-500">mukulmbr.ts</span>
                  <div className="w-8"></div>
                </div>

                {/* IDE Content */}
                <div className="p-4 space-y-2 text-[11px] leading-relaxed overflow-x-auto min-h-[220px]">
                  <div>
                    <span className="text-indigo-400">import</span> &#123; <span className="text-emerald-400">Engineer</span> &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-500">'mukulmbr'</span>;
                  </div>
                  <div>
                    <span className="text-indigo-400">const</span> dev = <span className="text-indigo-400">new</span> <span className="text-emerald-400">Engineer</span>(&#123;
                  </div>
                  <div className="pl-4">
                    name: <span className="text-emerald-500">'Mukul Bushi Reddy M'</span>,
                  </div>
                  <div className="pl-4">
                    role: <span className="text-emerald-500">'Frontend Developer'</span>,
                  </div>
                  <div className="pl-4">
                    experience: <span className="text-amber-500">2</span>, <span className="text-gray-500">// Years at TCS</span>
                  </div>
                  <div className="pl-4">
                    stack: [<span className="text-emerald-500">'Angular'</span>, <span className="text-emerald-500">'React'</span>, <span className="text-emerald-500">'TypeScript'</span>],
                  </div>
                  <div className="pl-4">
                    goal: <span className="text-emerald-500">'Build high-quality products'</span>
                  </div>
                  <div>
                    &#125;);
                  </div>
                  <div className="text-gray-500 mt-2">// Compilation: successful</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span>&gt;</span> npm run dev --ready (304ms)
                    <span className="w-1.5 h-3 bg-emerald-400 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Parallax Code Floating Grid */}
          <div 
            className="absolute inset-0 pointer-events-none z-0 hidden lg:block opacity-15 transition-transform duration-300"
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
          >
            <div className="absolute top-[18%] left-[8%] font-mono text-[10px] text-indigo-400/40 border border-indigo-400/20 px-2 py-1 rounded glass-card">
              const [state, setState] = useState()
            </div>
            <div className="absolute top-[18%] right-[10%] font-mono text-[10px] text-emerald-400/40 border border-emerald-400/20 px-2 py-1 rounded glass-card">
              &lt;div className="glass-card" /&gt;
            </div>
            <div className="absolute bottom-[20%] left-[12%] font-mono text-[10px] text-amber-400/40 border border-amber-400/20 px-2 py-1 rounded glass-card">
              RxJS: fromEvent(btn, 'click')
            </div>
          </div>
        </section>

        {/* ================= ABOUT & TIMELINE ================= */}
        <section id="about" className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Info size={14} /> Career Overview
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Engineering interfaces with high fidelity and zero clutter.
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>
              I specialize in bridging the gap between design mockups and structured frontend code. Having spent 2+ years shipping enterprise web systems at TCS across diverse domains (Banking, Retail, and Insurance), I focus heavily on component lifecycle optimizations.
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-655'}`}>
              My goal is to continuously master full-stack pipelines, building robust utilities and layouts that deliver client satisfaction.
            </p>

            <div className="p-4 rounded-xl border glass-card bg-indigo-500/5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Code size={12} /> Engineering Philosophy
              </h4>
              <p className={`text-xs leading-relaxed italic ${isDark ? 'text-gray-450' : 'text-slate-650'}`}>
                "I believe that visual polish and system performance are not optional decoration—they are core requirements. Software should execute cleanly, load instantly, and remain highly accessible under all viewport scales."
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl border glass-card">
                <span className="block text-2xl font-bold text-indigo-500">
                  <Counter value={2} />+ Years
                </span>
                <span className="text-xs text-gray-500">TCS Experience</span>
              </div>
              <div className="p-4 rounded-xl border glass-card">
                <span className="block text-2xl font-bold text-emerald-500">
                  <Counter value={4} />+ Major
                </span>
                <span className="text-xs text-gray-500">Shipped Repos</span>
              </div>
              <div className="p-4 rounded-xl border glass-card">
                <span className="block text-2xl font-bold text-indigo-500">
                  24 Y/O
                </span>
                <span className="text-xs text-gray-500">Born June 17, 2002</span>
              </div>
              <div className="p-4 rounded-xl border glass-card">
                <span className="block text-xl font-bold text-emerald-500 truncate" title="Bengaluru, IN">
                  Bengaluru
                </span>
                <span className="text-xs text-gray-500">Active Location</span>
              </div>
            </div>
          </div>

          {/* Expandable Experience Timeline Accordion */}
          <div className="space-y-6 relative">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Calendar size={14} /> Interactive Experience
            </div>

            {/* Vertical timeline grow indicator line */}
            <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-indigo-500/20 z-0"></div>

            <div className="space-y-4 pl-4 relative z-10">
              {EXPERIENCE_HISTORY.map((exp) => {
                const isExpanded = expandedRole === exp.company;
                return (
                  <div 
                    key={exp.company}
                    className={`rounded-2xl border transition-all ${
                      isExpanded 
                        ? 'glass-card border-indigo-500/20 bg-indigo-500/5' 
                        : 'glass-card border-white/5 hover:border-indigo-500/20'
                    }`}
                  >
                    {/* Title Toggle bar */}
                    <button
                      onClick={() => setExpandedRole(isExpanded ? null : exp.company)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div>
                        <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{exp.role}</h4>
                        <p className="text-xs text-gray-500">{exp.company} &bull; {exp.duration}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-indigo-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                    </button>

                    {/* Expanded detail list */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-xs text-gray-400">
                            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-3">
                              <div>
                                <span className="block text-[10px] font-bold text-gray-500 uppercase">Domains</span>
                                <span className="text-gray-300 font-medium">{exp.domain}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold text-gray-500 uppercase">Location</span>
                                <span className="text-gray-300 font-medium">{exp.location}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="block text-[10px] font-bold text-gray-500 uppercase">Core Responsibilities</span>
                              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                                {exp.achievements.map((item, index) => (
                                  <li key={index} className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-650'}`}>{item}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2 pt-2">
                              <span className="block text-[10px] font-bold text-gray-500 uppercase">Technologies Used</span>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.technologies.map((t) => (
                                  <span key={t} className="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Academic Entry */}
              <div className="p-6 rounded-2xl border border-white/5 glass-card space-y-2">
                <span className="text-[10px] font-mono text-gray-500">2019 -- 2023 &bull; Coimbatore, India</span>
                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>B.Tech in Computer Science</h4>
                <p className="text-xs text-indigo-400 font-semibold">Amrita Vishwa Vidyapeetham</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-slate-600'}`}>
                  Completed detailed courses in Computer Vision models, Database management index schemes, and Software Architecture patterns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SKILLS & 3D GALAXY ================= */}
        <section id="skills" className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Cpu size={14} /> Technology Ecosystem
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My Interactive Skill Galaxy
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              Drag, spin, or hover the orbiting 3D tag cloud below to explore my core technical tools, levels of expertise, and connected sibling frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 flex justify-center relative rounded-2xl glass-card overflow-hidden p-6">
              <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                isDark 
                  ? 'bg-black/40 border-white/5 text-gray-300' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 font-semibold shadow-sm'
              }`}>
                <Sliders size={10} /> Drag to Rotate / Hover to Inspect
              </div>
              <canvas ref={canvasRef} className="max-w-full cursor-grab active:cursor-grabbing" />
            </div>

            <div className="h-full flex flex-col justify-between">
              {selectedSkill ? (
                <motion.div 
                  key={selectedSkill.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-white/10 glass-card bg-indigo-950/5 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">Skill Details</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        selectedSkill.level === 'Expert' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                        selectedSkill.level === 'Proficient' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/25'
                      }`}>
                        {selectedSkill.level}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedSkill.name}</h3>
                      <p className="text-[10px] font-mono text-indigo-400 mt-1">{selectedSkill.yearsExp} Years of Experience</p>
                    </div>

                    <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{selectedSkill.desc}</p>

                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Projects Used In</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSkill.projectsUsedIn.map((p, idx) => (
                          <span 
                            key={idx} 
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                              isDark 
                                ? 'text-gray-200 bg-white/5 border-white/5' 
                                : 'text-slate-700 bg-slate-100 border-slate-200'
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedSkill(null)} 
                    className="w-full text-center text-xs text-gray-500 hover:text-indigo-400 mt-8 pt-4 border-t border-white/5 cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </motion.div>
              ) : (
                <div className="p-8 rounded-2xl border border-white/5 glass-card text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                  <Cpu size={32} className="text-indigo-500 animate-pulse mb-4" />
                  <h4 className="text-sm font-bold text-gray-450">Orbit highlights active</h4>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed mt-2">
                    Hover on any tech node to trace connection pathways to related modules and trigger detail cards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= FEATURED PROJECTS ================= */}
        <section id="projects" className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <BookOpen size={14} /> Case Studies
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Featured Product Case Studies
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Evolved layouts showcasing design choices, research investigations, architecture flows, and technical implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((p) => {
              // Highlight code if selectedSkill matches
              const isHighlighted = selectedSkill && p.languages.includes(selectedSkill.name);
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`group rounded-2xl border p-6 flex flex-col justify-between cursor-pointer glass-card transition-all hover:-translate-y-1 ${
                    isHighlighted ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20' : ''
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-indigo-500/10 text-indigo-400 border-indigo-500/25 uppercase">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-indigo-500 font-semibold group-hover:underline flex items-center gap-0.5">
                        View Full Case Study <ArrowUpRight size={10} />
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h3 className={`text-xl font-bold group-hover:text-indigo-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {p.title}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 block tracking-wider uppercase">The Problem</span>
                          <p className={`text-xs leading-relaxed transition-colors ${
                            isDark ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {p.challenge}
                          </p>
                        </div>
                        
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 block tracking-wider uppercase">Core Contribution</span>
                          <p className={`text-xs leading-relaxed transition-colors ${
                            isDark ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {p.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.languages.map((l) => (
                        <span 
                          key={l} 
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                            isDark 
                              ? 'text-gray-400 bg-white/5 border-white/5' 
                              : 'text-slate-600 bg-slate-100 border-slate-200'
                          }`}
                        >
                          {l}
                        </span>
                      ))}
                    </div>

                    {/* High-visibility Action Hooks */}
                    <div className="flex items-center justify-between text-xs font-mono font-semibold" onClick={(e) => e.stopPropagation()}>
                      {p.liveUrl ? (
                        <a 
                          href={p.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                        >
                          [ View Live App ]
                        </a>
                      ) : (
                        <span className="text-gray-500 font-normal">[ No Demo ]</span>
                      )}
                      
                      <a 
                        href={p.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
                      >
                        [ Source Code ]
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Case Study Slider Modal */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end"
              >
                <div className="absolute inset-0 z-0" onClick={() => setSelectedProject(null)}></div>
                
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className={`w-full max-w-xl border-l h-full overflow-y-auto relative z-10 p-8 flex flex-col justify-between ${
                    isDark ? 'bg-[#05070c] border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-6">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{selectedProject.category} Case Study</span>
                        <h3 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProject.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedProject.subtitle}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedProject(null)}
                        className="px-2.5 py-1 rounded text-xs font-semibold glass-card text-gray-400 hover:text-indigo-500 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    {/* Tech stack */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Technologies</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.languages.map((l) => (
                          <span key={l} className="text-xs font-mono text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Content */}
                    <div className={`space-y-6 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><Info size={14} className="text-indigo-500" /> Challenge</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.challenge}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><BookOpen size={14} className="text-purple-500" /> Research & Investigation</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.research}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><CheckCircle size={14} className="text-emerald-500" /> Solution</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.solution}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><Sliders size={14} className="text-amber-500" /> Key Challenges Faced</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.challenges}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><Zap size={14} className="text-blue-500" /> Performance Optimizations</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.performanceOptimizations}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><Award size={14} className="text-emerald-500" /> Business Impact & Lessons</h4>
                        <p className="text-xs leading-relaxed text-gray-400">{selectedProject.outcome}</p>
                        <p className="text-xs leading-relaxed text-indigo-400 italic mt-1">
                          Lessons: {selectedProject.lessonsLearned}
                        </p>
                        <p className="text-xs leading-relaxed text-emerald-500 font-semibold bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 mt-1">
                          Impact: {selectedProject.impact}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}><Code size={14} className="text-indigo-500" /> Architecture Flow</h4>
                        <div className="p-3 bg-black/60 border border-white/5 rounded-lg font-mono text-[10px] text-indigo-300">
                          {selectedProject.architecture}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="pt-6 mt-12 border-t border-white/5 flex items-center justify-end gap-3">
                    {selectedProject.liveUrl && (
                      <a 
                        href={selectedProject.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    )}
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-xs font-semibold glass-card hover:bg-white/5 text-gray-350 transition-all flex items-center gap-1.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5" /> Repository
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ================= DEVELOPER TOOLKIT ================= */}
        <section id="toolkit" className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="space-y-4 mb-16 text-center">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <TermIcon size={14} /> SaaS Utility Desk
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Developer Toolkit Workspace
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              Clean, instant frontend parsing and code generators running completely client-side. Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">/</kbd> to search or keys <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">1-6</kbd> to jump.
            </p>
          </div>

          <div className="space-y-6">
            {/* Controls Bar: Category tabs + Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 rounded-2xl border glass-card">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', name: 'All Utilities' },
                  { id: 'security', name: 'Security' },
                  { id: 'formatting', name: 'Formatters' },
                  { id: 'generators', name: 'Generators' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setToolkitCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      toolkitCategory === cat.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <span className="absolute left-3 top-2.5 text-gray-500">
                  <Search size={14} />
                </span>
                <input 
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools... (Press /)"
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            {/* Recently Used Widgets */}
            {recentlyUsed.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recently Used</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recentlyUsed.map((toolId) => {
                    const item = toolkitItems.find(t => t.id === toolId);
                    if (!item) return null;
                    return (
                      <button
                        key={toolId}
                        onClick={() => {
                          setActiveTool(toolId as any);
                          addRecentTool(toolId);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold glass-card flex items-center justify-between cursor-pointer ${
                          activeTool === toolId ? 'border-indigo-500/25 bg-indigo-500/5' : ''
                        }`}
                      >
                        <div>
                          <span className="block text-white font-bold">{item.name}</span>
                          <span className="text-[10px] text-gray-500 font-normal">{item.category}</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-500" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Core Toolkit Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left selector */}
              <div className="lg:col-span-1 space-y-2">
                {filteredToolkitItems.map((t) => {
                  const isFavorite = favorites.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTool(t.id as any);
                        addRecentTool(t.id);
                        setCopiedText(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        activeTool === t.id 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'glass-card text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span onClick={(e) => toggleFavorite(t.id, e)} className="hover:text-amber-400 cursor-pointer">
                          <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-amber-400' : 'text-gray-500'} />
                        </span>
                        {t.name}
                      </span>
                      <ChevronRight size={12} className={activeTool === t.id ? 'text-white' : 'text-gray-500'} />
                    </button>
                  );
                })}

                {filteredToolkitItems.length === 0 && (
                  <p className="text-xs text-gray-500 italic p-3 text-center">No tools found matching query.</p>
                )}
              </div>

              {/* Right Display Console */}
              <div className="lg:col-span-3 min-h-[380px] rounded-2xl border p-6 glass-card bg-[#05070c]/50 flex flex-col justify-between">
                
                {/* JWT Decoder */}
                {activeTool === 'jwt' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paste JWT Encoded Token</label>
                        <button 
                          onClick={() => handleJwtDecode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik11a3VsTUJSIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')}
                          className="text-[10px] text-indigo-400 hover:underline font-mono cursor-pointer"
                        >
                          Load Sample Token
                        </button>
                      </div>
                      <textarea 
                        value={jwtInput}
                        onChange={(e) => handleJwtDecode(e.target.value)}
                        placeholder="eyJhbGciOi..."
                        className="w-full h-24 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 resize-none"
                      />
                      
                      {jwtOutput.error && (
                        <div className="text-xs text-rose-500 font-mono bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg">
                          {jwtOutput.error}
                        </div>
                      )}

                      {!jwtOutput.error && jwtOutput.payload && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Header</span>
                            <pre className="p-3 bg-black/60 border border-white/5 rounded-lg font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-48">
                              {jwtOutput.header}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payload</span>
                            <pre className="p-3 bg-black/60 border border-white/5 rounded-lg font-mono text-[10px] text-indigo-300 overflow-x-auto max-h-48">
                              {jwtOutput.payload}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <button 
                        disabled={!jwtOutput.payload}
                        onClick={() => copyToClipboard(jwtOutput.payload, 'jwt-pay')}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        {copiedText === 'jwt-pay' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedText === 'jwt-pay' ? 'Copied' : 'Copy Payload'}
                      </button>
                    </div>
                  </div>
                )}

                {/* JSON Formatter */}
                {activeTool === 'json' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter Raw JSON String</label>
                        <button 
                          onClick={() => handleJsonFormat('{"name":"MukulMBR","role":"Frontend Engineer","skills":["React","Angular","TypeScript"]}')}
                          className="text-[10px] text-indigo-400 hover:underline font-mono cursor-pointer"
                        >
                          Load Sample JSON
                        </button>
                      </div>
                      <textarea 
                        value={jsonInput}
                        onChange={(e) => handleJsonFormat(e.target.value)}
                        placeholder='{"key": "value"}'
                        className="w-full h-24 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 resize-none"
                      />

                      {jsonError && (
                        <div className="text-xs text-rose-500 font-mono bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg">
                          {jsonError}
                        </div>
                      )}

                      {!jsonError && jsonOutput && (
                        <div className="space-y-2">
                          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Formatted Output</span>
                          <pre className="p-3 bg-black/60 border border-white/5 rounded-lg font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-48">
                            {jsonOutput}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                      <button 
                        disabled={!jsonInput}
                        onClick={() => { setJsonInput(''); setJsonOutput(''); setJsonError(''); }}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:text-rose-400 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        <Trash2 size={12} /> Clear
                      </button>
                      <button 
                        disabled={!jsonOutput}
                        onClick={() => copyToClipboard(jsonOutput, 'json-format')}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        {copiedText === 'json-format' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedText === 'json-format' ? 'Copied' : 'Copy Output'}
                      </button>
                    </div>
                  </div>
                )}

                {/* UUID Generator */}
                {activeTool === 'uuid' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">UUID v4 Batch Generator</label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-mono">Count:</span>
                          <input 
                            type="number"
                            min="1"
                            max="10"
                            value={uuidCount}
                            onChange={(e) => {
                              const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                              setUuidCount(val);
                              generateUUIDs(val);
                            }}
                            className="w-12 px-2 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono focus:outline-none text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {uuidList.map((id, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-indigo-300">
                            <span>{id}</span>
                            <button 
                              onClick={() => copyToClipboard(id, `uuid-${idx}`)}
                              className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedText === `uuid-${idx}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <button 
                        onClick={() => generateUUIDs(uuidCount)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={12} /> Regenerate
                      </button>
                    </div>
                  </div>
                )}

                {/* QR Generator */}
                {activeTool === 'qr' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Enter Text / URL for QR Code</label>
                      <input 
                        type="text"
                        value={qrText}
                        onChange={(e) => { setQrText(e.target.value); addRecentTool('qr'); }}
                        placeholder="https://example.com"
                        className="w-full p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50"
                      />

                      {qrText.trim() && (
                        <div className="flex justify-center pt-4">
                          <div className="p-4 bg-white rounded-xl shadow-lg inline-block">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=155x155&data=${encodeURIComponent(qrText)}`}
                              alt="QR Code"
                              className="w-36 h-36 border-0 block"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <a 
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/5 hover:bg-white/10 text-gray-200 transition-all flex items-center gap-1.5"
                      >
                        Open QR Image <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Regex Tester */}
                {activeTool === 'regex' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expression Pattern</label>
                          <input 
                            type="text"
                            value={regexPattern}
                            onChange={(e) => { setRegexPattern(e.target.value); addRecentTool('regex'); }}
                            placeholder="e.g. \d+"
                            className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-indigo-500/50"
                          />
                        </div>
                        <div className="col-span-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Flags</label>
                          <input 
                            type="text"
                            value={regexFlags}
                            onChange={(e) => { setRegexFlags(e.target.value); addRecentTool('regex'); }}
                            placeholder="g, i, m"
                            className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none focus:border-indigo-500/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Test String</label>
                        <textarea 
                          value={regexText}
                          onChange={(e) => { setRegexText(e.target.value); addRecentTool('regex'); }}
                          className="w-full h-16 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Match Result Preview</span>
                        <div className="p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-450 overflow-x-auto min-h-[50px] leading-relaxed">
                          {renderRegexHighlights()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end text-xs text-gray-500 font-mono">
                      Found {regexMatches.length} matches
                    </div>
                  </div>
                )}

                {/* Password Builder */}
                {activeTool === 'password' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Password Generator</label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-mono">Length: {passLength}</span>
                          <input 
                            type="range"
                            min="8"
                            max="32"
                            value={passLength}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPassLength(val);
                            }}
                            className="w-24 accent-indigo-500 h-1 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-black/40 border border-white/5 rounded-xl">
                        {[
                          { id: 'lower', name: 'lowercase' },
                          { id: 'upper', name: 'UPPERCASE' },
                          { id: 'nums', name: 'Numbers (0-9)' },
                          { id: 'syms', name: 'Symbols' }
                        ].map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={passOptions[opt.id as keyof typeof passOptions]}
                              onChange={(e) => {
                                const updated = { ...passOptions, [opt.id]: e.target.checked };
                                setPassOptions(updated);
                              }}
                              className="rounded border-white/10 text-indigo-600 focus:ring-0 bg-black"
                            />
                            {opt.name}
                          </label>
                        ))}
                      </div>

                      {generatedPass && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-sm text-indigo-300">
                            <span className="break-all">{generatedPass}</span>
                            <button 
                              onClick={() => copyToClipboard(generatedPass, 'pwd-gen')}
                              className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedText === 'pwd-gen' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-gray-500">STRENGTH:</span>
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">{passwordStrength.text}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <button 
                        onClick={generatePassword}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={12} /> Regenerate
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ================= GITHUB SHOWCASE SECTION ================= */}
        <section className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="space-y-4 mb-16 text-center">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <GithubIcon className="w-4 h-4" /> Open Source Activity
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              GitHub Portfolio & Stats
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              A visual overview of my active repositories, code languages, and mock version control contribution streak.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side repository list */}
            <div className="lg:col-span-7 space-y-4">
              {REPOS_LIST.map((repo) => (
                <div key={repo.name} className="p-5 rounded-2xl border glass-card flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <a 
                        href={`https://github.com/MukulMBR/${repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold hover:text-indigo-500 transition-colors flex items-center gap-1.5 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {repo.name} <ExternalLink size={12} />
                      </a>
                      <span className="text-[10px] font-mono text-gray-500">{repo.percent} {repo.lang}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{repo.desc}</p>
                  </div>

                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: repo.percent }}></div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><Star size={10} /> {repo.stars} Stars</span>
                    <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forks} Forks</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side animated mock git contribution graph */}
            <div className="lg:col-span-5 p-6 rounded-2xl border glass-card space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">Contribution Graph</span>
                <h3 className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>365 Day Matrix Activity</h3>
                <p className="text-xs text-gray-500 mt-1">Directly visualizes active version control commits and deployment status hooks.</p>
              </div>

              {/* Grid of days */}
              <div className="grid grid-cols-20 gap-1 overflow-x-auto py-2">
                {Array.from({ length: 140 }).map((_, idx) => {
                  const contribTypes = [
                    'bg-gray-800/20 border-white/5', 
                    'bg-emerald-950 border-emerald-900/40', 
                    'bg-emerald-800 border-emerald-700/40', 
                    'bg-emerald-600 border-emerald-500/40', 
                    'bg-emerald-400 border-emerald-300/40'
                  ];
                  // Generate visual random commit distribution pattern
                  let shadeIdx = 0;
                  const r = Math.random();
                  if (r > 0.88) shadeIdx = 4;
                  else if (r > 0.72) shadeIdx = 3;
                  else if (r > 0.50) shadeIdx = 2;
                  else if (r > 0.25) shadeIdx = 1;

                  return (
                    <div 
                      key={idx}
                      className={`w-3.5 h-3.5 rounded border ${contribTypes[shadeIdx]} transition-all hover:scale-110 cursor-pointer`}
                      title={`${shadeIdx * 2} commits on day ${idx + 1}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-4 border-t border-white/5">
                <span>Streak: 45 Days</span>
                <span className="flex items-center gap-1"><Heart size={10} className="text-rose-500" /> 1,248 Commits This Year</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CREDENTIALS & AWARDS ================= */}
        <section className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Award size={14} /> TCS Recognition
            </div>
            <h3 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Professional Awards</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Consistently recognized during my tenure at Tata Consultancy Services (TCS) for delivery excellence and team execution.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl border glass-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <Award size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Applause for Team Award</h4>
                  <p className="text-xs text-gray-500">Tata Consultancy Services</p>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-gray-450' : 'text-slate-600'}`}>
                    Presented for milestones in Angular e-commerce applications and collaborative delivery with UI designers.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border glass-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <Award size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>On the Spot Award</h4>
                  <p className="text-xs text-gray-500">Tata Consultancy Services</p>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-gray-455' : 'text-slate-600'}`}>
                    Presented for resolving critical interface styling tickets swiftly, minimizing business disruption during production upgrades.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
              <Shield size={14} /> Cloud Certification
            </div>
            <h3 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Google Cloud Credentials</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Acquired fundamental baseline infrastructure and cloud management credentials from Google Cloud Training.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Baseline Infrastructure', desc: 'Google Cloud Training' },
                { title: 'Secure Networks Setup', desc: 'Google Cloud Training' },
                { title: 'Resource Management', desc: 'Google Cloud Training' },
                { title: 'GCP Fundamentals', desc: 'Google Cloud Training' }
              ].map((cert, idx) => (
                <div key={idx} className="p-4 rounded-xl border glass-card flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{cert.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className={`py-24 px-6 border-t relative z-10 max-w-6xl mx-auto ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                <Mail size={14} /> Contact Details
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Let's build something exceptional.
              </h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-605'}`}>
                Connect with me to talk through product engineering, frontend design architectures, or contract roles. You can type commands in the interactive shell to establish instant web socket logs.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a 
                  href="https://github.com/MukulMBR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:scale-115 active:scale-95 ${
                    isDark 
                      ? 'border-white/10 bg-white/5 text-gray-200 hover:text-indigo-400 hover:border-indigo-500/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-indigo-650 hover:border-indigo-600/30 shadow-sm'
                  }`}
                >
                  <GithubIcon className="w-5.5 h-5.5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/mukul-bushi-reddy-m-0170471a2/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:scale-115 active:scale-95 ${
                    isDark 
                      ? 'border-white/10 bg-white/5 text-gray-200 hover:text-indigo-400 hover:border-indigo-500/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-indigo-650 hover:border-indigo-600/30 shadow-sm'
                  }`}
                >
                  <LinkedinIcon className="w-5.5 h-5.5" />
                </a>
                <a 
                  href="mailto:motakatlamukul67@gmail.com" 
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:scale-115 active:scale-95 ${
                    isDark 
                      ? 'border-white/10 bg-white/5 text-gray-200 hover:text-indigo-400 hover:border-indigo-500/30' 
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-indigo-650 hover:border-indigo-600/30 shadow-sm'
                  }`}
                >
                  <Mail className="w-5.5 h-5.5" />
                </a>
              </div>
            </div>

            {/* Interactive Terminal Contact Form CLI */}
            <div className="rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-xs bg-black/85 flex flex-col justify-between h-[280px]">
              {/* Terminal top header */}
              <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-[10px] text-gray-500">contact-shell.sh</span>
                <div className="w-8"></div>
              </div>

              {/* Terminal Logs body */}
              <div ref={terminalScrollRef} className="p-4 space-y-1.5 overflow-y-auto flex-1 text-[11px] leading-relaxed">
                {terminalHistory.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`${
                      line.type === 'input' ? 'text-indigo-300' :
                      line.type === 'error' ? 'text-rose-450 font-bold' :
                      line.type === 'success' ? 'text-emerald-400 font-semibold' :
                      'text-gray-300'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Terminal command form input */}
              <form onSubmit={handleTerminalSubmit} className="border-t border-white/5 bg-black/20 p-2 flex items-center">
                <span className="text-indigo-400 font-semibold mr-1.5">&gt;</span>
                <input 
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder={contactStep !== 'idle' ? "type here..." : "type 'help' to start..."}
                  className="flex-1 bg-transparent border-none text-indigo-200 font-mono text-xs focus:outline-none placeholder-gray-700"
                />
                <span className="w-1.5 h-3 bg-indigo-500 animate-pulse"></span>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className={`border-t py-12 px-6 relative z-10 ${
        isDark ? 'border-white/5 bg-black/35' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MukulLogo />
            <span className={`font-bold text-sm tracking-tight whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-slate-800'}`}>
              mukulmbr.site &copy; 2026
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
            <span>Thanks for visiting. Let's build something exceptional together</span>
            <span className="w-1 h-3 bg-gray-500 animate-pulse ml-0.5"></span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono">
            <a href="#hero" className="hover:text-indigo-500">Back To Top</a>
            <span>&bull;</span>
            <span>Designed & Coded by Mukul Bushi Reddy M</span>
            <span>&bull;</span>
            <span className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-bold font-mono">
              v2.5.4 (Build: 537592a)
            </span>
          </div>
        </div>
      </footer>

      {/* ================= COMMAND PALETTE MODAL ================= */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0" onClick={() => setIsCommandPaletteOpen(false)}></div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden relative z-10 ${
                isDark ? 'bg-[#090d16] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className="p-3 border-b border-white/5 flex items-center gap-2">
                <Search size={16} className="text-gray-500" />
                <input 
                  type="text"
                  value={cmdSearchQuery}
                  onChange={(e) => setCmdSearchQuery(e.target.value)}
                  placeholder="Type a command or jump location..."
                  className="w-full bg-transparent border-none text-xs focus:outline-none placeholder-gray-600"
                  autoFocus
                />
              </div>

              <div className="p-2 max-h-64 overflow-y-auto space-y-1">
                {filteredCmdItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer text-gray-400"
                  >
                    {item.name}
                  </button>
                ))}
                {filteredCmdItems.length === 0 && (
                  <p className="text-xs text-gray-500 italic p-3 text-center">No commands match your query.</p>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-white/5 bg-black/20 flex justify-between text-[9px] text-gray-500 font-mono">
                <span>ESC to close</span>
                <span>Enter to select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= RESUME QUICK PREVIEW MODAL ================= */}
      <AnimatePresence>
        {isResumeOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0" onClick={() => setIsResumeOpen(false)}></div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`w-full max-w-2xl h-[90vh] rounded-2xl border shadow-2xl overflow-hidden relative z-10 flex flex-col justify-between ${
                isDark ? 'bg-[#05070c] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-indigo-500" />
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>MukulMBR_Resume.pdf</h3>
                    <p className="text-[10px] text-gray-500">Interactive PDF Quick Viewer</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsResumeOpen(false)}
                  className="px-2.5 py-1 rounded text-xs font-semibold glass-card text-gray-400 hover:text-indigo-500 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* PDF Content Mock Render (highly readable layout) */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs text-gray-400 select-text leading-relaxed">
                
                {/* Header info */}
                <div className="text-center space-y-1 pb-4 border-b border-white/5">
                  <h2 className="text-lg font-bold text-white">Mukul Bushi Reddy M</h2>
                  <p className="text-indigo-400">Frontend Engineer &bull; motakatlamukul67@gmail.com &bull; +91 8660341774</p>
                  <p className="text-gray-500 font-mono">github.com/MukulMBR &bull; linkedin.com/in/mukul-bushi-reddy-m-0170471a2</p>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Executive Summary</h4>
                  <p className="text-gray-300">
                    Frontend Engineer with 2+ years of enterprise experience at Tata Consultancy Services (TCS) delivering high-fidelity interfaces for global retail and banking systems. Highly proficient in Angular, React, TypeScript, and micro-interaction optimization.
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Work Experience</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold text-white">
                      <span>Tata Consultancy Services (TCS) &bull; Frontend Engineer</span>
                      <span>June 2024 -- Present</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1.5 text-gray-300">
                      <li>Designed and maintained responsive web layouts using Angular, TypeScript, and RxJS.</li>
                      <li>Optimized state selectors in large e-commerce portfolios, reducing bundle sizes and payload rendering delays.</li>
                      <li>Collaborated with design stakeholders to implement premium CSS tokens and brand micro-interactions.</li>
                    </ul>
                  </div>
                </div>

                {/* Certificates */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Certifications</h4>
                  <ul className="list-disc list-inside space-y-1 pl-1.5 text-gray-300">
                    <li>Google Cloud Training: GCP Fundamentals, Baseline Infrastructure, Secure Networks, Resource Management.</li>
                  </ul>
                </div>

                {/* Projects */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Featured Projects</h4>
                  <div className="space-y-2">
                    <div className="font-semibold text-white">Sadhvi Grains Storefront (B2B/D2C E-commerce)</div>
                    <p className="text-gray-300 pl-1.5">Built segmented state funnels using React and Vite, letting wholesale distributors check out bulk grain tons via automated WhatsApp invoice builders.</p>
                    <div className="font-semibold text-white">Mern Employee Manager (Workplace Administration Directory)</div>
                    <p className="text-gray-300 pl-1.5">Engineered secure employee databases utilizing Mongoose schemas, secure HttpOnly cookie authentications, and auditing logs.</p>
                  </div>
                </div>

              </div>

              {/* Action bar */}
              <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">Format: PDF (Digital Version)</span>
                <a 
                  href="https://github.com/MukulMBR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
                >
                  <Download size={12} /> Download PDF Copy
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Analytics />
    </div>
  );
}

export default App;
