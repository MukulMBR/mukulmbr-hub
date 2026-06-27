import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Compass, AlertTriangle } from 'lucide-react';
import { getShortLink, incrementLinkClicks, logAnalyticsEvent } from '../lib/firebase';

export default function LinkRedirect() {
  const { alias } = useParams<{ alias: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'fetching' | 'redirecting' | 'error'>('fetching');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!alias) {
      setStatus('error');
      setErrorMsg('No link alias provided.');
      return;
    }

    const performRedirection = async () => {
      try {
        const link = await getShortLink(alias);

        if (!link) {
          // Fallback presets if offline or not found in Firestore
          const presets: { [key: string]: { url: string; deepLinkUrl: string } } = {
            linkedin: {
              url: 'https://linkedin.com/in/mukulmbr',
              deepLinkUrl: 'linkedin://profile/mukulmbr'
            },
            github: {
              url: 'https://github.com/MukulMBR',
              deepLinkUrl: 'github://'
            },
            youtube: {
              url: 'https://youtube.com',
              deepLinkUrl: 'youtube://'
            }
          };

          const preset = presets[alias.toLowerCase()];
          if (preset) {
            triggerRedirect(preset.url, preset.deepLinkUrl);
          } else {
            setStatus('error');
            setErrorMsg('This smart link does not exist or has been removed.');
            setTimeout(() => navigate('/'), 3000);
          }
          return;
        }

        // Increment click count and log analytics
        await incrementLinkClicks(alias);
        
        // Detect OS and Referrer
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        let os = 'Desktop';
        if (/android/i.test(userAgent)) {
          os = 'Android';
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
          os = 'iOS';
        }

        const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';

        await logAnalyticsEvent('link_click', {
          alias,
          destination: link.url,
          os,
          referrer,
          timestamp: new Date().toISOString()
        });

        triggerRedirect(link.url, link.deepLinkUrl);
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setErrorMsg('An error occurred during redirection.');
      }
    };

    const triggerRedirect = (webUrl: string, deepLinkUrl: string) => {
      setStatus('redirecting');

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobile = /android|iPhone|iPad|iPod/i.test(userAgent);

      if (isMobile && deepLinkUrl) {
        // Try opening native app via deep link
        window.location.href = deepLinkUrl;

        // Fallback timer: if the app isn't installed or fails to open, redirect to web URL
        const timer = setTimeout(() => {
          window.location.href = webUrl;
        }, 600);

        return () => clearTimeout(timer);
      } else {
        // Desktop or no deep link scheme: redirect immediately to web URL
        window.location.href = webUrl;
      }
    };

    performRedirection();
  }, [alias, navigate]);

  return (
    <div className="min-h-screen bg-[#03060c] text-gray-300 flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Cyberpunk scanning line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-40 w-full animate-pulse pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-2xl border border-white/5 bg-[#070b14]/80 backdrop-blur-md shadow-2xl text-center space-y-6 relative z-10"
      >
        {status === 'fetching' && (
          <div className="space-y-4">
            <RefreshCw className="w-12 h-12 mx-auto text-indigo-500 animate-spin" />
            <h2 className="text-sm font-bold tracking-widest text-white uppercase">Fetching Smart Link</h2>
            <p className="text-xs text-gray-500">Connecting to secure redirection node...</p>
          </div>
        )}

        {status === 'redirecting' && (
          <div className="space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-indigo-500/20 border-t-indigo-500 animate-spin"></span>
              <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-emerald-400 uppercase">Redirection Initiated</h2>
            <p className="text-xs text-gray-400">
              Opening <span className="text-white font-bold">{alias}</span> in native app...
            </p>
            <p className="text-[10px] text-gray-600">
              If the app does not open automatically, we will redirect you to the browser version.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-rose-500 animate-bounce" />
            <h2 className="text-sm font-bold tracking-widest text-rose-400 uppercase">Redirection Failed</h2>
            <p className="text-xs text-gray-400">{errorMsg}</p>
            <p className="text-[10px] text-gray-600">
              Redirecting you to the portfolio homepage in a few seconds...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
