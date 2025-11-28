# 🚀 Manual Deployment Checklist for Tvi3W

You'll deploy manually to Render/Supabase/Vercel. Here's exactly what you need:

---

## ✅ Pre-Deployment Checklist

### 1. Get Google Gemini API Key (Do This First!)
- [ ] Go to: https://makersuite.google.com/app/apikey
- [ ] Create API key
- [ ] Copy it (you'll paste it in Render environment variables)

---

## 📦 Render Backend Deployment

### Step 1: Create PostgreSQL Database
- [ ] In Render dashboard → New + → PostgreSQL
- [ ] Name: `tvi3w-db`
- [ ] Choose: Free plan
- [ ] Create Database
- [ ] **Copy these values** (you'll need them):
  - Internal Database URL
  - Host
  - Username
  - Password

### Step 2: Deploy Backend
- [ ] New + → Web Service
- [ ] Connect repository: `Srujansai07/Tvi3w`
- [ ] Configure:
  - **Name**: `tvi3w-backend`
  - **Build command**: `npm install`
  - **Start command**: `npm start`
  - **Plan**: Free

### Step 3: Add Environment Variables
Click "Advanced" and add these (copy-paste ready):

```
GEMINI_API_KEY=paste_your_gemini_key_here
DB_NAME=tvi3w_db
DB_USER=paste_from_database
DB_PASSWORD=paste_from_database
DB_HOST=paste_from_database
DB_PORT=5432
SESSION_SECRET=tvi3w_super_secret_key_2024
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://localhost:8000
```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~3 minutes)
- [ ] **Copy your backend URL**: `https://tvi3w-backend-xxxxx.onrender.com`

---

## 🌐 Update Frontend for Production

Now that you have your backend URL, update these 3 files:

### File 1: `api-client.js` (line 2)
```javascript
const API_BASE_URL = 'https://your-backend-url-here.onrender.com';
```

### File 2: `app.js` (line ~32)
```javascript
this.socket = io('https://your-backend-url-here.onrender.com');
```

### File 3: `index.html` (line ~10)
```html
<script src="https://your-backend-url-here.onrender.com/socket.io/socket.io.js"></script>
```

**Then commit:**
```bash
git add .
git commit -m "Update API URLs for production backend"
git push
```

---

## 🎨 Vercel Frontend Deployment

- [ ] In Vercel dashboard → New Project
- [ ] Import: `Srujansai07/Tvi3w`
- [ ] Settings:
  - **Framework**: Other
  - **Root Directory**: `./`
  - **Build Command**: (leave empty)
- [ ] Deploy
- [ ] **Copy your frontend URL**: `https://tvi3w.vercel.app`

---

## 🔄 Final Step: Update CORS

- [ ] Go back to Render → `tvi3w-backend` → Environment
- [ ] Update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-vercel-url-here.vercel.app
```
- [ ] Save (backend will auto-redeploy)

---

## ✅ Testing

### Test 1: Backend Health
Visit: `https://your-backend-url.onrender.com/api/health`

Should see:
```json
{"status": "healthy", ...}
```

### Test 2: Frontend
- [ ] Visit your Vercel URL
- [ ] Open browser console (F12)
- [ ] Should see: `🔌 WebSocket connected`
- [ ] Should see notification: "🟢 Real-time connection active"

### Test 3: AI Analysis
- [ ] Click "Analysis" tab
- [ ] Click on LinkedIn/Twitter/Gmail card
- [ ] Click "Analyze" button
- [ ] Should see real AI insights (not simulated!)

---

## 🎉 When All Green, You're Live!

Your app will be at:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com

---

## 📝 Quick Reference

**Environment Variables You Need:**
1. `GEMINI_API_KEY` - from Google AI Studio
2. Database credentials - from Render PostgreSQL
3. Your backend URL - from Render Web Service
4. Your frontend URL - from Vercel

**Files to Update:**
1. `api-client.js` - backend URL
2. `app.js` - socket URL
3. `index.html` - socket script source

**Order:**
1. Deploy database (Render)
2. Deploy backend (Render) with env vars
3. Update frontend files with backend URL
4. Deploy frontend (Vercel)
5. Update CORS with frontend URL
6. Test everything

---

## 🆘 If Something Goes Wrong

**Backend won't start:**
- Check Render logs
- Verify all env vars are set
- Make sure database is running

**Frontend can't connect:**
- Check browser console errors
- Verify backend URL in files
- Check CORS setting

**No AI responses:**
- Verify GEMINI_API_KEY is correct
- Check Render backend logs

---

**Ready to deploy! Follow the checkboxes above ✅**
