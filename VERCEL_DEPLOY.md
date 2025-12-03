# 🚀 Vercel Deployment Guide - Next.js Frontend

## Quick Deploy

Your Next.js app is ready to deploy to Vercel! Follow these steps:

### Step 1: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your **`Srujansai07/Tvi3w`** repository

### Step 2: Configure Project Settings

> [!IMPORTANT]
> **Root Directory**
> Set the **Root Directory** to `client` (this is where your Next.js app lives)

**Framework Preset**: Next.js (Auto-detected) ✅

**Build Command**: `npm run build` (Auto-filled) ✅

**Output Directory**: `.next` (Auto-filled) ✅

**Install Command**: `npm install` (Auto-filled) ✅

### Step 3: Environment Variables (Optional)

If your Next.js app needs to talk to the backend, add:

- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://tvi3w-production.up.railway.app`

(The `NEXT_PUBLIC_` prefix makes it available in the browser)

### Step 4: Deploy!

Click **"Deploy"** and wait ~2 minutes.

---

## After Deployment

Once deployed, Vercel will give you a URL like:
`https://tvi3w.vercel.app`

### Verification Checklist

- [ ] Visit your Vercel URL
- [ ] You should see the "Tvi3W" landing page
- [ ] Check browser console for errors
- [ ] Click "Get Started" (it won't work yet, we need to build the dashboard next)

---

## Your Complete Stack (After This Deploy)

✅ **Backend**: Railway (`https://tvi3w-production.up.railway.app`)
✅ **Database**: Railway PostgreSQL
✅ **Frontend**: Vercel (`https://tvi3w.vercel.app`)

**All systems operational!** 🎉
