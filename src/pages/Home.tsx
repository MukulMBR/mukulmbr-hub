import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TermIcon, 
  Briefcase, 
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Code
} from 'lucide-react';
import { submitContactMessage, logAnalyticsEvent } from '../lib/firebase';

interface HomeProps {
  isDark: boolean;
  bioData: any;
  skillsList: any[];
  experienceHistory: any[];
  setEditingType: (type: string | null) => void;
  setEditBioData: (data: any) => void;
  adminUser: any;
}

export default function Home({
  isDark,
  bioData,
  skillsList,
  experienceHistory,
  setEditingType,
  setEditBioData,
  adminUser
}: HomeProps) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Type "help" for a list of available commands.',
    'Or type "quest" to start the terminal coding adventure!'
  ]);
  const [typedRole, setTypedRole] = useState('');
  const [whatsappRedirect, setWhatsappRedirect] = useState<{ name: string; msg: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Log page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page: 'home' });
  }, []);

  // Handle hash scroll on load or hash change
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, []);

  // Role Typing Effect
  useEffect(() => {
    const roles = ['Frontend Architect', 'Product Engineer', 'Interface Builder', 'Creative Coder'];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer: any;

    const tick = () => {
      const currentRole = roles[roleIdx];
      if (!isDeleting) {
        setTypedRole(currentRole.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentRole.length) {
          isDeleting = true;
          timer = setTimeout(tick, 1800);
        } else {
          timer = setTimeout(tick, 75);
        }
      } else {
        setTypedRole(currentRole.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 35);
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  // 3D GitHub Skyline Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0.4;
    let angleY = -0.6;
    let targetAngleX = 0.4;
    let targetAngleY = -0.6;

    // Generate contribution matrix (7 x 22)
    const seed = 42;
    const lcg = (s: number) => {
      let temp = s;
      return () => {
        temp = (temp * 1664525 + 1013904223) % 4294967296;
        return temp / 4294967296;
      };
    };
    const random = lcg(seed);
    const grid: number[][] = [];
    for (let i = 0; i < 7; i++) {
      grid[i] = [];
      for (let j = 0; j < 22; j++) {
        const randVal = random();
        grid[i][j] = randVal > 0.85 ? Math.floor(random() * 5) : randVal > 0.6 ? 1 : 0;
      }
    }

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetAngleY = -0.6 + (x / rect.width) * 0.4;
      targetAngleX = 0.4 + (y / rect.height) * 0.4;
    };

    const handleCanvasMouseLeave = () => {
      targetAngleX = 0.4;
      targetAngleY = -0.6;
    };

    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);

    const render = () => {
      // Interpolate angles
      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cellW = 14;
      const cellH = 14;
      const gap = 4;
      const offsetX = canvas.width / 2 - 50;
      const offsetY = canvas.height / 2 + 30;

      // Isometric projection helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around X axis
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const rY1 = y * cosX - z * sinX;
        const rZ1 = y * sinX + z * cosX;

        // Rotate around Y axis
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const rX2 = x * cosY + rZ1 * sinY;

        return {
          x: offsetX + rX2,
          y: offsetY + rY1
        };
      };

      // Draw grid in back-to-front order
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 22; j++) {
          const val = grid[i][j];
          const x = (i - 3.5) * (cellW + gap);
          const z = (j - 11) * (cellH + gap);
          const h = val * 8 + 2; // Height of 3D column

          // Coordinates of 3D box corners
          const b0 = project(x, 0, z);
          const b2 = project(x + cellW, 0, z + cellH);
          const b3 = project(x, 0, z + cellH);

          const t0 = project(x, -h, z);
          const t1 = project(x + cellW, -h, z);
          const t2 = project(x + cellW, -h, z + cellH);
          const t3 = project(x, -h, z + cellH);

          // Colors based on contribution value
          let topColor = '#161b22';
          let sideColor1 = '#0e1117';
          let sideColor2 = '#090b0f';

          if (val === 1) {
            topColor = '#0e4429';
            sideColor1 = '#0a301d';
            sideColor2 = '#072114';
          } else if (val === 2) {
            topColor = '#006d32';
            sideColor1 = '#004d23';
            sideColor2 = '#003317';
          } else if (val === 3) {
            topColor = '#26a641';
            sideColor1 = '#1b742e';
            sideColor2 = '#124e1f';
          } else if (val === 4) {
            topColor = '#39d353';
            sideColor1 = '#28943a';
            sideColor2 = '#1a6327';
          }

          // Draw Left Side
          ctx.fillStyle = sideColor1;
          ctx.beginPath();
          ctx.moveTo(b0.x, b0.y);
          ctx.lineTo(b3.x, b3.y);
          ctx.lineTo(t3.x, t3.y);
          ctx.lineTo(t0.x, t0.y);
          ctx.closePath();
          ctx.fill();

          // Draw Right Side
          ctx.fillStyle = sideColor2;
          ctx.beginPath();
          ctx.moveTo(b3.x, b3.y);
          ctx.lineTo(b2.x, b2.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.lineTo(t3.x, t3.y);
          ctx.closePath();
          ctx.fill();

          // Draw Top Face
          ctx.fillStyle = topColor;
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.lineTo(t3.x, t3.y);
          ctx.closePath();
          ctx.fill();
          
          // Sleek neon glow outline for highest contribution pillars
          if (val >= 3) {
            ctx.strokeStyle = 'rgba(57, 211, 83, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
    };
  }, []);

  // Terminal input handler
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, `> ${terminalInput}`];
    setTerminalInput('');

    if (cmd === 'help') {
      newHistory.push(
        'Available commands:',
        '  bio        - Display professional summary',
        '  skills     - List technical skill stack',
        '  contact    - Send an email/message directly',
        '  clear      - Clear the terminal history',
        '  quest      - Start the interactive CLI quest'
      );
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      return;
    } else if (cmd === 'bio') {
      newHistory.push(
        `Name: ${bioData.name}`,
        `Role: ${bioData.role}`,
        `Experience: ${bioData.experience} years at TCS`,
        `Location: ${bioData.location}`
      );
    } else if (cmd === 'skills') {
      newHistory.push('Technical Stack:', ...skillsList.map(s => `  * ${s.name} (${s.level}%)` + (s.desc ? ` - ${s.desc}` : '')));
    } else if (cmd === 'quest') {
      newHistory.push(
        'Redirecting to quest deck...',
        'Please click the CLI Quest link in the header or type "/quest" in the URL bar to launch!'
      );
    } else if (cmd.startsWith('contact ')) {
      const parts = cmd.substring(8).split(':');
      if (parts.length < 2) {
        newHistory.push('Usage: contact [Your Name]:[Your Message]');
      } else {
        const senderName = parts[0].trim();
        const messageBody = parts[1].trim();
        newHistory.push(`Sending message from ${senderName}...`);
        await submitContactMessage(senderName, "cli-user@mukulmbr.dev", messageBody);
        newHistory.push('Message saved to Firestore! Click the "Forward to WhatsApp" link below if you want to forward it.');
        setWhatsappRedirect({ name: senderName, msg: messageBody });
      }
    } else {
      newHistory.push(`Command not found: "${cmd}". Type "help" for a list of commands.`);
    }

    setTerminalHistory(newHistory);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="space-y-24 pb-24">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-24">
        {/* Glowing background aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl space-y-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" /> Welcome to my Engineering Hub
          </div>

          <h1 className={`text-4xl sm:text-7xl font-extrabold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Hi, I am <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{bioData.name}</span>
          </h1>

          <div className="h-8 flex items-center justify-center gap-2">
            <span className={`text-lg sm:text-2xl font-mono ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              I build <span className="text-indigo-400 font-bold">{typedRole}</span>
            </span>
            <span className="w-1.5 h-6 bg-indigo-500 animate-pulse"></span>
          </div>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Frontend Architect specializing in designing premium interactive interfaces, high-performance web applications, and immersive experiences with zero visual clutter.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="#about"
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              Explore Experience <ChevronRight size={14} />
            </a>
            <a 
              href="#contact"
              className="px-6 py-3 rounded-xl text-xs font-semibold glass-card hover:bg-white/5 text-gray-350 transition-all border border-white/5 flex items-center gap-1.5 cursor-pointer"
            >
              Get in Touch <Send size={12} />
            </a>
          </div>
        </div>

        {/* 3D GitHub Skyline Canvas Grid */}
        <div className="mt-16 relative z-10 w-full max-w-3xl aspect-[16/9] flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="w-full max-w-[800px] aspect-[16/9] cursor-grab active:cursor-grabbing rounded-2xl border border-white/5 glass-card shadow-2xl"
          />
          <div className="absolute bottom-4 right-4 z-20 text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            3D Contribution Skyline (Tilt Mouse)
          </div>
        </div>
      </section>

      {/* ================= ABOUT & TIMELINE ================= */}
      <section id="about" className="px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-6 relative">
          {adminUser && (
            <button 
              onClick={() => { setEditBioData(bioData); setEditingType('bio'); }}
              className="absolute top-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              Edit Bio
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
            <Info size={14} /> Career Overview
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Engineering interfaces with high fidelity and zero clutter.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {bioData.bioText1}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {bioData.bioText2}
          </p>

          <div className="p-4 rounded-xl border border-indigo-500/10 glass-card bg-indigo-500/5">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Code size={12} /> Engineering Philosophy
            </h4>
            <p className="text-xs leading-relaxed italic text-gray-450">
              "Simple is hard. It requires peeling back layers of complexity to design an interface that feels completely natural, responsive, and lightweight."
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-1.5 text-purple-500 text-xs font-bold uppercase tracking-wider">
            <Briefcase size={14} /> Experience & Milestones
          </div>
          <div className="relative border-l border-white/5 pl-6 ml-2 space-y-12">
            {experienceHistory?.map((item, index) => (
              <div key={index} className="relative space-y-2">
                {/* Bullet node */}
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-indigo-500 bg-black flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                </span>
                <span className="text-[10px] font-bold text-indigo-400 font-mono">{item.period}</span>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.role} <span className="text-gray-500 font-normal">at {item.company}</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.skills?.map((s: string) => (
                    <span key={s} className="text-[9px] font-mono text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SKILLS STACK ================= */}
      <section className="px-6 max-w-6xl mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
            <Code size={14} /> Technology Stack
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Skill Inventory
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            A comprehensive overview of my core engineering capabilities, frameworks, and system architectures.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {skillsList?.map((skill, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-white/5 glass-card space-y-3">
              <span className="text-xs font-bold text-white block">{skill.name}</span>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{skill.level}% Expertise</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RETRO TERMINAL CONTACT ================= */}
      <section id="contact" className="px-6 max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TermIcon size={14} /> Interactive Contact Shell
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Say Hello
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Use the command line terminal below to send me a message directly, or trigger the CLI quest!
          </p>
        </div>

        {/* Terminal Container */}
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#090d16] font-mono text-xs text-emerald-400 border-indigo-500/10">
          {/* Header */}
          <div className="px-4 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] text-emerald-500/40 font-bold">mukul-terminal-v1.0.sh</span>
            <span className="w-4"></span>
          </div>

          {/* Screen */}
          <div className="p-4 h-64 overflow-y-auto space-y-2 select-text scrollbar-thin scrollbar-thumb-white/5 text-emerald-400/90 bg-black/40">
            {terminalHistory.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                {line}
              </div>
            ))}
            <div ref={terminalEndRef}></div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleTerminalSubmit} className="px-4 py-3 border-t border-white/5 bg-[#05070d] flex items-center gap-2">
            <span className="text-emerald-400 font-bold animate-pulse">&gt;</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder='Type a command (e.g. "help", "bio", "contact [Name]:[Msg]")'
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-emerald-850/20 font-mono focus:ring-0 focus:outline-none"
            />
            <button type="submit" className="text-emerald-500 hover:text-white transition-colors cursor-pointer">
              <Send size={14} />
            </button>
          </form>
        </div>


        {/* Direct WhatsApp Redirection Prompt */}
        <AnimatePresence>
          {whatsappRedirect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-3"
            >
              <p className="text-xs text-emerald-400">
                Message saved to database! Would you also like to send it directly to my WhatsApp?
              </p>
              <a
                href={`https://wa.me/918919866652?text=Hi Mukul, I am ${encodeURIComponent(whatsappRedirect.name)}. I just left a message on your hub: "${encodeURIComponent(whatsappRedirect.msg)}"`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Send via WhatsApp <ExternalLink size={12} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
