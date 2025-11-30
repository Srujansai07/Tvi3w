# 🚂 Railway Deployment Guide for Tvi3W

## Step 1: Deploy Backend to Railway

### 1.1 Create New Project
1. Go to Railway dashboard: https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: **`Srujansai07/Tvi3w`**

### 1.2 Configure Service
Railway will auto-detect Node.js. Verify:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `/` (default)

### 1.3 Add Environment Variables
Click **"Variables"** tab and add these:

**Copy from `railway.env` file:**

```
GEMINI_API_KEY=AIzaSyDzH-UHaBU3glILoOr9moaR8aGeg88tWv8
DATABASE_URL=postgresql://postgres:231100813aiiTgn@db.ptkoregmemknufnpnnfc.supabase.co:5432/postgres
SESSION_SECRET=tvi3w_super_secret_key_2024_production
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://localhost:8000
```

### 1.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Click **"Settings"** → **"Networking"** → **"Generate Domain"**
4. **Copy your domain**: `https://your-app.up.railway.app`

---

## Step 2: Update Frontend Files

### Once you have your Railway URL, I need to update 3 files:

**Tell me your Railway URL and I'll update:**
1. `api-client.js`
2. `app.js`
3. `index.html`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Import Project
1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Import: **`Srujansai07/Tvi3w`**

### 3.2 Configure
- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: (leave empty)
- **Output Directory**: `./`
- **Install Command**: (leave empty)

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait for deployment (~1 minute)
3. **Copy your Vercel URL**: `https://tvi3w-xxxxx.vercel.app`

---

## Step 4: Update CORS

### Once you have Vercel URL:
1. Go to Railway → Your service → **Variables**
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
   ```
3. Service will auto-redeploy

---

## ✅ Testing

### Backend Health Check
Visit: `https://your-railway-url.up.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

### Supabase Connection
Check Railway logs for:
- `✅ PostgreSQL Database connected successfully`
- `✅ Database models synced`

### Frontend Connection
1. Visit your Vercel URL
2. Open browser console (F12)
3. Look for:
   - `🔌 WebSocket connected`
   - Notification: "🟢 Real-time connection active"

---

## 🎯 Next Steps

**Tell me:**
1. Your Railway deployment URL
2. Your Vercel deployment URL

**And I'll:**
- Update all frontend files
- Update CORS settings
- Commit and push changes
- Help you test everything!

---

**Your Project IDs (for reference):**
- Railway: 4a3c91de-52ca-4179-9910-6515371408da
- Vercel: prj_BH0CG3FkTGXBcsTFoGTj0WUV9Q5X
- Supabase: ptkoregmemknufnpnnfc
