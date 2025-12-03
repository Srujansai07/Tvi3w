# 🚀 Railway PostgreSQL Migration Guide

## Why We're Migrating
- ✅ Fix IPv4/IPv6 connectivity issues
- ✅ Faster database connections (same network)
- ✅ Simpler architecture
- ✅ Better Railway integration

---

## Step 1: Create Railway PostgreSQL Database

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Select your project**: `tvi3w-production`
3. **Click "New"** button (top right)
4. **Select "Database"** → **"PostgreSQL"**
5. **Wait 30 seconds** for database to provision

---

## Step 2: Get Database Connection String

1. **Click on the new PostgreSQL service**
2. **Go to "Variables" tab**
3. **Find and copy** the `DATABASE_URL` value
   - It will look like: `postgresql://postgres:PASSWORD@REGION.railway.app:PORT/railway`

---

## Step 3: Update Backend Environment Variable

1. **Click on your backend service** (tvi3w-backend)
2. **Go to "Variables" tab**
3. **Find `DATABASE_URL`** variable
4. **Click "Edit"** and **paste the new Railway PostgreSQL URL**
5. **Click "Save"**

---

## Step 4: Verify Deployment

1. **Wait 1-2 minutes** for Railway to redeploy
2. **Check "Deployments" tab** for new deployment
3. **Click "View Logs"** and look for:
   ```
   ✅ Database connected successfully
   🚀 Server running on port 3000
   ```

---

## Step 5: Test Your App

1. **Open your frontend**: https://tvi3w.vercel.app
2. **Try to sign up/login**
3. **Check if data is being saved**

---

## ✅ Success Checklist

- [ ] Railway PostgreSQL database created
- [ ] `DATABASE_URL` updated in backend service
- [ ] Deployment successful (no errors in logs)
- [ ] Frontend can connect to backend
- [ ] User registration/login works
- [ ] Data persists after page refresh

---

## 🔧 Troubleshooting

### If deployment fails:
1. Check logs for error messages
2. Verify `DATABASE_URL` format is correct
3. Ensure all other environment variables are still set

### If database connection fails:
1. Check `DATABASE_URL` starts with `postgresql://` (not `postgres://`)
2. Verify no extra spaces in the connection string
3. Check Railway PostgreSQL service is running

---

## 📝 Notes

- **Old Supabase data**: Will remain in Supabase (you can delete it later)
- **Migration time**: ~10 minutes total
- **Downtime**: ~2 minutes during redeployment
- **Rollback**: Just change `DATABASE_URL` back to Supabase if needed

---

## 🎯 Next Steps After Migration

1. Delete Supabase project (optional, to avoid confusion)
2. Set up Railway PostgreSQL backups (automatic by default)
3. Monitor database usage in Railway dashboard
4. Celebrate! 🎉
