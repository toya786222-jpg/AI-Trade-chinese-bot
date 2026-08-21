// ============================================
// LICENSE SYSTEM - Chinese Signals AI BOT PRO
// ============================================

import { supabase } from './supabase';

// Storage Keys
const LICENSE_KEY = 'cs_licence_key';
const LICENSE_TIER = 'cs_licence_tier';
const DEVICE_ID = 'cs_device_id';

// ============================================
// DEVICE ID GENERATION
// ============================================

export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let deviceId = localStorage.getItem(DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID, deviceId);
  }
  return deviceId;
};

// ============================================
// LICENSE OPERATIONS
// ============================================

export const getStoredLicense = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LICENSE_KEY) || sessionStorage.getItem(LICENSE_KEY);
};

export const storeLicense = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LICENSE_KEY, key);
  }
};

export const getStoredTier = (): string => {
  if (typeof window === 'undefined') return 'standard';
  return localStorage.getItem(LICENSE_TIER) || 'standard';
};

export const storeTier = (tier: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LICENSE_TIER, tier);
  }
};

export const clearLicense = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LICENSE_KEY);
    localStorage.removeItem(LICENSE_TIER);
    sessionStorage.removeItem(LICENSE_KEY);
  }
};

// ============================================
// MAIN LICENSE ACTIVATION
// ============================================

export const activateLicense = async (key: string): Promise<{ ok: boolean; tier?: string; error?: string }> => {
  try {
    const keyRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyRegex.test(key)) {
      return { ok: false, error: 'Invalid key format. Use: XXXX-XXXX-XXXX-XXXX' };
    }
    
    const deviceId = getDeviceId();
    
    // Try Supabase validation if configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_')) {
      try {
        const { data, error } = await supabase
          .rpc('validate_license', {
            p_key: key,
            p_device_id: deviceId,
          });

        if (!error && data && data.length > 0 && data[0].is_valid) {
          const tier = data[0].tier || 'pro';
          storeLicense(key);
          storeTier(tier);
          
          // Also try to activate
          try {
            await supabase.rpc('activate_license', {
              p_key: key,
              p_device_id: deviceId,
            });
          } catch { /* ignore */ }
          
          return { ok: true, tier };
        }
      } catch {
        // Fall through to local validation
      }
    }
    
    // Local validation: any properly formatted key is accepted
    storeLicense(key);
    const tier = key.includes('MAX') || key.includes('MAX') ? 'pro_max' : 'pro';
    storeTier(tier);
    
    return { ok: true, tier };
  } catch (error: any) {
    console.error('License activation error:', error);
    return { 
      ok: false, 
      error: error.message || 'License activation failed' 
    };
  }
};

// ============================================
// LICENSE VERIFICATION (on page load)
// ============================================

export const verifyLicense = async (): Promise<boolean> => {
  try {
    const key = getStoredLicense();
    if (!key) return false;
    
    // Simple check: if key is stored, it's valid
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_')) {
      try {
        const deviceId = getDeviceId();
        const { data } = await supabase.rpc('validate_license', {
          p_key: key,
          p_device_id: deviceId,
        });
        
        if (data && data.length > 0) {
          if (data[0].is_valid) {
            storeTier(data[0].tier || 'pro');
            return true;
          } else {
            clearLicense();
            return false;
          }
        }
      } catch {
        // Fall through
      }
    }
    
    // If key exists locally, consider it valid
    return true;
  } catch {
    clearLicense();
    return false;
  }
};

// ============================================
// TIER CHECKS
// ============================================

export const isPro = (): boolean => {
  const tier = getStoredTier();
  return tier === 'pro' || tier === 'pro_max';
};

export const isProMax = (): boolean => {
  return getStoredTier() === 'pro_max';
};

export const isStandard = (): boolean => {
  return getStoredTier() === 'standard';
};

export default {
  getDeviceId,
  getStoredLicense,
  storeLicense,
  getStoredTier,
  storeTier,
  clearLicense,
  activateLicense,
  verifyLicense,
  isPro,
  isProMax,
  isStandard,
};
