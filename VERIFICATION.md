# Deployment Verification Steps

## 1. Check Railway Logs
Go to your Railway dashboard and look at the logs for the latest deployment.
- Wait for "Build Complete"
- Wait for "Starting Container"
- Look for: `✅ PostgreSQL Database connected successfully`
- Look for: `🚀 Tvi3W API Server running on port 3000`

## 2. Verify Backend Health
Click this link or open in browser:
https://tvi3w-production.up.railway.app/api/health

Expected response:
```json
{
    "status": "healthy",
    "timestamp": "...",
    "uptime": ...,
    "environment": "production"
}
```

## 3. Verify Frontend Connection
1. Open your local frontend: http://localhost:8000
2. Open Developer Tools (F12) -> Console
3. Look for: `✅ Socket.IO connected`
4. Try using the AI Analysis feature.

## Troubleshooting
If you still see `ERR_MODULE_NOT_FOUND`:
- The previous build might still be running. Cancel it and let the new one (triggered by "Trigger Railway redeploy") run.
- Ensure `config/passport.js` exists in your GitHub repository (we verified it does).

If you see `Database connection failed`:
- Check your Railway Variables. `DATABASE_URL` must be set.
