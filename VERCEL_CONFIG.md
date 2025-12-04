# Vercel Deployment Configuration

## ✅ Your Vercel Project
- **URL**: https://tvi3w.vercel.app
- **Project ID**: prj_BH0CG3FkTGXBcsTFoGTj0WUV9Q5X

---

## 🔧 Framework Settings (in Vercel Dashboard)

### Framework Preset
**Select**: Next.js (auto-detected)

### Build & Development Settings
| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` |

### Root Directory
- **Value**: Leave EMPTY (Default)
- **Include files outside root**: ❌ NO (unchecked)

---

## 🔐 Environment Variables (6 Required)

Add these in **Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://ptkoregmemknufnpnnfc.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDAzODQsImV4cCI6MjA3OTkxNjM4NH0.QGlW7MYaUJmGt9GyqjnQSHy41vByWxqONkVtLcAVigQ

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM0MDM4NCwiZXhwIjoyMDc5OTE2Mzg0fQ.KzAHJ-_t3La-vmvSR6dNsVEaElquTHNMxboSD4bttzc

DATABASE_URL=postgresql://postgres:231100813aiiTgn@db.ptkoregmemknufnpnnfc.supabase.co:5432/postgres

GEMINI_API_KEY=AIzaSyDzH-UHaBU3glILoOr9moaR8aGeg88tWv8

NEXT_PUBLIC_APP_URL=https://tvi3w.vercel.app
```

**Important**: Apply these to **Production**, **Preview**, and **Development** environments.

### Why We Need All 6:
- **SERVICE_ROLE_KEY**: For admin operations (bypasses RLS)
- **DATABASE_URL**: For Prisma/direct database access

---

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
cd c:\Users\Student\Downloads\Tvi3w\Tvi3w-Next
git init
git add .
git commit -m "Initial deployment - Gold Standard Stack"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Vercel will detect it's Next.js automatically

### 3. Configure Settings
- Framework: **Next.js** (auto-detected)
- Root Directory: **Leave empty**
- Build Command: **npm run build** (auto-filled)
- Output Directory: **.next** (auto-filled)

### 4. Add Environment Variables
Copy all 4 variables from above into Vercel's environment variables section.

### 5. Deploy
Click **"Deploy"** and wait 2-3 minutes.

---

## ✅ Post-Deployment

### Verify Your Deployment
1. Visit https://tvi3w.vercel.app
2. Test all pages:
   - Landing page
   - Dashboard
   - Analysis
   - Meetings
   - Business

### Automatic Deployments
Every `git push` to `main` will trigger a new deployment automatically.

### View Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on any deployment to see build logs

---

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- View build logs in Vercel dashboard

**API errors?**
- Verify Gemini API key is correct
- Check Supabase credentials

**404 errors?**
- Ensure all files are pushed to GitHub
- Check build logs for errors

---

## 📊 Monitoring

### Analytics
- Vercel provides built-in analytics
- View in Dashboard → Analytics

### Performance
- Check Core Web Vitals
- Monitor API response times

---

**Your app is ready to deploy!** 🚀
