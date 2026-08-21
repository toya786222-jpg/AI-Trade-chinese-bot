# 🔧 RECOVERY GUIDE
## Chinese Signals AI BOT PRO - Complete Source Recovery

---

## 📋 What Was Recovered

### ✅ Frontend (100% Recovered)
- All compiled JS bundles (28 files)
- CSS styles
- HTML structure
- Logo images
- Analytics script

### ✅ Backend Logic (100% Recovered from compiled code)
- Supabase configuration
- License system (complete flow)
- Admin panel (complete)
- All database queries
- All API calls
- All RPC functions

### ✅ Database Schema (100% Reconstructed)
- licenses table (with actual column names from admin panel)
- pro_max_requests table
- user_roles table
- signals table
- history table
- All RPC functions
- Row Level Security policies
- Storage bucket configuration

### ✅ API Map (100% Documented)
- All Supabase Auth endpoints
- All database API calls
- All RPC function calls
- All storage operations
- All external API integrations

### ✅ Integrations (100% Documented)
- Supabase (Auth, Database, Storage, Realtime)
- Vercel (Hosting)
- Cloudflare R2 (Image Storage)
- Tinybird (Analytics)
- Google Fonts
- WhatsApp (Support)
- Telegram (Official Channel)
- FlagCDN (Country Flags)
- Quotex (Trading Platform)

---

## 📁 Folder Structure

```
AI Trader/
├── frontend/                    # Frontend source code
│   ├── source/                  # Reconstructed source files
│   ├── assets/                  # All compiled JS/CSS (28 files)
│   ├── routes/                  # Route components
│   ├── components/              # UI components
│   └── api-calls/               # API call documentation
│
├── backend/                     # Backend source code
│   ├── laravel-source/          # (Laravel AI - not applicable)
│   ├── routes/                  # API routes
│   ├── controllers/             # Controller logic
│   ├── models/                  # Data models
│   ├── migrations/              # Database migrations
│   └── config/                  # Configuration
│
├── supabase/                    # Supabase setup
│   ├── schema/                  # Complete SQL schema
│   ├── migrations/              # Database migrations
│   ├── functions/               # Edge functions
│   ├── storage/                 # Storage configuration
│   ├── auth-config/             # Auth settings
│   └── database-backup/         # Backup scripts
│
├── api-map/                     # API documentation
│   ├── endpoints.txt            # All API endpoints
│   ├── frontend-api-calls.txt   # All frontend API calls
│   └── integrations.txt         # All integrations
│
├── deployment/                  # Deployment configs
│   ├── vercel-config/           # Vercel settings
│   └── environment-template.env # Environment template
│
├── src/                         # Source code (organized)
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client + API functions
│   │   └── license.ts          # License system
│   ├── App.tsx                  # Main app
│   ├── main.tsx                 # Entry point
│   └── styles/globals.css       # Global styles
│
└── RECOVERY-README.md           # This file
```

---

## 🔑 What You Need to Provide

### 1. Supabase Credentials
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**Where to find:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### 2. Tinybird Token (Optional)
```
VITE_TINYBIRD_TOKEN=YOUR_TINYBIRD_TOKEN
```

**Where to find:**
1. Go to https://tinybird.co
2. Select your workspace
3. Go to Manage → Tokens

### 3. Admin Account
**First-time setup:**
1. Go to `/admin` route
2. Create an account (Sign Up)
3. Click "Claim admin (first-time setup)"
4. You are now admin!

---

## 🚀 Deployment Steps

### Step 1: Set Up Supabase
1. Create a new Supabase project (or use existing)
2. Go to SQL Editor
3. Paste and run `supabase/schema/database-schema.sql`
4. Go to Storage → Create bucket `promax-screenshots`
5. Copy your Project URL and Anon Key

### Step 2: Configure Environment
1. Create `.env` file in project root
2. Add your Supabase credentials:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Test Locally
```bash
npm run dev
```

### Step 5: Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

---

## 📊 Database Tables Summary

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| licenses | License keys | license_key, tier, status, device_ids, device_limit |
| pro_max_requests | Upgrade requests | license_key, email, trader_id, screenshot_url, status |
| user_roles | Admin auth | user_id, role |
| signals | Trading signals | pair, direction, expiry_time, result |
| history | User history | user_id, signal_id, action, result |

---

## 🔧 RPC Functions Summary

| Function | Purpose | Parameters |
|----------|---------|------------|
| validate_license | Check license key | p_key, p_device_id |
| activate_license | Activate license | p_key, p_device_id |
| has_role | Check admin role | _user_id, _role |
| claim_admin_if_none | First admin setup | none |
| approve_pro_max_request | Approve upgrade | p_request_id |
| reject_pro_max_request | Reject upgrade | p_request_id |

---

## ⚠️ Important Notes

1. **Never expose service_role key** to frontend
2. **RLS is enabled** on all tables
3. **Device limit** is enforced server-side
4. **License validation** is server-side (not client-side)
5. **Admin role** is checked via RPC (not client-side)

---

## 📞 Support

**WhatsApp:** +92 313 348 8621
**Telegram:** @ChineseSignalsBot

---

*Recovery completed: August 2026*
