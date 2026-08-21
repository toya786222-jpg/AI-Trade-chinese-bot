// ============================================
// MAIN APP - Chinese Signals AI BOT PRO
// ============================================

import React, { useState, useEffect } from 'react';
import { activateLicense, verifyLicense, getStoredTier, isPro, isProMax } from './lib/license';
import { getCurrentUser, getUserProfile, getUserPerformance } from './lib/supabase';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  tier: string;
  license_id: string;
}

interface LicenseFormProps {
  onActivated: (tier: string) => void;
}

interface DashboardProps {
  user: User;
  tier: string;
}

// ============================================
// LICENSE ACTIVATION FORM
// ============================================

const LicenseForm: React.FC<LicenseFormProps> = ({ onActivated }) => {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          ENTER YOUR <span className="text-cyan-400">LICENSE KEY</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="w-full bg-transparent border border-cyan-500/30 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            maxLength={19}
            disabled={loading}
          />
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-2xl hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'ACTIVATING...' : 'ACTIVATE LICENSE'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD
// ============================================

const Dashboard: React.FC<DashboardProps> = ({ user, tier }) => {
  const [stats, setStats] = useState({
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const perf = await getUserPerformance(user.id);
        setStats({
          totalTrades: perf.total_trades || 0,
          wins: perf.wins || 0,
          losses: perf.losses || 0,
          winRate: perf.win_rate || 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    loadStats();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Chinese Signals AI BOT PRO</h1>
        <p className="text-gray-400 mt-2">Welcome, {user.full_name || user.email}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
          {tier.toUpperCase()} TIER
        </span>
      </header>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="glass-card p-4 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
        </div>
        
        <div className="glass-card p-4 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
        </div>
        
        <div className="glass-card p-4 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">Wins</p>
          <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
        </div>
        
        <div className="glass-card p-4 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">Losses</p>
          <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
        </div>
      </div>

      {/* Premium Features */}
      {isPro() && (
        <div className="mt-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">PRO Features</h3>
          <ul className="space-y-2">
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>Advanced AI Signals</span>
            </li>
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>Real-time Performance</span>
            </li>
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-cyan-400">✓</span>
              <span>Priority Support</span>
            </li>
          </ul>
        </div>
      )}

      {isProMax() && (
        <div className="mt-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">PRO MAX Features</h3>
          <ul className="space-y-2">
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-yellow-400">★</span>
              <span>All PRO Features</span>
            </li>
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-yellow-400">★</span>
              <span>Custom AI Training</span>
            </li>
            <li className="glass-card p-3 rounded-xl flex items-center gap-3">
              <span className="text-yellow-400">★</span>
              <span>1-on-1 Support</span>
            </li>
          </ul>
        </div>
      )}

      <div className="mt-8 text-center">
        <a
          href="https://t.me/ChineseSignalsBot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl hover:opacity-90"
        >
          OPEN TELEGRAM
        </a>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string>('standard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user has valid license
        const hasLicense = await verifyLicense();
        if (hasLicense) {
          setTier(getStoredTier());
          
          // Try to get user from Supabase
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const profile = await getUserProfile(currentUser.id);
            setUser(profile);
          }
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LicenseForm onActivated={(t) => {
      setTier(t);
      setLoading(true);
      const init = async () => {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const profile = await getUserProfile(currentUser.id);
            setUser(profile);
          }
        } catch (err) {
          console.error('Re-init error:', err);
        } finally {
          setLoading(false);
        }
      };
      init();
    }} />;
  }

  return <Dashboard user={user} tier={tier} />;
};

export default App;
