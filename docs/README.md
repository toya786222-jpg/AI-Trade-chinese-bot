# AI Trader - Chinese Signals AI BOT PRO

## 📋 Project Overview

**Website:** Chinese Signals AI BOT PRO  
**Domain:** chinesesignalsbotpro.com  
**Purpose:** AI-powered Quotex trading signals  
**Platform:** Vercel (frontend) + Supabase (backend)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS |
| **Build** | Vite |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **Hosting** | Vercel |
| **Storage** | Cloudflare R2 (images) |
| **Analytics** | Tinybird |
| **Fonts** | Google Fonts (Sora + Manrope) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
AI Trader/
├── public/                    # Static assets
│   ├── index.html            # Main HTML
│   ├── favicon.ico           # Website icon
│   ├── ~flock.js             # Tinybird analytics
│   └── assets/               # Compiled JS/CSS bundles
│       ├── index-CPUH0PZx.js # Main React bundle
│       ├── license-Dat_DFyL.js # License system
│       ├── dashboard-Bp_0El2a.js # Dashboard (lazy)
│       ├── admin-C8ALViOD.js # Admin panel (lazy)
│       ├── upgrade-3iqIB4F3.js # Upgrade page (lazy)
│       └── ... (other lazy modules)
│
├── src/                       # Source code
│   ├── lib/                   # Library files
│   │   ├── supabase.ts       # Supabase configuration
│   │   └── license.ts        # License system
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── styles/                # CSS styles
│   └── App.tsx               # Main App component
│
├── docs/                      # Documentation
│   └── README.md             # This file
│
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── tsconfig.node.json         # TypeScript node config
```

---

## 🔐 License System

### Current Implementation

**Storage Keys:**
- `cs_licence_key` → User's license key
- `cs_licence_tier` → License tier (standard/pro/pro_max)
- `cs_device_id` → Hardware-bound device ID

**License Flow:**
```
1. User enters key: XXXX-XXXX-XXXX-XXXX
   ↓
2. Frontend validates format
   ↓
3. Supabase validates key in database
   ↓
4. Device ID binding (one device per key)
   ↓
5. Tier assigned (standard/pro/pro_max)
   ↓
6. License stored in localStorage
```

### License Tiers

| Tier | Features |
|------|----------|
| **Standard** | Basic signals, limited features |
| **Pro** | Advanced AI signals, real-time performance |
| **Pro Max** | All PRO features + custom training + 1-on-1 support |

---

## 🗄️ Database Structure

### Supabase Tables

#### 1. licenses
```sql
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, -- Format: XXXX-XXXX-XXXX-XXXX
  tier TEXT NOT NULL DEFAULT 'standard', -- standard/pro/pro_max
  device_id TEXT, -- Hardware-bound device ID
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP, -- NULL = never expires
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 2. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'standard',
  license_id UUID REFERENCES licenses(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 3. signals
```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair TEXT NOT NULL, -- e.g., EUR/USD, BTC/USD
  direction TEXT NOT NULL, -- call/put
  entry_price DECIMAL,
  expiry_time INTEGER, -- seconds
  result TEXT DEFAULT 'pending', -- pending/win/loss
  created_at TIMESTAMP DEFAULT now()
);
```

#### 4. performance
```sql
CREATE TABLE performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_trades INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  win_rate DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 5. history
```sql
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  signal_id UUID REFERENCES signals(id),
  action TEXT NOT NULL, -- followed/skipped
  result TEXT, -- win/loss/pending
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🔌 API Calls

### Supabase Auth API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/v1/token` | POST | Login/Signup |
| `/auth/v1/logout` | POST | Logout |
| `/auth/v1/user` | GET | Get current user |
| `/auth/v1/user` | PUT | Update user |
| `/auth/v1/otp` | POST | Send OTP |
| `/auth/v1/recover` | POST | Password reset |

### Supabase Database API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/rest/v1/licenses` | GET | Get license |
| `/rest/v1/licenses` | INSERT | Create license |
| `/rest/v1/licenses` | UPDATE | Update license |
| `/rest/v1/users` | GET | Get user profile |
| `/rest/v1/signals` | GET | Get signals |
| `/rest/v1/performance` | GET | Get performance |
| `/rest/v1/history` | GET | Get history |

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect GitHub repository**
2. **Set environment variables:**
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```
3. **Deploy**

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_TINYBIRD_TOKEN=your_tinybird_token
```

---

## 📝 License Key Format

**Format:** `XXXX-XXXX-XXXX-XXXX`

**Example:** `ABCD-1234-EFGH-5678`

**Rules:**
- Only uppercase letters (A-Z) and numbers (0-9)
- Exactly 4 characters per group
- 4 groups separated by hyphens

---

## 🔧 Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📞 Support

**Telegram:** [@ChineseSignalsBot](https://t.me/ChineseSignalsBot)

---

## ⚠️ Important Notes

1. **Replace Supabase credentials** in `src/lib/supabase.ts`
2. **Create Supabase tables** using the SQL above
3. **Set up Row Level Security (RLS)** in Supabase
4. **Test license activation** before deployment

---

*Last Updated: August 2026*
