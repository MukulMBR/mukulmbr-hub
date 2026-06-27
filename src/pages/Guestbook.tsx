import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { addGuestbookMessage, subscribeToGuestbook } from '../lib/firebase';

interface GuestbookProps {
  isDark: boolean;
}

const AVATARS = [
  '💻', '🚀', '👾', '🔥', '🎨', '⚡', '🧠', '🧙‍♂️', '🐱', '🐼', '🤖', '🦊'
];

export default function Guestbook({ isDark }: GuestbookProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('💻');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Subscribe to real-time guestbook updates
  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setSubmitting(true);
    try {
      await addGuestbookMessage(name.trim(), messageText.trim(), selectedAvatar);
      setMessageText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
          <MessageSquare size={14} /> Developer Wall
        </div>
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Guestbook & Signatures
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Leave a message, say hello, or sign the wall to show you visited the MukulMBR Portfolio Hub!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sign the Guestbook Form */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-400" /> Sign the Wall
          </h3>

          <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-white/5 glass-card bg-black/40 space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Name</label>
              <input 
                type="text"
                required
                maxLength={30}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Developer / Guest"
                className="w-full px-3.5 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white"
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Choose Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`p-1 text-base rounded-lg border text-center transition-all cursor-pointer ${
                      selectedAvatar === av 
                        ? 'border-indigo-500 bg-indigo-500/10 scale-110' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</label>
              <textarea 
                required
                maxLength={200}
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write something nice..."
                className="w-full p-3 bg-black/60 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {submitting ? 'Signing...' : 'Sign Guestbook'} <Send size={12} />
            </button>

            <AnimatePresence>
              {success && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-[10px] text-emerald-400 text-center font-mono flex items-center justify-center gap-1"
                >
                  <ShieldCheck size={12} /> Signature added successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Public Messages Wall */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1">
            <MessageSquare size={12} className="text-purple-400" /> Live Feed ({messages.length})
          </h3>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  className="p-4 rounded-2xl border border-white/5 glass-card bg-gradient-to-br from-[#0a0f1d]/30 to-[#03060c]/30 flex items-start gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg shadow-inner">
                    {msg.avatar || '💻'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{msg.name}</span>
                      <span className="text-[9px] font-mono text-gray-500">
                        {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-450 leading-relaxed break-words">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              ))}

              {messages.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-xs text-gray-500 italic">No signatures yet. Be the first to sign!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
