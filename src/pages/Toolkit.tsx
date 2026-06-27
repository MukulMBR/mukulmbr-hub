import React, { useState, useEffect } from 'react';
import { 
  Terminal as TermIcon, 
  Search, 
  ChevronRight, 
  Star, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Play
} from 'lucide-react';
import { logAnalyticsEvent } from '../lib/firebase';

interface ToolkitProps {
  isDark: boolean;
}

export default function Toolkit({ isDark }: ToolkitProps) {
  const [activeTool, setActiveTool] = useState<'jwt' | 'json' | 'uuid' | 'password' | 'qr' | 'regex' | 'api'>('jwt');
  const [toolkitCategory, setToolkitCategory] = useState<'all' | 'security' | 'formatting' | 'generators'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  // JWT Decoder States
  const [jwtInput, setJwtInput] = useState('');
  const [jwtOutput, setJwtOutput] = useState({ header: '', payload: '', error: '' });

  // JSON Formatter States
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // UUID Generator States
  const [uuidCount, setUuidCount] = useState(3);
  const [uuids, setUuids] = useState<string[]>([]);

  // Password Generator States
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOpts, setPwdOpts] = useState({ upper: true, lower: true, nums: true, syms: true });
  const [generatedPassword, setGeneratedPassword] = useState('');

  // QR Code Generator States
  const [qrText, setQrText] = useState('https://mukulmbr-hub.vercel.app');

  // Regex Tester States
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Contact me at mail@mukulmbr.dev or tcs-hr@tcs.com');
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  // API Sandbox States
  const [apiEndpoint, setApiEndpoint] = useState<'status' | 'projects' | 'message'>('status');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiBody, setApiBody] = useState('{\n  "name": "Recruiter",\n  "message": "Interested in your profile!"\n}');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);



  // Log page view
  useEffect(() => {
    logAnalyticsEvent('page_view', { page: 'toolkit' });
  }, []);

  const addRecentTool = (id: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((t) => t !== id);
      return [id, ...filtered].slice(0, 3);
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
    logAnalyticsEvent('tool_copy', { tool: activeTool, action: id });
  };

  // JWT Decoder Handler
  const handleJwtDecode = (token: string) => {
    setJwtInput(token);
    addRecentTool('jwt');
    if (!token.trim()) {
      setJwtOutput({ header: '', payload: '', error: '' });
      return;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      setJwtOutput({ header: '', payload: '', error: 'Invalid JWT structure (must have 3 parts).' });
      return;
    }
    try {
      const headerDec = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const payloadDec = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setJwtOutput({
        header: JSON.stringify(JSON.parse(headerDec), null, 2),
        payload: JSON.stringify(JSON.parse(payloadDec), null, 2),
        error: ''
      });
    } catch (e: any) {
      setJwtOutput({ header: '', payload: '', error: `Decode failed: ${e.message}` });
    }
  };

  // JSON Formatter Handler
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
      setJsonError(e.message);
      setJsonOutput('');
    }
  };

  // UUID Generator Handler
  const generateUUIDs = () => {
    addRecentTool('uuid');
    const newUuids = [];
    for (let i = 0; i < uuidCount; i++) {
      newUuids.push(
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        })
      );
    }
    setUuids(newUuids);
    logAnalyticsEvent('tool_run', { tool: 'uuid', count: uuidCount });
  };

  // Password Generator Handler
  const generatePassword = () => {
    addRecentTool('password');
    let chars = '';
    if (pwdOpts.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (pwdOpts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pwdOpts.nums) chars += '0123456789';
    if (pwdOpts.syms) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-';

    if (!chars) {
      setGeneratedPassword('');
      return;
    }

    let pwd = '';
    for (let i = 0; i < pwdLength; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pwd);
    logAnalyticsEvent('tool_run', { tool: 'password', length: pwdLength });
  };

  // Regex Tester Handler
  useEffect(() => {
    if (!regexPattern.trim() || !regexText.trim()) {
      setRegexMatches([]);
      return;
    }
    try {
      const r = new RegExp(regexPattern, regexFlags);
      const matches = regexText.match(r) || [];
      setRegexMatches(matches);
    } catch (e) {
      setRegexMatches([]);
    }
  }, [regexPattern, regexFlags, regexText]);

  // API Sandbox Handler
  const runApiRequest = async () => {
    setApiLoading(true);
    addRecentTool('api');
    logAnalyticsEvent('tool_run', { tool: 'api_sandbox', endpoint: apiEndpoint });
    
    // Simulate latency
    await new Promise(r => setTimeout(r, 600));

    if (apiEndpoint === 'status') {
      setApiResponse({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-powered-by": "MukulMBR-Cloud-Edge"
        },
        data: {
          online: true,
          uptime: "99.98%",
          environment: "production",
          api_version: "v1.4.2",
          latency_ms: 48,
          timestamp: new Date().toISOString()
        }
      });
    } else if (apiEndpoint === 'projects') {
      setApiResponse({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json"
        },
        data: {
          total: 3,
          projects: [
            { id: "sadhvi-grains", name: "Golden Grain Emporium", role: "Frontend Lead", stack: ["React", "Three.js", "Vite"] },
            { id: "portfolio-hub", name: "MukulMBR Portfolio Hub", role: "Architect", stack: ["Vite", "Firebase", "Canvas"] }
          ]
        }
      });
    } else if (apiEndpoint === 'message') {
      try {
        const body = JSON.parse(apiBody);
        setApiResponse({
          status: 201,
          statusText: "Created",
          headers: {
            "content-type": "application/json"
          },
          data: {
            success: true,
            message: "Simulation successful! (In production, this triggers a real Firestore database entry and forwards to WhatsApp.)",
            received: body,
            timestamp: new Date().toISOString()
          }
        });
      } catch (e: any) {
        setApiResponse({
          status: 400,
          statusText: "Bad Request",
          headers: {
            "content-type": "application/json"
          },
          error: "JSON Parsing Error: " + e.message
        });
      }
    }
    setApiLoading(false);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toolkitItems = [
    { id: 'jwt', name: 'JWT Decoder', category: 'security', desc: 'Decode JSON Web Tokens instantly client-side.' },
    { id: 'json', name: 'JSON Formatter', category: 'formatting', desc: 'Prettify, validate, and minify JSON payloads.' },
    { id: 'uuid', name: 'UUID Generator', category: 'generators', desc: 'Generate secure cryptographically random UUIDs.' },
    { id: 'password', name: 'Password Generator', category: 'generators', desc: 'Generate highly secure custom password hashes.' },
    { id: 'qr', name: 'QR Generator', category: 'generators', desc: 'Generate vector QR codes instantly.' },
    { id: 'regex', name: 'Regex Tester', category: 'formatting', desc: 'Test regular expressions in real time.' },
    { id: 'api', name: 'API Sandbox', category: 'formatting', desc: 'Simulate, mock, and inspect API endpoints.' }
  ];

  const filteredToolkitItems = toolkitItems.filter((t) => {
    const matchesCategory = toolkitCategory === 'all' || t.category === toolkitCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
          <TermIcon size={14} /> SaaS Utility Desk
        </div>
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Developer Toolkit Workspace
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Clean, instant frontend parsing and code generators running completely client-side.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3 rounded-2xl border border-white/5 glass-card">
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

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Search size={14} />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs focus:outline-none focus:border-indigo-500/50 text-white"
          />
        </div>
      </div>

      {/* Recently Used */}
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
                  className={`p-3 rounded-xl border border-white/5 text-left text-xs font-semibold glass-card flex items-center justify-between cursor-pointer ${
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

      {/* Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Selector */}
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
        </div>

        {/* Right Output Console */}
        <div className="lg:col-span-3 min-h-[380px] rounded-2xl border border-white/5 p-6 glass-card bg-[#05070c]/50 flex flex-col justify-between">
          
          {/* JWT Decoder */}
          {activeTool === 'jwt' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paste JWT Encoded Token</label>
                <textarea 
                  value={jwtInput}
                  onChange={(e) => handleJwtDecode(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full h-24 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none resize-none"
                />
                
                {jwtOutput.error && (
                  <p className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl flex items-center gap-2">
                    <ShieldAlert size={14} /> {jwtOutput.error}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Header</span>
                    <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-purple-300 h-32 overflow-auto">{jwtOutput.header || '{}'}</pre>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payload</span>
                    <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-emerald-300 h-32 overflow-auto">{jwtOutput.payload || '{}'}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* JSON Formatter */}
          {activeTool === 'json' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Input JSON</label>
                  <textarea 
                    value={jsonInput}
                    onChange={(e) => handleJsonFormat(e.target.value)}
                    placeholder='{"name": "mukul"}'
                    className="flex-1 min-h-[160px] p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Formatted Output</label>
                    {jsonOutput && (
                      <button 
                        onClick={() => handleCopy(jsonOutput, 'json-out')}
                        className="text-[10px] font-mono text-gray-450 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === 'json-out' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copiedText === 'json-out' ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <pre className="flex-1 min-h-[160px] p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-indigo-300 overflow-auto whitespace-pre-wrap">
                    {jsonError ? `Error: ${jsonError}` : jsonOutput || '{}'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* UUID Generator */}
          {activeTool === 'uuid' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Count</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="15" 
                      value={uuidCount}
                      onChange={(e) => setUuidCount(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 bg-black/60 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={generateUUIDs}
                    className="px-4 py-2 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Generate
                  </button>
                </div>

                {uuids.length > 0 && (
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Results</span>
                    <div className="space-y-2">
                      {uuids.map((u, index) => (
                        <div key={index} className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-gray-300">
                          <span>{u}</span>
                          <button 
                            onClick={() => handleCopy(u, `uuid-${index}`)}
                            className="text-gray-500 hover:text-white cursor-pointer"
                          >
                            {copiedText === `uuid-${index}` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Password Generator */}
          {activeTool === 'password' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Length ({pwdLength})</label>
                    <input 
                      type="range" 
                      min="8" 
                      max="64" 
                      value={pwdLength}
                      onChange={(e) => setPwdLength(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(pwdOpts).map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-400 capitalize cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={(pwdOpts as any)[opt]}
                          onChange={(e) => setPwdOpts({ ...pwdOpts, [opt]: e.target.checked })}
                          className="rounded border-white/5 bg-black text-indigo-600 focus:ring-0"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={generatePassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} /> Generate Password
                </button>

                {generatedPassword && (
                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-sm text-indigo-300 flex items-center justify-between">
                    <span>{generatedPassword}</span>
                    <button 
                      onClick={() => handleCopy(generatedPassword, 'pwd')}
                      className="text-gray-500 hover:text-white cursor-pointer"
                    >
                      {copiedText === 'pwd' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Generator */}
          {activeTool === 'qr' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">QR Data Link or Text</label>
                <input 
                  type="text" 
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50"
                />

                {qrText.trim() && (
                  <div className="p-4 bg-white rounded-xl w-36 h-36 mx-auto flex items-center justify-center border border-white/10">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`}
                      alt="Generated QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Regex Tester */}
          {activeTool === 'regex' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Regex Pattern</label>
                    <input 
                      type="text" 
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Flags</label>
                    <input 
                      type="text" 
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Test Text</label>
                  <textarea 
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    className="w-full h-20 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-xs text-gray-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Matches ({regexMatches.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {regexMatches.map((m, idx) => (
                      <span key={idx} className="text-xs font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded">
                        {m}
                      </span>
                    ))}
                    {regexMatches.length === 0 && (
                      <span className="text-xs text-gray-500 italic">No matches found.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Sandbox */}
          {activeTool === 'api' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-mono text-emerald-400 font-bold">
                      {apiMethod}
                    </span>
                    <span className="font-mono text-xs text-gray-400 mt-1">
                      /api/{apiEndpoint}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <select 
                      value={apiEndpoint}
                      onChange={(e) => {
                        const ep = e.target.value as any;
                        setApiEndpoint(ep);
                        setApiMethod(ep === 'message' ? 'POST' : 'GET');
                      }}
                      className="px-2.5 py-1 bg-black/60 border border-white/5 rounded text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="status">GET /status</option>
                      <option value="projects">GET /projects</option>
                      <option value="message">POST /message</option>
                    </select>

                    <button 
                      onClick={runApiRequest}
                      disabled={apiLoading}
                      className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {apiLoading ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />} Run
                    </button>
                  </div>
                </div>

                {apiMethod === 'POST' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Request Body (JSON)</label>
                    <textarea 
                      value={apiBody}
                      onChange={(e) => setApiBody(e.target.value)}
                      className="w-full h-24 p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-[11px] text-gray-200 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {apiResponse && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Response Output</span>
                      <span className={`text-[10px] font-mono font-bold ${apiResponse.status < 300 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        HTTP {apiResponse.status} {apiResponse.statusText}
                      </span>
                    </div>
                    <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-indigo-300 max-h-48 overflow-auto">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
