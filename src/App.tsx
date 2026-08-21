// ============================================
// MAIN APP - Chinese Signals AI BOT PRO
// Complete Dashboard with Signal Generation
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import { activateLicense, verifyLicense, getStoredTier } from './lib/license';

// ============================================
// ICON COMPONENTS (Lucide-style)
// ============================================

const IconComponents = {
  Brain: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  ),
  Users: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Trophy: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  ShieldCheck: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  TrendingUp: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  House: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  Clock: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Globe: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  Crown: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
      <path d="M5 21h14"/>
    </svg>
  ),
  MoreHorizontal: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>
  ),
  Rocket: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  Search: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Share2: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
    </svg>
  ),
  Target: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  ArrowUp: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 7-7 7 7"/>
      <path d="M12 19V5"/>
    </svg>
  ),
  ArrowDown: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </svg>
  ),
  Copy: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  RefreshCw: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  Check: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  LoaderCircle: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  CircleAlert: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="8" y2="12"/>
      <line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  ),
  Lock: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  ChevronDown: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Zap: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
  ),
  CircleX: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  ),
  Clock3: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Send: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
      <path d="m21.854 2.147-10.94 10.939"/>
    </svg>
  ),
  CircleQuestion: ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <path d="M12 17h.01"/>
    </svg>
  ),
};

// ============================================
// TELEGRAM SVG
// ============================================

const TelegramIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9.78 15.27 9.45 19.9c.47 0 .68-.2.93-.44l2.23-2.13 4.62 3.38c.85.47 1.45.22 1.68-.78l3.05-14.29c.28-1.24-.45-1.73-1.27-1.43L2.2 9.86c-1.22.47-1.2 1.14-.21 1.44l4.6 1.43 10.68-6.72c.5-.33.96-.15.58.19"/>
  </svg>
);

// ============================================
// CURRENCY PAIR FLAGS
// ============================================

const PAIR_FLAGS: Record<string, [string, string]> = {
  'EUR/USD': ['eu', 'us'], 'GBP/USD': ['gb', 'us'], 'USD/JPY': ['us', 'jp'],
  'AUD/USD': ['au', 'us'], 'USD/CAD': ['us', 'ca'], 'NZD/USD': ['nz', 'us'],
  'USD/CHF': ['us', 'ch'], 'EUR/GBP': ['eu', 'gb'], 'EUR/JPY': ['eu', 'jp'],
  'GBP/JPY': ['gb', 'jp'], 'AUD/JPY': ['au', 'jp'], 'AUD/CAD': ['au', 'ca'],
  'AUD/CHF': ['au', 'ch'], 'AUD/NZD': ['au', 'nz'], 'CAD/JPY': ['ca', 'jp'],
  'CHF/JPY': ['ch', 'jp'], 'EUR/AUD': ['eu', 'au'], 'EUR/CAD': ['eu', 'ca'],
  'EUR/CHF': ['eu', 'ch'], 'EUR/NZD': ['eu', 'nz'], 'GBP/AUD': ['gb', 'au'],
  'GBP/CAD': ['gb', 'ca'], 'GBP/CHF': ['gb', 'ch'], 'GBP/NZD': ['gb', 'nz'],
  'NZD/CAD': ['nz', 'ca'], 'NZD/CHF': ['nz', 'ch'], 'NZD/JPY': ['nz', 'jp'],
  'USD/SGD': ['us', 'sg'], 'USD/MXN': ['us', 'mx'], 'USD/ZAR': ['us', 'za'],
  'USD/TRY': ['us', 'tr'], 'USD/BRL': ['us', 'br'], 'USD/ARS': ['us', 'ar'],
  'USD/INR': ['us', 'in'], 'USD/IDR': ['us', 'id'], 'USD/PKR': ['us', 'pk'],
  'USD/BDT': ['us', 'bd'], 'CAD/CHF': ['ca', 'ch'], 'USD/COP': ['us', 'co'],
};

const FlagPair = ({ pair, size = 22 }: { pair: string; size?: number }) => {
  const codes = PAIR_FLAGS[pair.replace(' (OTC)', '')] ?? ['eu', 'us'];
  return (
    <div className="relative h-6 w-9 shrink-0">
      <img src={`https://flagcdn.com/w40/${codes[0]}.png`} alt="" loading="lazy"
        className="absolute left-0 top-0 rounded-full border border-white/20 object-cover"
        style={{ width: size, height: size }} />
      <img src={`https://flagcdn.com/w40/${codes[1]}.png`} alt="" loading="lazy"
        className="absolute right-0 top-0 rounded-full border border-white/20 object-cover"
        style={{ width: size, height: size }} />
    </div>
  );
};

// ============================================
// PAIR DATA
// ============================================

const LIVE_PAIRS = 'EUR/USD.GBP/USD.USD/JPY.AUD/USD.USD/CAD.NZD/USD.USD/CHF.EUR/GBP.EUR/JPY.GBP/JPY.AUD/JPY.AUD/CAD.AUD/CHF.AUD/NZD.CAD/JPY.CHF/JPY.EUR/AUD.EUR/CAD.EUR/CHF.EUR/NZD.GBP/AUD.GBP/CAD.GBP/CHF.GBP/NZD.NZD/CAD.NZD/CHF.NZD/JPY.USD/SGD.USD/MXN.USD/ZAR.USD/TRY.USD/BRL'.split('.');
const OTC_PAIRS = ['USD/ARS (OTC)', 'USD/INR (OTC)', 'USD/IDR (OTC)', 'USD/PKR (OTC)', 'USD/BRL (OTC)', 'USD/BDT (OTC)', 'USD/COP (OTC)', 'NZD/CAD (OTC)', 'NZD/CHF (OTC)', 'CAD/CHF (OTC)'];

const SHORT_TIMERS = ['5 Seconds', '10 Seconds', '30 Seconds'];
const MED_TIMERS = ['5 Seconds', '10 Seconds', '15 Seconds', '30 Seconds', '45 Seconds', '1 Minute'];
const LONG_TIMERS = ['1 Minute', '2 Minutes', '3 Minutes', '5 Minutes', '10 Minutes', '15 Minutes', '30 Minutes'];

// ============================================
// ANIMATED BACKGROUND (candle + particles)
// ============================================

function AnimatedBackground() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const candles = useMemo(() => Array.from({ length: 18 }).map((_, i) => {
    const bull = Math.random() > 0.45;
    return {
      bull, bodyH: 18 + Math.random() * 46, wickTop: 8 + Math.random() * 22, wickBot: 8 + Math.random() * 22,
      left: i / 18 * 100 + (Math.random() * 3 - 1.5), top: 8 + Math.random() * 80,
      dur: 7 + Math.random() * 8, delay: -Math.random() * 10,
      scale: 0.7 + Math.random() * 0.9, drift: 30 + Math.random() * 60, key: i,
    };
  }), []);

  const particles = useMemo(() => Array.from({ length: 22 }).map((_, i) => ({
    key: i, left: Math.random() * 100, top: Math.random() * 100, size: 2 + Math.random() * 4,
    dur: 6 + Math.random() * 8, delay: -Math.random() * 10, opacity: 0.25 + Math.random() * 0.45,
  })), []);

  if (!show) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {candles.map(c => (
        <div key={`c-${c.key}`} className="absolute animate-candle-drift"
          style={{ left: `${c.left}%`, top: `${c.top}%`, transform: `scale(${c.scale})`, '--duration': `${c.dur}s`, '--delay': `${c.delay}s`, '--drift': `${c.drift}px` } as React.CSSProperties}>
          <div className="flex flex-col items-center" style={{ filter: c.bull ? 'drop-shadow(0 0 10px rgba(0,212,255,0.55))' : 'drop-shadow(0 0 10px rgba(255,100,100,0.5))', opacity: 0.32 }}>
            <div className="w-[2px]" style={{ height: c.wickTop, background: c.bull ? '#00d4ff' : '#ff6464' }} />
            <div className="w-3 rounded-sm border" style={{ height: c.bodyH, background: c.bull ? 'linear-gradient(180deg, rgba(0,212,255,0.9), rgba(0,150,200,0.7))' : 'linear-gradient(180deg, rgba(255,100,100,0.9), rgba(200,50,50,0.7))', borderColor: c.bull ? 'rgba(0,212,255,0.85)' : 'rgba(255,100,100,0.8)' }} />
            <div className="w-[2px]" style={{ height: c.wickBot, background: c.bull ? '#00d4ff' : '#ff6464' }} />
          </div>
        </div>
      ))}
      {particles.map(p => (
        <div key={`p-${p.key}`} className="absolute rounded-full animate-particle-float"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: p.opacity, background: '#4488ff', boxShadow: '0 0 10px 2px rgba(68,136,255,0.7)', '--duration': `${p.dur}s`, '--delay': `${p.delay}s` } as React.CSSProperties} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(20,30,60,0.35)] to-[rgba(15,20,40,0.7)]" />
    </div>
  );
}

// ============================================
// LICENSE ACTIVATION PAGE
// ============================================

function LicenseActivation({ onActivated }: { onActivated: (tier: string) => void }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await activateLicense(key);
      if (result.ok && result.tier) {
        onActivated(result.tier);
      } else {
        setError(result.error || 'License activation failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-bg relative min-h-dvh w-full overflow-hidden font-sans">
      <AnimatedBackground />
      {/* Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[rgba(50,80,200,0.28)] blur-[110px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 z-10 h-[300px] w-[300px] rounded-full bg-[rgba(80,50,150,0.22)] blur-[110px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 z-10 h-[260px] w-[260px] rounded-full bg-[rgba(60,60,180,0.18)] blur-[110px]" />
      
      <div className="relative z-20 mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center px-5 py-5 sm:px-8 sm:py-8">
        {/* Header */}
        <header className="flex w-full flex-col items-center text-center">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -m-4 rounded-full bg-[rgba(50,80,200,0.45)] blur-2xl" />
            <img src="/favicon.ico" alt="Chinese Signals AI Bot Pro logo"
              className="relative h-28 w-28 shrink-0 rounded-2xl object-contain sm:h-36 sm:w-36" />
          </div>
          <h1 className="mt-4 font-display not-italic leading-[0.9] text-white">
            <span className="block font-bold text-[clamp(1.6rem,7.5vw,2.6rem)] tracking-[0.05em] text-white/95">Chinese Signals</span>
            <span className="mt-2 block font-black text-[clamp(2.15rem,10.5vw,3.75rem)] tracking-[0.24em] text-[var(--neon)] drop-shadow-[0_0_22px_rgba(0,212,255,0.95)]">AI BOT PRO</span>
          </h1>
        </header>

        {/* License Card */}
        <section className="mt-6 w-full">
          <div className="glass-card relative overflow-hidden rounded-3xl px-5 py-6 text-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="font-display text-sm tracking-wide text-muted-foreground">ENTER YOUR LICENSE KEY</p>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full bg-transparent border border-[rgba(0,212,255,0.3)] rounded-2xl px-4 py-3 text-white text-center placeholder-gray-500 focus:outline-none focus:border-[var(--neon)] tracking-widest font-display font-bold text-lg"
                maxLength={19}
                disabled={loading}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[rgba(0,180,220)] via-[rgba(0,150,200)] to-[rgba(0,120,180)] px-6 py-3 font-display text-sm font-black tracking-[0.22em] text-white shadow-[0_0_28px_rgba(0,180,220,0.85),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                {loading ? 'ACTIVATING...' : 'ACTIVATE LICENSE'}
              </button>
            </form>
          </div>
        </section>

        <div className="flex-1" />

        {/* Telegram */}
        <section className="mt-6 w-full">
          <div className="glass-card relative overflow-hidden rounded-3xl px-5 py-4 sm:px-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(50,50,180,0.4)] blur-3xl" />
            <div className="relative flex flex-col items-center gap-2.5">
              <p className="font-display text-[10px] font-bold tracking-[0.28em] text-muted-foreground">OFFICIAL SUPPORT</p>
              <h3 className="font-display text-base font-black tracking-tight text-white">Chinese Signals Bot</h3>
              <a href="https://t.me/ChineseSignalsBot" target="_blank" rel="noopener noreferrer"
                className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[rgba(50,50,180)] via-[rgba(60,60,200)] to-[rgba(50,50,180)] px-6 py-2.5 font-display text-sm font-black tracking-[0.22em] text-white shadow-[0_0_28px_rgba(60,60,200,0.85),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                <TelegramIcon className="h-5 w-5" /> OPEN TELEGRAM
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ============================================
// SELECTOR COMPONENT
// ============================================

function Selector({ icon, label, value, options, onChange, iconBg }: {
  icon: React.ReactNode; label: string; value: string; options: string[]; onChange: (v: string) => void; iconBg?: string;
}) {
  return (
    <label className="relative flex items-center gap-3 rounded-2xl border border-[rgba(0,212,255,0.35)] bg-[rgba(20,25,50,0.6)] px-4 py-2.5 backdrop-blur-md transition-colors focus-within:border-[var(--neon)]">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${iconBg ?? 'bg-[rgba(0,212,255,0.1)]'}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground">{label}</p>
        <p className="truncate font-display text-base font-bold text-foreground">{value}</p>
      </div>
      <IconComponents.ChevronDown className="h-5 w-5 shrink-0 text-[var(--neon)]" />
      <select value={value} onChange={e => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={label}>
        {options.map(o => <option key={o} value={o} className="bg-[rgb(20,25,50)] text-foreground">{o}</option>)}
      </select>
    </label>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-[rgba(0,212,255,0.25)] bg-[rgba(20,25,50,0.5)] px-1 py-1.5 text-center backdrop-blur-md">
      <div className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">{icon}</div>
      <p className="text-[8px] font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-display text-xs font-extrabold tracking-tight ${valueClass || 'text-white'}`}>{value}</p>
    </div>
  );
}

// ============================================
// STATUS CARD
// ============================================

function StatusCard({ icon, label, value, valueClass, noDot }: { icon: React.ReactNode; label: string; value: string; valueClass?: string; noDot?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(0,212,255,0.55)] bg-[rgba(25,35,60,0.6)] shadow-[0_0_12px_rgba(0,212,255,0.55),inset_0_0_10px_rgba(0,212,255,0.2)]">
        {icon}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="text-[7.5px] font-bold tracking-[0.1em] text-slate-300 whitespace-nowrap">{label}</p>
        <div className="mt-0.5 flex items-center gap-1">
          <p className={`font-display text-[13px] font-black leading-none tracking-tight ${valueClass || 'text-white'}`}>{value}</p>
          {!noDot && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QUOTEX LOGO
// ============================================

const QuotexLogo = () => (
  <img src="https://flagcdn.com/w40/us.png" alt="Quotex" loading="lazy" className="h-6 w-6 rounded-md object-contain" />
);

// ============================================
// LOADING ANIMATION
// ============================================

function SignalLoading({ elapsed }: { elapsed: number }) {
  const remaining = Math.max(0, 5 - Math.floor(elapsed));
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  const steps = [
    { icon: IconComponents.Search, label: 'Scanning Market Data' },
    { icon: IconComponents.TrendingUp, label: 'Analyzing Price Action' },
    { icon: IconComponents.Globe, label: 'Checking Market Trends' },
    { icon: IconComponents.Share2, label: 'Detecting Patterns' },
    { icon: IconComponents.Trophy, label: 'Calculating Accuracy' },
    { icon: IconComponents.Target, label: 'Finalizing Signal' },
  ];

  const interval = 5 / steps.length;
  const activeIdx = Math.min(steps.length - 1, Math.floor(elapsed / interval));

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.55)] bg-gradient-to-br from-[rgba(15,20,50)] via-[rgba(12,16,40)] to-[rgba(18,25,55)] px-4 pb-4 pt-5 shadow-[0_0_40px_rgba(0,212,255,0.35),inset_0_1px_0_rgba(0,212,255,0.25)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-[rgba(0,212,255,0.3)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-[rgba(100,50,200,0.3)] blur-3xl" />
      <div className="relative text-center">
        <h2 className="text-[26px] font-extrabold uppercase tracking-[0.02em] drop-shadow-[0_0_18px_rgba(0,212,255,0.5)] font-display" style={{ fontStyle: 'normal' }}>
          <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent" style={{ fontStyle: 'normal' }}>GENERATING</span>{' '}
          <span className="bg-gradient-to-b from-[rgba(0,200,255)] to-[rgba(0,120,200)] bg-clip-text text-transparent" style={{ fontStyle: 'normal' }}>SIGNALS</span>
        </h2>
        <p className="mt-2 px-4 text-[11px] font-medium leading-snug text-slate-300/85">Please wait while our AI analyzes the market and finds the best opportunity...</p>
      </div>

      {/* Radar rings */}
      <div className="relative mx-auto mt-4 grid h-[240px] w-[240px] place-items-center">
        <div className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.25)]" />
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-[rgba(0,212,255,0.7)] border-r-[rgba(0,212,255,0.6)] shadow-[0_0_20px_rgba(0,212,255,0.7)] ai-ring-slow" />
        <div className="absolute inset-8 rounded-full border-2 border-dashed border-[rgba(0,212,255,0.4)] ai-ring-med" />
        <div className="absolute inset-[52px] rounded-full border-2 border-transparent border-b-[rgba(0,212,255,0.8)] border-l-[rgba(0,212,255,0.5)] shadow-[0_0_18px_rgba(0,212,255,0.6)] ai-ring-fast" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-[120px] origin-left bg-gradient-to-r from-[rgba(0,220,255)] via-[rgba(0,200,255,0.6)] to-transparent shadow-[0_0_18px_rgba(0,212,255,0.9)] ai-sweep" style={{ transform: 'translate(-50%,-50%) rotate(0deg)' }} />
        <div className="relative grid h-[92px] w-[92px] place-items-center rounded-full border border-[rgba(0,212,255,0.5)] bg-[rgba(15,20,50)] ai-core">
          <IconComponents.Brain className="h-14 w-14 text-[var(--neon)] drop-shadow-[0_0_10px_rgba(0,212,255,0.9)]" />
          <span className="absolute rounded-md bg-[var(--neon)] px-1.5 py-[1px] text-[9px] font-black tracking-wider text-[rgb(15,20,50)] shadow-[0_0_10px_rgba(0,212,255,0.9)]">AI</span>
        </div>
      </div>

      <div className="relative -mt-1 text-center">
        <p className="font-display text-sm font-black tracking-[0.2em] text-[var(--neon)] drop-shadow-[0_0_10px_rgba(0,212,255,0.9)]">ANALYZING MARKET</p>
        <p className="mt-1 text-xs font-medium text-slate-300/85">Please wait...</p>
        <p className="mt-1 font-display text-4xl font-black tabular-nums text-white drop-shadow-[0_0_18px_rgba(0,212,255,0.7)]">{mins}:{secs}</p>
      </div>

      {/* Steps */}
      <div className="relative mt-4 rounded-2xl border border-[rgba(0,212,255,0.35)] bg-[rgba(15,20,50,0.6)] p-3 backdrop-blur-md">
        <ul className="flex flex-col gap-2.5">
          {steps.map((step, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            const Icon = step.icon;
            return (
              <li key={step.label} className="flex items-center gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-[var(--neon)] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : done ? 'text-[var(--neon)]' : 'text-slate-500/60'}`} />
                <span className={`flex-1 text-[13px] font-semibold ${active || done ? 'text-white' : 'text-slate-500/70'}`}>{step.label}</span>
                {done ? (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--neon)] shadow-[0_0_10px_rgba(0,212,255,0.9)]">
                    <IconComponents.Check className="h-3.5 w-3.5 text-[rgb(15,20,50)]" />
                  </span>
                ) : active ? (
                  <IconComponents.LoaderCircle className="h-5 w-5 animate-spin text-[var(--neon)] drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]" />
                ) : (
                  <span className="h-5 w-5 rounded-full border-2 border-slate-500/40" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ============================================
// SIGNAL RESULT
// ============================================

function SignalResult({ pair, time, direction, onReset }: { pair: string; time: string; direction: string; onReset: () => void }) {
  const isBuy = direction === 'BUY';
  const arrow = isBuy ? IconComponents.ArrowUp : IconComponents.ArrowDown;
  const label = isBuy ? 'UP' : 'DOWN';
  const signalText = isBuy ? 'STRONG BUY SIGNAL' : 'STRONG SELL SIGNAL';
  const colors = isBuy
    ? { core: '34,197,94', text: 'text-emerald-400' }
    : { core: '239,68,68', text: 'text-rose-500' };

  const now = new Date();
  const entryTime = now.toTimeString().slice(0, 8);
  const expiryTime = new Date(now.getTime() + 45000).toTimeString().slice(0, 8);
  const signalId = '#CSAI' + Math.floor(100000 + Math.random() * 900000);
  const ArrowIcon = arrow;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.28)] bg-[#05070d] p-3 shadow-[0_0_40px_rgba(0,212,255,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="relative grid grid-cols-[minmax(0,90px)_1fr_minmax(0,92px)] items-center gap-2">
        {/* Left info */}
        <div className="relative z-10 flex flex-col gap-4">
          <InfoRow icon={<FlagPair pair={pair} size={18} />} label="PAIR" value={pair.replace(' (OTC)', '')} sub="(OTC)" />
          <InfoRow icon={<QuotexLogo />} label="BROKER" value="Quotex" />
          <InfoRow icon={<IconComponents.Clock className="h-4 w-4 text-[var(--neon)]" />} label="TIMER" value={time} />
        </div>

        {/* Center - Direction */}
        <div className="relative mx-auto grid aspect-square w-full max-w-[210px] place-items-center">
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, rgba(${colors.core},0.45) 0%, rgba(${colors.core},0.12) 40%, transparent 70%)`, filter: 'blur(10px)' }} />
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `rgba(${colors.core},0.85)`, boxShadow: `0 0 30px rgba(${colors.core},0.55), inset 0 0 20px rgba(${colors.core},0.55)` }} />
          <div className="absolute inset-3 rounded-full border" style={{ borderColor: `rgba(${colors.core},0.55)` }} />
          <div className="absolute inset-6 rounded-full border border-dashed" style={{ borderColor: `rgba(${colors.core},0.45)` }} />
          <div className="absolute inset-9 rounded-full border" style={{ borderColor: `rgba(${colors.core},0.35)` }} />
          <div className="absolute left-1/2 top-1 h-2 w-0.5 -translate-x-1/2 rounded" style={{ background: `rgba(${colors.core},0.9)` }} />
          <div className="absolute left-1/2 bottom-1 h-2 w-0.5 -translate-x-1/2 rounded" style={{ background: `rgba(${colors.core},0.9)` }} />
          <div className="absolute left-1 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded" style={{ background: `rgba(${colors.core},0.9)` }} />
          <div className="absolute right-1 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded" style={{ background: `rgba(${colors.core},0.9)` }} />
          <div className="relative flex flex-col items-center leading-none">
            <ArrowIcon className={`${colors.text} drop-shadow-[0_0_16px_rgba(${colors.core},1)] w-[74px] h-[74px]`} />
            <div className={`-mt-1 font-display font-black tracking-tight ${colors.text} drop-shadow-[0_0_18px_rgba(${colors.core},1)]`} style={{ fontSize: label.length > 2 ? 32 : 40, lineHeight: 1 }}>{label}</div>
            <div className={`mt-1 font-display text-[9px] font-bold tracking-[0.16em] ${colors.text}`}>{signalText}</div>
          </div>
        </div>

        {/* Right info */}
        <div className="relative z-10 flex flex-col gap-4 items-end text-right">
          <InfoRow align="right" label="SIGNAL ID" value={signalId} valueClass="text-[10px]" valueSuffix={<IconComponents.Copy className="h-3 w-3 shrink-0 text-[var(--neon)]" />} />
          <InfoRow align="right" label="ACCURACY" value="98.6%" valueClass="text-emerald-400" />
          <InfoRow align="right" label="EXPIRES IN" value="00:45" valueClass="text-amber-400" />
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-[rgba(15,10,30,0.6)] px-1.5 py-2.5 text-center">
        <MiniStat label="ENTRY TIME" value={entryTime} />
        <MiniStat label="EXPIRY TIME" value={expiryTime} />
        <MiniStat label="SIGNAL STRENGTH" value="98.7%" valueClass="text-emerald-400" />
        <MiniStat label="AI CONFIDENCE" value="HIGH" valueClass="text-emerald-400" />
      </div>

      {/* Generate new */}
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(15,10,30,0.6)] px-2.5 py-2">
        <div className="flex min-w-0 shrink items-center gap-1.5">
          <IconComponents.Brain className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="text-[10px] font-semibold text-slate-200 leading-tight">AI Analysis<br />Completed</span>
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        </div>
        <button type="button" onClick={onReset}
          className="ml-auto flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-[rgba(0,180,220)] via-[rgba(0,150,200)] to-[rgba(0,120,180)] px-3 py-2 font-display text-[10px] font-black italic tracking-wider text-white shadow-[0_0_18px_rgba(0,212,255,0.7),inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
          <IconComponents.RefreshCw className="h-3.5 w-3.5 shrink-0" /> GENERATE NEW SIGNAL
        </button>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, value, sub, valueClass, valueSuffix, align }: {
  icon?: React.ReactNode; label: string; value: string; sub?: string; valueClass?: string; valueSuffix?: React.ReactNode; align?: string;
}) {
  const right = align === 'right';
  return (
    <div className={`flex ${right ? 'flex-row-reverse' : ''} items-center gap-1.5 min-w-0`}>
      {icon && <div className="shrink-0">{icon}</div>}
      <div className={`min-w-0 leading-tight ${right ? 'text-right' : ''}`}>
        <p className="text-[8px] font-bold tracking-widest text-slate-400 whitespace-nowrap">{label}</p>
        <div className={`mt-0.5 flex items-center gap-1 ${right ? 'justify-end' : ''}`}>
          <p className={`font-display text-[11px] font-black text-white whitespace-nowrap ${valueClass || ''}`}>{value}</p>
          {valueSuffix}
        </div>
        {sub && <p className="text-[8px] font-medium text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="min-w-0 px-0.5">
      <p className="text-[7.5px] font-bold uppercase tracking-[0.08em] leading-tight text-slate-400">{label}</p>
      <p className={`mt-1 font-display text-[12px] font-black text-white tabular-nums whitespace-nowrap ${valueClass || ''}`}>{value}</p>
    </div>
  );
}

// ============================================
// WIN RATE CARD
// ============================================

function WinRateCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.4)] bg-[rgba(20,25,50,0.6)] p-3 shadow-[0_0_25px_rgba(0,212,255,0.2),inset_0_1px_0_rgba(0,212,255,0.2)] backdrop-blur-xl animate-fade-in">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(0,212,255,0.18)] blur-3xl" />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[rgba(0,212,255,0.5)] bg-[rgba(20,25,50,0.7)] shadow-[0_0_10px_rgba(0,212,255,0.5)]">
            <IconComponents.Trophy className="h-4 w-4 text-amber-300" />
          </div>
          <h3 className="font-display text-sm font-black tracking-wide text-white">Win Rate</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2 text-center">
            <p className="text-[9px] font-bold tracking-widest text-emerald-300/80">TODAY</p>
            <p className="font-display text-xl font-black text-emerald-300">92%</p>
          </div>
          <div className="rounded-xl border border-[var(--neon)]/30 bg-[rgba(0,212,255,0.1)] p-2 text-center">
            <p className="text-[9px] font-bold tracking-widest text-[var(--neon)]/80">WEEK</p>
            <p className="font-display text-xl font-black text-[var(--neon)]">89%</p>
          </div>
          <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-2 text-center">
            <p className="text-[9px] font-bold tracking-widest text-purple-300/80">MONTH</p>
            <p className="font-display text-xl font-black text-purple-300">87%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================

function Dashboard({ tier }: { tier: string }) {
  const isProMaxUser = tier === 'pro_max';
  const [market, setMarket] = useState('OTC Markets');
  const [pair, setPair] = useState('EUR/USD (OTC)');
  const [timer, setTimer] = useState('5 Seconds');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'result'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [direction, setDirection] = useState('BUY');
  const [genCount, setGenCount] = useState(0);

  const markets = isProMaxUser ? ['OTC Markets', 'Live Markets'] : ['OTC Markets'];
  const activeMarket = isProMaxUser ? market : 'OTC Markets';
  const pairs = activeMarket === 'Live Markets' ? LIVE_PAIRS : OTC_PAIRS;
  const timers = activeMarket === 'Live Markets' ? LONG_TIMERS : (isProMaxUser ? MED_TIMERS : SHORT_TIMERS);

  useEffect(() => {
    if (!pairs.includes(pair)) setPair(pairs[0]);
    if (!timers.includes(timer)) setTimer(timers[0]);
  }, [activeMarket, isProMaxUser]);

  useEffect(() => {
    if (phase !== 'loading') return;
    setElapsed(0);
    const start = Date.now();
    const iv = setInterval(() => {
      const secs = (Date.now() - start) / 1000;
      if (secs >= 5) {
        clearInterval(iv);
        setElapsed(5);
        setDirection(Math.random() > 0.5 ? 'BUY' : 'SELL');
        setPhase('result');
      } else {
        setElapsed(secs);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, genCount]);

  const handleGenerate = () => { setElapsed(0); setPhase('loading'); setGenCount(c => c + 1); };

  return (
    <main className="page-bg min-h-screen w-full overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[rgba(0,212,255,0.25)] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[rgba(100,50,200,0.2)] blur-[120px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col gap-2 px-3 py-3 sm:px-6 sm:py-6">
        {/* Header */}
        <header className="flex items-center gap-4">
          <img src="/favicon.ico" alt="Chinese Signals AI Bot Pro logo" className="h-[60px] w-[60px] shrink-0 object-contain rounded-xl" />
          <div className="min-w-0 flex-1 font-display leading-[1.1]">
            <h1 className="whitespace-nowrap text-[26px] font-black not-italic tracking-tight text-white">Chinese Signals</h1>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[14px] font-black not-italic tracking-[0.16em] text-[var(--neon)]">AI BOT</span>
              {isProMaxUser ? (
                <span className="relative inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 px-2 py-[3px] text-[9px] font-black not-italic tracking-[0.22em] text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.9),inset_0_1px_0_rgba(255,255,255,0.5)]">
                  <IconComponents.Crown className="h-2.5 w-2.5" /> PRO MAX
                </span>
              ) : (
                <span className="relative inline-flex items-center rounded-full border border-[rgba(120,80,200,0.7)] bg-gradient-to-r from-[rgba(100,50,200)] via-[rgba(120,70,220)] to-[rgba(140,50,230)] px-2 py-[3px] text-[9px] font-black not-italic tracking-[0.22em] text-white shadow-[0_0_14px_rgba(120,70,220,0.85),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.25)]">
                  <span className="pointer-events-none absolute inset-x-1 top-[1px] h-1/2 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                  PRO
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Status Grid */}
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.45)] bg-[rgba(20,25,50,0.6)] p-3 shadow-[0_0_25px_rgba(0,212,255,0.25),inset_0_1px_0_rgba(0,212,255,0.25)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(0,212,255,0.08)] to-transparent" />
          <div className="relative grid grid-cols-3 gap-2">
            <StatusCard icon={<IconComponents.ShieldCheck className="h-6 w-6 text-[var(--neon)]" />} label="LICENSE STATUS" value="ACTIVE" valueClass="text-emerald-400" />
            <StatusCard icon={<IconComponents.Brain className="h-6 w-6 text-[var(--neon)]" />} label="AI ENGINE STATUS" value="ONLINE" valueClass="text-emerald-400" />
            <StatusCard icon={<IconComponents.Users className="h-6 w-6 text-[var(--neon)]" />} label="ACTIVE USERS" value="1M+" noDot />
          </div>
        </div>

        {/* Signal Generator */}
        {phase === 'loading' ? (
          <SignalLoading elapsed={elapsed} />
        ) : phase === 'result' ? (
          <SignalResult pair={pair} time={timer} direction={direction} onReset={handleGenerate} />
        ) : (
          <>
            {/* Upgrade to PRO MAX card (for non-PRO MAX) */}
            {!isProMaxUser && (
              <div className="relative overflow-hidden rounded-2xl border-2 border-[rgba(120,80,200,0.85)] bg-gradient-to-br from-[rgba(30,20,60)] via-[rgba(15,12,35)] to-[rgba(25,18,55)] p-4 sm:p-5 shadow-[0_0_80px_rgba(120,70,220,0.7),0_0_40px_rgba(100,50,200,0.55)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute -right-14 -bottom-14 h-64 w-64 rounded-full bg-[rgba(100,50,200,0.55)] blur-3xl" />
                <div className="pointer-events-none absolute -left-14 -top-14 h-56 w-56 rounded-full bg-[rgba(120,60,220,0.5)] blur-3xl" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(140,60,220,0.08)] via-transparent to-[rgba(0,212,255,0.08)]" />
                <div className="relative text-center">
                  <IconComponents.Crown className="mx-auto h-8 w-8 text-amber-400" />
                  <h3 className="mt-2 font-display text-lg font-black text-white">Upgrade to PRO MAX</h3>
                  <p className="mt-1 text-sm text-slate-300">Get access to Live Markets and more features</p>
                  <a href="https://t.me/ChineseSignalsBot" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 font-display text-sm font-black text-slate-950">
                    UPGRADE NOW
                  </a>
                </div>
              </div>
            )}

            {/* Generate Signals Form */}
            <section className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.55)] bg-gradient-to-br from-[rgba(20,30,60)] via-[rgba(15,20,45)] to-[rgba(20,30,60)] px-3 pb-3 pt-4 shadow-[0_0_40px_rgba(0,212,255,0.35),inset_0_1px_0_rgba(0,212,255,0.25)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -left-16 top-1/3 h-40 w-40 rounded-full bg-[rgba(0,212,255,0.35)] blur-3xl" />
              <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-[rgba(100,50,200,0.3)] blur-3xl" />
              <div className="relative w-full text-center">
                <h2 className="font-display text-2xl font-black not-italic leading-none tracking-tight whitespace-nowrap">
                  <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">GENERATE</span>{' '}
                  <span className="bg-gradient-to-b from-[rgba(0,200,255)] to-[rgba(0,120,200)] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,212,255,0.9)]">SIGNALS</span>
                </h2>
                <p className="mt-2 text-[11px] font-medium tracking-wide text-slate-300/80">AI Analyzed High Accuracy Trading Signals</p>
              </div>
              <div className="relative mt-2.5 flex flex-col gap-1.5">
                <Selector icon={<QuotexLogo />} iconBg="bg-transparent" label="BROKER" value="Quotex" options={['Quotex']} onChange={() => {}} />
                <Selector icon={<IconComponents.Globe className="h-5 w-5 text-[var(--neon)]" />} label="MARKET" value={activeMarket} options={markets} onChange={setMarket} />
                <Selector icon={<FlagPair pair={pair} />} iconBg="bg-transparent" label="PAIR" value={pair} options={pairs} onChange={setPair} />
                <Selector icon={<IconComponents.Clock className="h-5 w-5 text-[var(--neon)]" />} label="TIMER" value={timer} options={timers} onChange={setTimer} />
              </div>
              <button type="button" onClick={handleGenerate}
                className="relative mt-3 flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[rgba(0,180,220)] via-[rgba(0,150,200)] to-[rgba(0,120,180)] py-2.5 font-display text-base font-black italic tracking-widest text-white shadow-[0_0_30px_rgba(0,212,255,0.7),inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(0,212,255,0.95)] active:scale-[0.98]">
                <IconComponents.Rocket className="h-5 w-5 -rotate-45" /> GENERATE SIGNAL
              </button>
            </section>

            {/* Quick Stats */}
            <div className="glass-card grid grid-cols-4 gap-1.5 p-2">
              <StatCard icon={<IconComponents.Target className="h-4 w-4 text-emerald-400" />} label="AI ACCURACY" value="98.6%" valueClass="text-emerald-400" />
              <StatCard icon={<IconComponents.TrendingUp className="h-4 w-4 text-[var(--neon)]" />} label="SIGNAL STR." value="98.7%" valueClass="text-[var(--neon)]" />
              <StatCard icon={<IconComponents.Clock className="h-4 w-4 text-purple-400" />} label="AVG TIME" value="00:45" valueClass="text-purple-300" />
              <StatCard icon={<IconComponents.Trophy className="h-4 w-4 text-amber-400" />} label="TODAY" value="32" valueClass="text-amber-300" />
            </div>

            {/* Win Rate */}
            <WinRateCard />
          </>
        )}

        <div className="h-20" />
      </div>

      <BottomNav active="dashboard" />
    </main>
  );
}

// ============================================
// HISTORY PAGE
// ============================================

function HistoryPage() {
  const [tab, setTab] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [time, setTime] = useState('');


  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString());
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  const stats = useMemo(() => {
    const ranges = { today: { min: 80, max: 92, totalMin: 40, totalMax: 90 }, weekly: { min: 82, max: 94, totalMin: 260, totalMax: 520 }, monthly: { min: 84, max: 96, totalMin: 1100, totalMax: 2400 } };
    const r = ranges[tab];
    const seed = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (const ch of seed + tab) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    const rand = (a: number, b: number) => { hash = (hash * 1664525 + 1013904223) >>> 0; return a + (hash / 4294967295) * (b - a); };
    const total = Math.round(rand(r.totalMin, r.totalMax));
    const winRate = Math.round(rand(r.min, r.max) * 10) / 10;
    const wins = Math.round(winRate / 100 * total);
    return { total, wins, losses: total - wins, winRate };
  }, [tab]);

  return (
    <main className="page-bg min-h-screen w-full overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[rgba(0,212,255,0.25)] blur-[120px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col gap-3 px-4 py-5 pb-28">
        <header className="mb-1">
          <h1 className="font-display text-2xl font-black tracking-tight text-white">Signal History</h1>
          <p className="text-xs text-muted-foreground mt-1">Verified AI performance</p>
        </header>

        <div className="glass-card grid grid-cols-3 gap-1 rounded-2xl p-1.5">
          {(['today', 'weekly', 'monthly'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`rounded-xl py-2 text-[11px] font-bold tracking-[0.18em] uppercase transition-all ${tab === t ? 'bg-gradient-to-r from-[rgba(0,120,200)] to-[rgba(0,100,180)] text-white shadow-[0_0_18px_rgba(0,150,200,0.6)]' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <HistoryStat icon={<IconComponents.TrendingUp className="h-5 w-5" />} label="Total Signals" value={stats.total.toLocaleString()} />
          <HistoryStat icon={<IconComponents.Trophy className="h-5 w-5 text-emerald-400" />} label="Win Rate" value={`${stats.winRate}%`} accent="emerald" />
          <HistoryStat icon={<IconComponents.Check className="h-5 w-5 text-emerald-400" />} label="Wins" value={stats.wins.toLocaleString()} badge="WIN" accent="emerald" />
          <HistoryStat icon={<IconComponents.CircleX className="h-5 w-5 text-rose-400" />} label="Losses" value={stats.losses.toLocaleString()} />
        </div>

        <div className="glass-card flex items-center gap-2 rounded-2xl px-4 py-3">
          <IconComponents.Clock3 className="h-4 w-4 text-[var(--neon)]" />
          <div className="text-[11px] tracking-wide text-muted-foreground">Last Updated</div>
          <div className="ml-auto text-[11px] font-semibold text-white">{time}</div>
        </div>
      </div>
      <BottomNav active="history" />
    </main>
  );
}

function HistoryStat({ icon, label, value, badge, accent }: { icon: React.ReactNode; label: string; value: string; badge?: string; accent?: string }) {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(0,212,255,0.25)] blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">{icon}</div>
        {badge && <span className="rounded-md bg-emerald-500/20 border border-emerald-400/50 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-emerald-300">{badge}</span>}
      </div>
      <p className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
      <p className={`font-display text-2xl font-black tracking-tight ${accent === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

// ============================================
// PERFORMANCE PAGE
// ============================================

function PerformancePage() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);

  const metrics = [
    { label: 'AI Accuracy', value: 99.2, color: 'from-emerald-400 to-teal-400' },
    { label: "Today's Win Rate", value: 88, color: 'from-[rgba(0,180,220)] to-[rgba(0,140,200)]' },
    { label: 'Weekly Win Rate', value: 91, color: 'from-[rgba(0,180,220)] to-[rgba(0,140,200)]' },
    { label: 'Monthly Win Rate', value: 93, color: 'from-amber-300 to-amber-500' },
  ];

  return (
    <main className="page-bg min-h-screen w-full overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[rgba(0,212,255,0.25)] blur-[120px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col gap-3 px-4 py-5 pb-28">
        <header className="mb-1 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-white">Performance</h1>
            <p className="text-xs text-muted-foreground mt-1">Real-time AI engine metrics</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-emerald-300">ONLINE</span>
          </div>
        </header>

        <div className="glass-card space-y-4 rounded-2xl p-4">
          {metrics.map(m => (
            <div key={m.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">{m.label}</span>
                <span className="font-display text-sm font-black text-white">{m.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(30,25,50)]">
                <div className={`h-full rounded-full bg-gradient-to-r ${m.color} shadow-[0_0_12px_rgba(0,212,255,0.7)] transition-all duration-1000 ease-out`}
                  style={{ width: show ? `${m.value}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PerfStat icon={<IconComponents.Users className="h-5 w-5 text-[var(--neon)]" />} label="Avg Signal Time" value="1.8s" />
          <PerfStat icon={<IconComponents.TrendingUp className="h-5 w-5 text-[var(--neon)]" />} label="Signals Generated" value="15,000+" />
          <PerfStat icon={<IconComponents.Users className="h-5 w-5 text-[var(--neon)]" />} label="Active Users" value="1M+" />
          <PerfStat icon={<IconComponents.Brain className="h-5 w-5 text-emerald-400" />} label="AI Status" value="ONLINE" accent="emerald" />
        </div>

        <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
          <div className="rounded-xl bg-[rgba(0,212,255,0.15)] p-2.5">
            <IconComponents.Zap className="h-5 w-5 text-[var(--neon)]" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] tracking-wide text-muted-foreground">AI Engine</p>
            <p className="font-display text-sm font-black text-white">Ultra Neural v4.2</p>
          </div>
          <IconComponents.Users className="h-4 w-4 animate-pulse text-emerald-400" />
        </div>
      </div>
      <BottomNav active="performance" />
    </main>
  );
}

function PerfStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[rgba(0,212,255,0.25)] blur-3xl" />
      <div className="relative drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">{icon}</div>
      <p className="mt-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
      <p className={`font-display text-xl font-black tracking-tight ${accent === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

// ============================================
// SUPPORT PAGE
// ============================================

function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How To Activate License', a: 'Enter the license key you received on the home page. Click Activate. The dashboard unlocks instantly once the key is verified.', icon: IconComponents.ShieldCheck },
    { q: 'How To Upgrade PRO MAX', a: 'Open the Upgrade To PRO MAX card on the dashboard, submit the required proof, and admin will approve within 24 hours.', icon: IconComponents.Crown },
    { q: 'Contact Support', a: 'Reach us on WhatsApp — our team responds within a few minutes during working hours.', icon: IconComponents.Users },
  ];

  return (
    <main className="page-bg min-h-screen w-full overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[rgba(0,212,255,0.25)] blur-[120px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col gap-3 px-4 py-5 pb-28">
        <header className="mb-1">
          <h1 className="font-display text-2xl font-black tracking-tight text-white">Support</h1>
          <p className="text-xs text-muted-foreground mt-1">We're here to help</p>
        </header>

        <div className="glass-card relative overflow-hidden rounded-2xl p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[rgba(50,60,180,0.4)] blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(50,60,180,0.2)] p-3 shadow-[0_0_20px_rgba(60,60,200,0.6)]">
              <IconComponents.Send className="h-6 w-6 text-[rgba(80,100,220)]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Official Channel</p>
              <p className="font-display text-lg font-black text-white">Chinese Signals</p>
            </div>
          </div>
          <a href="https://whatsapp.com/channel/0029Vb4wRJBBadmUDIOh5A1E" target="_blank" rel="noopener noreferrer"
            className="group relative mb-2 mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[rgba(50,60,180)] via-[rgba(60,70,200)] to-[rgba(50,60,180)] py-3 font-display text-[12px] font-black tracking-[0.2em] text-white shadow-[0_0_30px_rgba(60,70,200,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            <IconComponents.Send className="h-4 w-4" /> JOIN OFFICIAL WHATSAPP CHANNEL
          </a>
          <a href="https://wa.me/923133488621" target="_blank" rel="noopener noreferrer"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[rgba(50,60,180)] via-[rgba(60,70,200)] to-[rgba(50,60,180)] py-3 font-display text-[12px] font-black tracking-[0.2em] text-white shadow-[0_0_30px_rgba(60,70,200,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            <IconComponents.Send className="h-4 w-4" /> JOIN WHATSAPP SUPPORT
          </a>
        </div>

        <div className="mb-1 mt-2 flex items-center gap-2">
          <IconComponents.CircleQuestion className="h-4 w-4 text-[var(--neon)]" />
          <h2 className="font-display text-sm font-black tracking-[0.2em] text-white uppercase">FAQ</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            const Icon = faq.icon;
            return (
              <div key={faq.q} className="glass-card overflow-hidden rounded-2xl">
                <button type="button" onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/5">
                  <Icon className="h-5 w-5 shrink-0 text-[var(--neon)]" />
                  <span className="flex-1 text-sm font-semibold text-white">{faq.q}</span>
                  <IconComponents.ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && <div className="px-4 pb-4 pl-12 text-[13px] leading-relaxed text-muted-foreground">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav active="support" />
    </main>
  );
}

// ============================================
// MORE PAGE (empty)
// ============================================

function MorePage() {
  return (
    <main className="page-bg min-h-screen w-full font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[rgba(0,212,255,0.25)] blur-[120px]" />
      <BottomNav active="more" />
    </main>
  );
}

// ============================================
// BOTTOM NAVIGATION
// ============================================

function BottomNav({ active }: { active: string }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: IconComponents.House },
    { key: 'history', label: 'History', icon: IconComponents.Clock3 },
    { key: 'performance', label: 'Performance', icon: IconComponents.TrendingUp },
    { key: 'support', label: 'Support', icon: IconComponents.Send },
    { key: 'more', label: 'More', icon: IconComponents.MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-3 pb-3">
      <div className="glass-card grid grid-cols-5 gap-1 rounded-2xl px-2 py-2.5">
        {items.map(item => {
          const active_ = active === item.key;
          const Icon = item.icon;
          return (
            <button key={item.key}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-all active:scale-95 ${active_ ? 'bg-[rgba(0,212,255,0.15)] text-[var(--neon)]' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate', { detail: item.key }));
              }}>
              <Icon className={`h-5 w-5 ${active_ ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]' : ''}`} />
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================
// MAIN APP
// ============================================

const App: React.FC = () => {
  const [tier, setTier] = useState<string>('standard');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const init = async () => {
      try {
        const hasLicense = await verifyLicense();
        if (hasLicense) {
          setTier(getStoredTier());
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Listen for navigation events from bottom nav
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setPage(customEvent.detail);
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--neon)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has license
  const hasLicense = typeof window !== 'undefined' && (localStorage.getItem('cs_licence_key') || sessionStorage.getItem('cs_licence_key'));

  if (!hasLicense) {
    return <LicenseActivation onActivated={(t) => { setTier(t); setLoading(true); setTimeout(() => setLoading(false), 100); }} />;
  }

  // Render page
  switch (page) {
    case 'history':
      return <HistoryPage />;
    case 'performance':
      return <PerformancePage />;
    case 'support':
      return <SupportPage />;
    case 'more':
      return <MorePage />;
    default:
      return <Dashboard tier={tier} />;
  }
};

export default App;
