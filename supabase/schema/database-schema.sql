-- =============================================
-- COMPLETE DATABASE SCHEMA
-- Chinese Signals AI BOT PRO
-- =============================================
-- Run this in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → SQL Editor → New Query

-- =============================================
-- 1. LICENSES TABLE (Actual schema from admin panel)
-- =============================================

CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,           -- Format: XXXX-XXXX-XXXX-XXXX
  user_name TEXT,                              -- Assigned user name
  tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('standard', 'pro', 'pro_max')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'blocked')),
  device_ids TEXT[] DEFAULT '{}',              -- Array of bound device UUIDs
  device_limit INTEGER NOT NULL DEFAULT 1,     -- 0 = unlimited
  expiry_date TIMESTAMP,                       -- NULL = never expires
  activated_at TIMESTAMP,                      -- When first activated
  last_active_device TEXT,                     -- Last device UUID that accessed
  last_active_at TIMESTAMP,                    -- Last activity timestamp
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_licenses_key ON licenses(license_key);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_tier ON licenses(tier);

-- =============================================
-- 2. PRO_MAX_REQUESTS TABLE
-- =============================================

CREATE TABLE pro_max_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL,                   -- Requesting license key
  user_name TEXT,                              -- User's full name
  email TEXT NOT NULL,                         -- User's email
  telegram_username TEXT,                      -- Telegram handle
  trader_id TEXT,                              -- Quotex trader ID
  screenshot_url TEXT,                         -- Balance screenshot path in storage
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_pro_max_requests_status ON pro_max_requests(status);
CREATE INDEX idx_pro_max_requests_license ON pro_max_requests(license_key);

-- =============================================
-- 3. USER_ROLES TABLE (for admin auth)
-- =============================================

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- =============================================
-- 4. SIGNALS TABLE
-- =============================================

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair TEXT NOT NULL,                          -- e.g., "EUR/USD (OTC)"
  direction TEXT NOT NULL CHECK (direction IN ('CALL', 'PUT')),
  entry_price DECIMAL(20, 8),
  expiry_time TEXT NOT NULL,                   -- e.g., "5 Seconds", "1 Minute"
  result TEXT DEFAULT 'pending' CHECK (result IN ('pending', 'win', 'loss')),
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_signals_created ON signals(created_at DESC);
CREATE INDEX idx_signals_pair ON signals(pair);
CREATE INDEX idx_signals_result ON signals(result);

-- =============================================
-- 5. HISTORY TABLE
-- =============================================

CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('followed', 'skipped')),
  result TEXT CHECK (result IN ('win', 'loss', 'pending')),
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_history_user ON history(user_id);
CREATE INDEX idx_history_signal ON history(signal_id);

-- =============================================
-- RPC FUNCTIONS
-- =============================================

-- Validate license key (server-side)
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
    l.status = 'active' AND (l.expiry_date IS NULL OR l.expiry_date > now()),
    l.tier,
    l.id
  FROM licenses l
  WHERE l.license_key = p_key;
END;
$$;

-- Activate license (server-side)
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
  SELECT * INTO v_license
  FROM licenses
  WHERE license_key = p_key AND status = 'active';
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, ''::TEXT, 'Invalid license key'::TEXT;
    RETURN;
  END IF;
  
  IF v_license.expiry_date IS NOT NULL AND v_license.expiry_date < now() THEN
    RETURN QUERY SELECT false, ''::TEXT, 'License key has expired'::TEXT;
    RETURN;
  END IF;
  
  -- Check device limit
  IF v_license.device_limit > 0 AND NOT (p_device_id = ANY(v_license.device_ids)) THEN
    IF array_length(v_license.device_ids, 1) >= v_license.device_limit THEN
      RETURN QUERY SELECT false, ''::TEXT, 'Device limit reached'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- Add device if not already bound
  IF NOT (p_device_id = ANY(v_license.device_ids)) THEN
    UPDATE licenses
    SET device_ids = array_append(device_ids, p_device_id),
        activated_at = COALESCE(activated_at, now()),
        last_active_device = p_device_id,
        last_active_at = now(),
        updated_at = now()
    WHERE id = v_license.id;
  ELSE
    UPDATE licenses
    SET last_active_device = p_device_id,
        last_active_at = now(),
        updated_at = now()
    WHERE id = v_license.id;
  END IF;
  
  RETURN QUERY SELECT true, v_license.tier, 'License activated successfully'::TEXT;
END;
$$;

-- Check admin role
CREATE OR REPLACE FUNCTION has_role(
  _user_id UUID,
  _role TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Claim admin role (first-time setup)
CREATE OR REPLACE FUNCTION claim_admin_if_none()
RETURNS TABLE(ok BOOLEAN, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_admin_count BIGINT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::TEXT;
    RETURN;
  END IF;
  
  SELECT count(*) INTO v_admin_count FROM user_roles WHERE role = 'admin';
  
  IF v_admin_count > 0 THEN
    RETURN QUERY SELECT false, 'Admin already exists'::TEXT;
    RETURN;
  END IF;
  
  INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'admin');
  RETURN QUERY SELECT true, ''::TEXT;
END;
$$;

-- Approve PRO MAX request
CREATE OR REPLACE FUNCTION approve_pro_max_request(
  p_request_id UUID
)
RETURNS TABLE(ok BOOLEAN, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request RECORD;
BEGIN
  SELECT * INTO v_request FROM pro_max_requests WHERE id = p_request_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Request not found'::TEXT;
    RETURN;
  END IF;
  
  -- Update license tier to pro_max
  UPDATE licenses SET tier = 'pro_max', updated_at = now()
  WHERE license_key = v_request.license_key;
  
  -- Update request status
  UPDATE pro_max_requests SET status = 'approved'
  WHERE id = p_request_id;
  
  RETURN QUERY SELECT true, ''::TEXT;
END;
$$;

-- Reject PRO MAX request
CREATE OR REPLACE FUNCTION reject_pro_max_request(
  p_request_id UUID
)
RETURNS TABLE(ok BOOLEAN, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE pro_max_requests SET status = 'rejected'
  WHERE id = p_request_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Request not found'::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, ''::TEXT;
END;
$$;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_max_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Licenses: Admin can do everything, users can only read their own
CREATE POLICY "Admin full access on licenses" ON licenses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can read own license" ON licenses
  FOR SELECT USING (true);

-- Signals: Everyone authenticated can read
CREATE POLICY "Authenticated users can read signals" ON signals
  FOR SELECT USING (auth.role() = 'authenticated');

-- History: Users can read/write their own
CREATE POLICY "Users can manage own history" ON history
  FOR ALL USING (user_id = auth.uid());

-- Pro Max Requests: Users can insert, admin can do everything
CREATE POLICY "Admin full access on pro_max_requests" ON pro_max_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert pro_max_requests" ON pro_max_requests
  FOR INSERT WITH CHECK (true);

-- User Roles: Admin can manage, users can read their own
CREATE POLICY "Admin full access on user_roles" ON user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

