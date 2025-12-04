# 🔧 Vercel Environment Variable Setup Instructions

## ⚠️ CRITICAL - Most API Failures Are Due to Missing Environment Variables!

Go to: **https://vercel.com/dashboard** → Your Project → **Settings** → **Environment Variables**

---

## Required Variables

Add these **6 environment variables** in Vercel:

### 1. NEXT_PUBLIC_SUPABASE_URL
- **Value**: `https://ptkoregmemknufnpnnfc.supabase.co`
- **Environment**: Production, Preview, Development

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDAzODQsImV4cCI6MjA3OTkxNjM4NH0.QGlW7MYaUJmGt9GyqjnQSHy41vByWxqONkVtLcAVigQ`
- **Environment**: Production, Preview, Development

### 3. SUPABASE_SERVICE_ROLE_KEY
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM0MDM4NCwiZXhwIjoyMDc5OTE2Mzg0fQ.KzAHJ-_t3La-vmvSR6dNsVEaElquTHNMxboSD4bttzc`
- **Environment**: Production, Preview, Development
- **⚠️ KEEP SECRET** - Server-side only

### 4. DATABASE_URL
- **Value**: `postgresql://postgres:231100813aiiTgn@db.ptkoregmemknufnpnnfc.supabase.co:5432/postgres`
- **Environment**: Production, Preview, Development
- **⚠️ KEEP SECRET** - Server-side only

### 5. GEMINI_API_KEY ⭐ **CRITICAL FOR ALL FEATURES**
- **Value**: `AIzaSyDzH-UHaBU3glILoOr9moaR8aGeg88tWv8`
- **Environment**: Production, Preview, Development
- **⚠️ KEEP SECRET** - Server-side only
- **❗ This is why Analysis/Meetings/Business pages are broken!**

### 6. NEXT_PUBLIC_APP_URL
- **Value**: `https://tvi3w-ai.vercel.app`
- **Environment**: Production, Preview

---

## After Adding Variables

1. **Redeploy** your application
2. Check **Deployments** tab for success
3. Test all features again

---

## How to Verify They're Set

After deployment, check the Vercel logs for:
- ✅ "Build succeeded"
- ❌ Any "undefined" errors related to env vars
