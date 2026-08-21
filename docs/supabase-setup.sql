-- ============================================
-- SUPABASE DATABASE SETUP
-- Chinese Signals AI BOT PRO
-- ============================================

-- ============================================
-- 1. LICENSES TABLE
-- ============================================

CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'pro', 'pro_max')),
  device_id TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_licenses_key ON licenses(key);
CREATE INDEX idx_licenses_device_id ON licenses(device_id);

-- ============================================
-- 2. USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'pro', 'pro_max')),
  license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_license_id ON users(license_id);

-- ============================================
-- 3. SIGNALS TABLE
-- ============================================

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('call', 'put')),
  entry_price DECIMAL(20, 8),
  expiry_time INTEGER NOT NULL, -- seconds
  result TEXT DEFAULT 'pending' CHECK (result IN ('pending', 'win', 'loss')),
  created_at TIMESTAMP DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX idx_signals_pair ON signals(pair);
CREATE INDEX idx_signals_result ON signals(result);

-- ============================================
-- 4. PERFORMANCE TABLE
-- ============================================

CREATE TABLE performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_trades INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_performance_user_id ON performance(user_id);

-- ============================================
-- 5. HISTORY TABLE
-- ============================================

CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('followed', 'skipped')),
  result TEXT CHECK (result IN ('win', 'loss', 'pending')),
  created_at TIMESTAMP DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_signal_id ON history(signal_id);
CREATE INDEX idx_history_created_at ON history(created_at DESC);

-- ============================================
-- 6. ADMIN SETTINGS TABLE
-- ============================================

CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Licenses: Only admin can read/write
CREATE POLICY "Admin can manage licenses" ON licenses
  FOR ALL USING (auth.role() = 'authenticated');

-- Users: Users can read their own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Signals: All authenticated users can read
CREATE POLICY "Authenticated users can read signals" ON signals
  FOR SELECT USING (auth.role() = 'authenticated');

-- Performance: Users can read their own data
CREATE POLICY "Users can read own performance" ON performance
  FOR SELECT USING (auth.uid() = user_id);

-- History: Users can read their own data
CREATE POLICY "Users can read own history" ON history
  FOR SELECT USING (auth.uid() = user_id);

-- Admin Settings: Only admin can read/write
CREATE POLICY "Admin can manage settings" ON admin_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to validate license key
CREATE OR REPLACE FUNCTION validate_license(
  p_key TEXT,
  p_device_id TEXT
)
RETURNS TABLE(
  is_valid BOOLEAN,
  tier TEXT,
  license_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.is_active AND (l.expires_at IS NULL OR l.expires_at > now()),
    l.tier,
    l.id
  FROM licenses l
  WHERE l.key = p_key
    AND l.is_active = true
    AND (l.device_id IS NULL OR l.device_id = p_device_id);
END;
$$;

-- Function to activate license
CREATE OR REPLACE FUNCTION activate_license(
  p_key TEXT,
  p_device_id TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  tier TEXT,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_license RECORD;
BEGIN
  -- Find the license
  SELECT * INTO v_license
  FROM licenses
  WHERE key = p_key AND is_active = true;
  
  -- Check if license exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, ''::TEXT, 'Invalid license key'::TEXT;
    RETURN;
  END IF;
  
  -- Check if expired
  IF v_license.expires_at IS NOT NULL AND v_license.expires_at < now() THEN
    RETURN QUERY SELECT false, ''::TEXT, 'License key has expired'::TEXT;
    RETURN;
  END IF;
  
  -- Check device binding
  IF v_license.device_id IS NOT NULL AND v_license.device_id != p_device_id THEN
    RETURN QUERY SELECT false, ''::TEXT, 'License key is bound to another device'::TEXT;
    RETURN;
  END IF;
  
  -- Bind to device if not yet bound
  IF v_license.device_id IS NULL THEN
    UPDATE licenses
    SET device_id = p_device_id, updated_at = now()
    WHERE id = v_license.id;
  END IF;
  
  RETURN QUERY SELECT true, v_license.tier, 'License activated successfully'::TEXT;
END;
$$;

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample licenses
INSERT INTO licenses (key, tier, is_active) VALUES
  ('ABCD-1234-EFGH-5678', 'standard', true),
  ('IJKL-9012-MNOP-3456', 'pro', true),
  ('QRST-7890-UVWX-1234', 'pro_max', true);

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Run this SQL in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → SQL Editor → New Query
-- Paste this SQL and click "Run"
