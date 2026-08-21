// ============================================
// LICENSE SYSTEM - STRONG VERSION
// Chinese Signals AI BOT PRO
// ============================================

import { validateLicense } from './supabase';

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
    // Generate unique device ID
    deviceId = crypto.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID, deviceId);
  }
  return deviceId;
};

// ============================================
// LICENSE OPERATIONS
// ============================================

// Get stored license key
export const getStoredLicense = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LICENSE_KEY) || sessionStorage.getItem(LICENSE_KEY);
};

// Store license key
export const storeLicense = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LICENSE_KEY, key);
  }
};

// Get stored tier
export const getStoredTier = (): string => {
  if (typeof window === 'undefined') return 'standard';
  return localStorage.getItem(LICENSE_TIER) || 'standard';
};

// Store tier
export const storeTier = (tier: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LICENSE_TIER, tier);
  }
};

// Clear all license data
export const clearLicense = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LICENSE_KEY);
    localStorage.removeItem(LICENSE_TIER);
    sessionStorage.removeItem(LICENSE_KEY);
  }
};

// ============================================
// MAIN LICENSE ACTIVATION FUNCTION
// ============================================

export const activateLicense = async (key: string): Promise<{ ok: boolean; tier?: string; error?: string }> => {
  try {
    // Validate key format
    const keyRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyRegex.test(key)) {
      return { ok: false, error: 'Invalid key format. Use: XXXX-XXXX-XXXX-XXXX' };
    }
    
    // Get device ID
    const deviceId = getDeviceId();
    
    // Validate with Supabase backend
    const result = await validateLicense(key, deviceId);
    
    if (result.ok) {
      // Store license data locally
      storeLicense(key);
      storeTier(result.tier);
      
      return {
        ok: true,
        tier: result.tier,
      };
    }
    
    return { ok: false, error: 'License validation failed' };
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
    
    const deviceId = getDeviceId();
    const result = await validateLicense(key, deviceId);
    return result.ok;
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
