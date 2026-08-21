// ============================================
// SUPABASE CONFIGURATION
// Chinese Signals AI BOT PRO
// ============================================

import { createClient } from '@supabase/supabase-js';

// Supabase Credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('YOUR_') || SUPABASE_ANON_KEY.includes('YOUR_')) {
  console.error('⚠️ Missing Supabase credentials! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Get user profile - from auth metadata
export const getUserProfile = async (_userId: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('User not found');
  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar_url: user.user_metadata?.avatar_url || '',
    tier: 'standard',
    license_id: '',
  };
};

// Validate license key using RPC function
export const validateLicense = async (key: string, deviceId: string) => {
  const { data, error } = await supabase
    .rpc('validate_license', {
      p_key: key,
      p_device_id: deviceId,
    });

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error('License key not found');
  }

  const result = data[0];

  if (!result.is_valid) {
    throw new Error('License key is invalid or expired');
  }

  // Also call activate_license to bind device
  const { data: activateData, error: activateError } = await supabase
    .rpc('activate_license', {
      p_key: key,
      p_device_id: deviceId,
    });

  if (activateError) throw activateError;

  if (activateData && activateData.length > 0 && !activateData[0].success) {
    throw new Error(activateData[0].message || 'License activation failed');
  }

  return {
    ok: true,
    tier: result.tier,
    licenseId: result.license_id,
  };
};

// Get signals
export const getSignals = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

// Get user performance - calculated from history
export const getUserPerformance = async (userId: string) => {
  const { data, error } = await supabase
    .from('history')
    .select('result')
    .eq('user_id', userId);
  if (error) throw error;
  const totalTrades = data?.length || 0;
  const wins = data?.filter((h: { result: string }) => h.result === 'win').length || 0;
  const losses = data?.filter((h: { result: string }) => h.result === 'loss').length || 0;
  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
  return { total_trades: totalTrades, wins, losses, win_rate: winRate };
};

// Get user history
export const getUserHistory = async (userId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('history')
    .select('*, signals(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

// Admin: Create license key
export const createLicense = async (key: string, tier: string, expiresAt?: string) => {
  const { data, error } = await supabase
    .from('licenses')
    .insert({
      license_key: key,
      tier,
      status: 'active',
      expiry_date: expiresAt || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Admin: Deactivate license key
export const deactivateLicense = async (licenseId: string) => {
  const { error } = await supabase
    .from('licenses')
    .update({ status: 'blocked' })
    .eq('id', licenseId);
  if (error) throw error;
};

// Admin: Get all users
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*, licenses(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Admin: Get all licenses
export const getAllLicenses = async () => {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export default supabase;
