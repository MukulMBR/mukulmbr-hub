import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TermIcon, Send, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { logAnalyticsEvent } from '../lib/firebase';

interface TerminalQuestProps {
  isDark: boolean;
}

const QUEST_STEPS = [
  {
    riddle: "Riddle 1: A client reports their website is extremely slow. You look at the network panel and see a single JS bundle of 18MB. What is the name of the bundling technique used to split this monolithic file into smaller, dynamic chunks? (Hint: 2 words, no spaces/hyphens, or space separated)",
    answers: ["code splitting", "codesplitting", "lazy loading", "lazyloading"],
    successMsg: "Correct! Code splitting allows us to load bundles on-demand, improving initial load time drastically."
  },
  {
    riddle: "Riddle 2: You need to retrieve the user's details from a REST API. However, the user is typing fast in a search input, triggering 50 API calls per second. What engineering technique is used to delay the API call until the user stops typing for a specific duration? (Hint: 8 letters)",
    answers: ["debounce", "debouncing"],
    successMsg: "Fantastic! Debouncing aggregates multiple rapid events into a single invocation after a quiet period."
  },
  {
    riddle: "Riddle 3: Git conflict! You pushed a hotfix, but someone else rewrote history. Which Git command flag forces the remote branch to match your local history, overwriting any remote commits? (Hint: 5 letters, starts with '--')",
    answers: ["--force"],
    successMsg: "Masterful! --force (or force pushing) overrides the remote branch history. (Use with caution!)"
  }
];

export default function TerminalQuest({ isDark }: TerminalQuestProps) {
  const [questStep, setQuestStep] = useState(0);
  const [questAnswer, setQuestAnswer] = useState('');
  const [questStatus, setQuestStatus] = useState<'intro' | 'riddle' | 'success' | 'completed'>('intro');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'SYSTEM BOOT INITIATED...',
    'CONNECTING TO MUKULMBR QUEST CORE...',
    'CONNECTION ESTABLISHED.',
    'Type "start" to begin the developer challenges.'
  ]);
  const [questAchievements, setQuestAchievements] = useState<string[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Log page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page: 'quest' });
  }, []);

  const handleQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = questAnswer.trim().toLowerCase();
    if (!input) return;

    const newHistory = [...terminalHistory, `> ${questAnswer}`];
    setQuestAnswer('');

    if (questStatus === 'intro') {
      if (input === 'start' || input === 'begin') {
        setQuestStatus('riddle');
        newHistory.push(
          'QUEST INITIATED.',
          'Solve the following engineering riddles to unlock your badges.',
          '----------------------------------------',
          QUEST_STEPS[0].riddle
        );
      } else {
        newHistory.push('Type "start" to initiate the sequence.');
      }
    } else if (questStatus === 'riddle') {
      const currentStep = QUEST_STEPS[questStep];
      if (currentStep.answers.includes(input)) {
        newHistory.push(
          '>> CHECKING ANSWER...',
          '>> CORRESPONDENCE: MATCH FOUND!',
          currentStep.successMsg,
          '----------------------------------------'
        );

        if (questStep < QUEST_STEPS.length - 1) {
          setQuestStep(prev => prev + 1);
          newHistory.push(QUEST_STEPS[questStep + 1].riddle);
        } else {
          setQuestStatus('completed');
          setQuestAchievements(['Systems Architect']);
          newHistory.push(
            '🏆 CHALLENGES COMPLETED!',
            'You have successfully solved all riddles.',
            'UNLOCKED BADGE: [Systems Architect]',
            'Type "reset" to play again.'
          );
          logAnalyticsEvent('quest_complete', { badge: 'Systems Architect' });
        }
      } else {
        newHistory.push(
          '>> CHECKING ANSWER...',
          '>> ERROR: INVALID RESPONSE.',
          'Try again! Read the hint carefully.'
        );
      }
    } else if (questStatus === 'completed') {
      if (input === 'reset') {
        setQuestStep(0);
        setQuestStatus('intro');
        setQuestAchievements([]);
        setTerminalHistory([
          'SYSTEM REBOOT INITIATED...',
          'Type "start" to begin the developer challenges.'
        ]);
      } else {
        newHistory.push('Quest completed! Type "reset" to restart.');
      }
    }

    setTerminalHistory(newHistory);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
          <TermIcon size={14} /> CLI Terminal Quest
        </div>
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Engineering Challenges
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Test your engineering, debugging, and git knowledge in our retro CLI quest game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Terminal Screen (3 cols) */}
        <div className="md:col-span-3 rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/80 font-mono text-xs text-emerald-400 relative">
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)] z-20"></div>
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-20"></div>

          {/* Header */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between relative z-30">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] text-emerald-500/60 font-bold tracking-widest">CRT-DECK::QUESTOS_v0.9.sh</span>
            <span className="w-4"></span>
          </div>

          {/* Screen Content */}
          <div className="p-5 h-80 overflow-y-auto space-y-3 select-text scrollbar-thin scrollbar-thumb-emerald-500/10 relative z-10 text-left">
            {terminalHistory.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                {line}
              </div>
            ))}
            <div ref={terminalEndRef}></div>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleQuestSubmit} className="px-4 py-3 border-t border-white/5 bg-black/40 flex items-center gap-2 relative z-30">
            <span className="text-emerald-400 font-bold animate-pulse">&gt;</span>
            <input 
              type="text"
              ref={inputRef}
              value={questAnswer}
              onChange={(e) => setQuestAnswer(e.target.value)}
              placeholder={questStatus === 'intro' ? 'Type "start" and press Enter...' : 'Type your answer here...'}
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-emerald-500/20 font-mono focus:ring-0 focus:outline-none"
            />
            <button type="submit" className="text-emerald-500 hover:text-white transition-colors cursor-pointer">
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Badges / Sidebar (1 col) */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl border border-white/5 glass-card bg-black/40 space-y-4 text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Trophy size={14} className="text-amber-500" /> Achievements
            </h3>
            
            <div className="space-y-3">
              {questAchievements.includes('Systems Architect') ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col items-center justify-center text-center space-y-2"
                >
                  <Sparkles size={24} className="text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <div>
                    <span className="block text-xs font-bold text-white">Systems Architect</span>
                    <span className="text-[9px] text-gray-500 font-mono">Level 1 Complete</span>
                  </div>
                </motion.div>
              ) : (
                <div className="py-8 text-center text-gray-600 space-y-2">
                  <Trophy size={20} className="mx-auto opacity-30" />
                  <p className="text-[10px] italic">Solve all riddles to unlock the Systems Architect badge.</p>
                </div>
              )}
            </div>

            {questStatus === 'completed' && (
              <button
                onClick={() => {
                  setQuestStep(0);
                  setQuestStatus('intro');
                  setQuestAchievements([]);
                  setTerminalHistory([
                    'SYSTEM REBOOT INITIATED...',
                    'Type "start" to begin the developer challenges.'
                  ]);
                }}
                className="w-full py-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw size={12} /> Reset Quest
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
