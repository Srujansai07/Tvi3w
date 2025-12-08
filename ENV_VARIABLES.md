# ✅ COMPLETE Environment Variables for Tvi3W Next

## 🔐 All Environment Variables (6 Total)

### For Local Development (.env.local)
```env
# Supabase - Public (safe for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://ptkoregmemknufnpnnfc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDAzODQsImV4cCI6MjA3OTkxNjM4NH0.QGlW7MYaUJmGt9GyqjnQSHy41vByWxqONkVtLcAVigQ

# Supabase - Server-side only (NEVER expose in frontend!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM0MDM4NCwiZXhwIjoyMDc5OTE2Mzg0fQ.KzAHJ-_t3La-vmvSR6dNsVEaElquTHNMxboSD4bttzc

# Database - Direct PostgreSQL connection
DATABASE_URL=postgresql://postgres:231100813aiiTgn@db.ptkoregmemknufnpnnfc.supabase.co:5432/postgres

# Google Gemini AI
GEMINI_API_KEY=AIzaSyDzH-UHaBU3glILoOr9moaR8aGeg88tWv8

# App URL
NEXT_PUBLIC_APP_URL=https://tvi3w-v2.vercel.app
```

### For Vercel Production
```env
# Same as above, but change:
NEXT_PUBLIC_APP_URL=https://tvi3w-ai.vercel.app
```

---

## 📋 Setup Instructions

### Local Development (.env.local):
1. Create `.env.local` in project root
2. Copy ALL 6 variables above
3. Save and run `npm run dev`

### Vercel Deployment:
Add these **6 environment variables** in Vercel Dashboard → Settings → Environment Variables:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY` ⚠️
4. `DATABASE_URL` ⚠️
5. `GEMINI_API_KEY` ⚠️
6. `NEXT_PUBLIC_APP_URL`

---

## 🔑 What Each Key Does

| Variable | Purpose | Where Used |
|----------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Frontend + Backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key (RLS enforced) | Frontend + Backend |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access (bypasses RLS) | **Backend only** |
| `DATABASE_URL` | Direct PostgreSQL connection | **Backend only** (Prisma) |
| `GEMINI_API_KEY` | Google AI API key | **Backend only** |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | Frontend + Backend |

---

## ⚠️ Security Rules

### ✅ Safe for Frontend (NEXT_PUBLIC_*)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### 🚫 NEVER Expose in Frontend
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access!
- `DATABASE_URL` - Contains password!
- `GEMINI_API_KEY` - Costs money if leaked!

All sensitive keys are in `.gitignore` and won't be committed to GitHub.
