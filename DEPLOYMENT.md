# Tvi3W - Deployment Guide

## 🚀 Quick Deployment Options

Since Node.js is not installed locally, you have two excellent options:

---

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Backend Deployment

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Srujansai07/Tvi3w`
   - Configure:
     - **Name**: `tvi3w-backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Add Environment Variables**
   ```
   GEMINI_API_KEY=your_gemini_api_key
   DB_NAME=tvi3w_db
   DB_USER=postgres
   DB_PASSWORD=(Render will auto-generate)
   DB_HOST=(Render will auto-generate)
   DB_PORT=5432
   SESSION_SECRET=your_random_secret
   NODE_ENV=production
   ALLOWED_ORIGINS=your_frontend_url
   ```

4. **Add PostgreSQL Database**
   - In Render dashboard, click "New +" → "PostgreSQL"
   - **Name**: `tvi3w-db`
   - Copy connection details to environment variables

5. **Deploy!**
   - Click "Create Web Service"
   - Backend will be live at: `https://tvi3w-backend.onrender.com`

### Frontend Deployment

1. **Deploy to Vercel/Netlify**
   - Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
   - Connect GitHub repository
   - Set **Publish directory**: `.` (root)
   - Deploy!

2. **Update API URL**
   - In `api-client.js`, change:
     ```javascript
     const API_BASE_URL = 'https://tvi3w-backend.onrender.com';
     ```
   - In `app.js`, change Socket.IO URL:
     ```javascript
     this.socket = io('https://tvi3w-backend.onrender.com');
     ```

---

## Option 2: Deploy to Railway

### One-Click Deploy

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `Srujansai07/Tvi3w`
4. Railway auto-detects Node.js and PostgreSQL
5. Add environment variables (same as above)
6. Deploy!

---

## Option 3: Local Setup (When Node.js is Available)

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org))
- PostgreSQL ([Download](https://www.postgresql.org/download/))

### Steps

```bash
# Install dependencies
npm install

# Create database
createdb tvi3w_db

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Start backend
npm run dev
```

---

## 🔑 Getting API Keys

### Google Gemini API (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy and add to `.env` as `GEMINI_API_KEY`

### OAuth Credentials (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-backend-url/auth/google/callback`

#### LinkedIn OAuth
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create app → Get Client ID and Secret
3. Add redirect URI: `https://your-backend-url/auth/linkedin/callback`

#### Twitter OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create app → Get API Key and Secret
3. Add callback URL: `https://your-backend-url/auth/twitter/callback`

---

## ✅ Testing Deployment

### Backend Health Check
Visit: `https://your-backend-url/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-29T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Database Connection
Check server logs for:
- `✅ PostgreSQL Database connected successfully`
- `✅ Database models synced`

### WebSocket Connection
Open frontend and check browser console for:
- `🔌 WebSocket connected`
- Notification: "🟢 Real-time connection active"

---

## 🎯 Recommended Architecture

```
Frontend (Vercel/Netlify)
    ↓ HTTPS
Backend (Render/Railway)
    ↓ TCP
PostgreSQL Database (Render/Railway)
    ↓ HTTPS
Google Gemini API
```

---

## 💡 Tips

1. **Free Tier Limits**:
   - Render: 750 hours/month free
   - Railway: $5 free credit/month
   - Vercel: Unlimited for personal projects

2. **Cold Starts**:
   - Free tier backends "sleep" after inactivity
   - First request may take 30-60 seconds to wake up

3. **Environment Variables**:
   - Never commit `.env` to GitHub
   - Use secrets management in production

4. **Database Backups**:
   - Render provides automatic daily backups
   - Export data regularly for safety

---

## 🚨 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify database connection string
- Check server logs for errors

### Frontend can't connect
- Verify API_BASE_URL in `api-client.js`
- Check CORS settings allow your frontend domain
- Ensure backend is running

### Database errors
- Verify PostgreSQL version compatibility (12+)
- Check connection credentials
- Ensure database exists

---

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/Srujansai07/Tvi3w/issues)
- **Documentation**: See [walkthrough.md](walkthrough.md)

---

**Ready to deploy!** 🚀
