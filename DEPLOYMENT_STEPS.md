# 🚀 Tvi3W - Step-by-Step Render Deployment Guide

## Prerequisites Checklist
- [x] GitHub repository: https://github.com/Srujansai07/Tvi3w
- [ ] Render account (we'll create this)
- [ ] Google Gemini API key

---

## Step 1: Create Render Account (5 minutes)

### 1.1 Sign Up
1. Go to **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your repositories

> ✅ **Why GitHub?** Easier deployment and automatic updates when you push code!

---

## Step 2: Deploy PostgreSQL Database (3 minutes)

### 2.1 Create Database
1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `tvi3w-db`
   - **Database**: `tvi3w_db`
   - **User**: `tvi3w_user` (or leave default)
   - **Region**: Choose closest to you
   - **Plan**: **Free** (sufficient for testing)

4. Click **"Create Database"**

### 2.2 Save Connection Details
After creation, you'll see:
- **Internal Database URL** (copy this for later)
- **External Database URL** (for local testing)
- **Host**, **Port**, **Database name**, **Username**, **Password**

> 📝 **Keep these handy!** You'll need them in Step 3.

---

## Step 3: Deploy Backend Web Service (5 minutes)

### 3.1 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Click **"Connect account"** if not already connected
4. Find and select: **`Srujansai07/Tvi3w`**
5. Click **"Connect"**

### 3.2 Configure Service
Fill in the following:

**Basic Settings:**
- **Name**: `tvi3w-backend`
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Runtime**: **Node**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select: **Free** (512 MB RAM, shared CPU)

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

```
GEMINI_API_KEY = your_gemini_api_key_here
```

```
DB_NAME = tvi3w_db
```

```
DB_USER = tvi3w_user
```

```
DB_PASSWORD = (paste from Step 2.2)
```

```
DB_HOST = (paste from Step 2.2)
```

```
DB_PORT = 5432
```

```
SESSION_SECRET = (generate random string, e.g., "tvi3w_secret_2024_xyz123")
```

```
NODE_ENV = production
```

```
ALLOWED_ORIGINS = https://tvi3w.vercel.app
```
*(We'll update this after deploying frontend)*

```
PORT = 3000
```

### 3.4 Deploy!
1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. ✅ Backend will be live at: `https://tvi3w-backend.onrender.com`

---

## Step 4: Get Google Gemini API Key (2 minutes)

### 4.1 Get API Key
1. Go to **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key

### 4.2 Update Environment Variable
1. Go back to Render dashboard
2. Click on **`tvi3w-backend`** service
3. Go to **"Environment"** tab
4. Find `GEMINI_API_KEY`
5. Paste your API key
6. Click **"Save Changes"**
7. Service will auto-redeploy

---

## Step 5: Deploy Frontend to Vercel (5 minutes)

### 5.1 Update API URLs
Before deploying, we need to update the frontend to use the production backend:

**Update `api-client.js`:**
```javascript
const API_BASE_URL = 'https://tvi3w-backend.onrender.com';
```

**Update `app.js` (line ~32):**
```javascript
this.socket = io('https://tvi3w-backend.onrender.com');
```

**Update `index.html` (line ~10):**
```html
<script src="https://tvi3w-backend.onrender.com/socket.io/socket.io.js"></script>
```

### 5.2 Commit Changes
```bash
git add .
git commit -m "Update API URLs for production"
git push
```

### 5.3 Deploy to Vercel
1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Click **"Import Project"**
4. Select **`Srujansai07/Tvi3w`**
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave blank)
   - **Output Directory**: `./`
6. Click **"Deploy"**

✅ Frontend will be live at: `https://tvi3w.vercel.app`

---

## Step 6: Update CORS (2 minutes)

Now that you have your frontend URL:

1. Go to Render dashboard → **`tvi3w-backend`**
2. Go to **"Environment"** tab
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://tvi3w.vercel.app
   ```
4. Click **"Save Changes"**

---

## Step 7: Test Your Deployment! 🎉

### 7.1 Test Backend
Visit: `https://tvi3w-backend.onrender.com/api/health`

Should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

### 7.2 Test Frontend
1. Visit: `https://tvi3w.vercel.app`
2. Check browser console for:
   - ✅ `🔌 WebSocket connected`
   - ✅ Notification: "🟢 Real-time connection active"

### 7.3 Test AI Features
1. Go to **Analysis** page
2. Click on a platform card (LinkedIn, Twitter, or Gmail)
3. Click **"Analyze"**
4. Should see real AI-generated insights!

---

## 🎊 Deployment Complete!

Your application is now live:
- **Frontend**: https://tvi3w.vercel.app
- **Backend**: https://tvi3w-backend.onrender.com
- **Database**: PostgreSQL on Render

---

## 🔧 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure database is running

### Frontend can't connect
- Check browser console for errors
- Verify ALLOWED_ORIGINS matches frontend URL
- Test backend health endpoint

### Database connection errors
- Verify DB credentials in environment variables
- Check database is in same region as backend
- Review connection logs

---

## 📊 Free Tier Limits

**Render:**
- 750 hours/month free (enough for one service 24/7)
- Spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS

**PostgreSQL:**
- 1 GB storage
- 97 connections
- Expires after 90 days (can migrate)

---

## 🚀 Next Steps

Once deployed, you can:
1. Set up custom domain (optional)
2. Add OAuth credentials for social login
3. Monitor with Render logs
4. Enable auto-deploy on GitHub push

---

**🎉 Congratulations! Your app is LIVE! 🎉**
