# Deployment & Monitoring - Tvi3W

## Current Deployment

**Live URL**: https://tvi3w-ai.vercel.app

### Platform: Vercel

**Advantages:**
- Automatic deployments from GitHub
- Edge network (CDN)
- Serverless functions
- Zero-config SSL
- Preview deployments for PRs
- Built-in analytics

## Deployment Process

### 1. Automatic Deployment (Recommended)

Every push to `main` branch automatically deploys to production.

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will:
1. Build the application
2. Run type checks
3. Deploy to edge network
4. Update DNS
5. Send deployment notification

### 2. Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### 3. Environment Variables

Set in Vercel Dashboard:
- Project Settings → Environment Variables

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_ID
GITHUB_SECRET
```

**Important:** Set for all environments (Production, Preview, Development)

## Build Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Build Settings
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `next dev`

## Monitoring

### 1. Vercel Analytics

**Metrics tracked:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices
- Browsers

**Access**: Vercel Dashboard → Analytics

### 2. Vercel Logs

**Real-time logs:**
```bash
vercel logs [deployment-url]
```

**Filter logs:**
```bash
vercel logs --since 1h
vercel logs --filter "error"
```

**Access**: Vercel Dashboard → Deployments → Logs

### 3. Error Tracking

**Recommended tools:**
- Sentry
- LogRocket
- Bugsnag

**Setup Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 4. Performance Monitoring

**Tools:**
- Vercel Analytics
- Google Analytics
- Lighthouse CI
- Web Vitals

**Key Metrics:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTFB (Time to First Byte) < 600ms

### 5. Uptime Monitoring

**Recommended:**
- UptimeRobot
- Pingdom
- StatusCake

**Setup:**
1. Monitor: https://tvi3w-ai.vercel.app
2. Check interval: 5 minutes
3. Alert: Email/SMS on downtime

## Rollback Strategy

### Quick Rollback

1. Go to Vercel Dashboard
2. Deployments → Select previous deployment
3. Click "Promote to Production"

### Git Rollback

```bash
# Find commit to rollback to
git log

# Revert to specific commit
git revert <commit-hash>
git push origin main
```

## Database Migrations

### Running Migrations

1. Go to Supabase SQL Editor
2. Run migration SQL
3. Verify in Table Editor

### Backup Before Migration

```bash
# Backup database
pg_dump -h db.ptkoregmemknufnpnnfc.supabase.co \\
  -U postgres \\
  -d postgres > backup.sql
```

## Scaling Considerations

### Current Limits (Vercel Free Tier)
- 100 GB bandwidth/month
- 100 GB-hours serverless execution
- 6,000 build minutes/month

### When to Upgrade
- Traffic > 100k visitors/month
- Need custom domains
- Require team collaboration
- Need advanced analytics

### Horizontal Scaling
- Vercel handles automatically
- Edge network distribution
- Serverless functions scale on demand

## Disaster Recovery

### Backup Strategy

**Database:**
- Supabase automatic backups (daily)
- Manual backups before major changes

**Code:**
- GitHub repository (primary)
- Local clones (secondary)

**Environment Variables:**
- Documented in `.env.local.example`
- Stored securely in password manager

### Recovery Steps

1. **Database Failure:**
   - Restore from Supabase backup
   - Run migrations if needed

2. **Deployment Failure:**
   - Rollback to previous deployment
   - Check logs for errors
   - Fix and redeploy

3. **Complete Outage:**
   - Check Vercel status page
   - Verify DNS settings
   - Contact Vercel support

## Health Checks

### Automated Checks

**Endpoint:** `/api/health`

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}
```

**Monitor:**
```bash
curl https://tvi3w-ai.vercel.app/api/health
```

### Manual Checks (Daily)

- [ ] Homepage loads
- [ ] Sign-in works
- [ ] Dashboard displays
- [ ] AI features respond
- [ ] Database queries work

## Performance Optimization

### Implemented:
- ✅ Image optimization (Next.js)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Edge caching
- ✅ Compression (Vercel)

### Future Optimizations:
- [ ] Service Worker for offline support
- [ ] Redis caching for API responses
- [ ] Database query optimization
- [ ] CDN for static assets

## Deployment Checklist

Before each production deployment:

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Performance benchmarks met
- [ ] Security scan clean
- [ ] Changelog updated
- [ ] Team notified

## Post-Deployment

After deployment:

- [ ] Verify homepage loads
- [ ] Test critical user flows
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Announce to users (if major update)

## Support & Maintenance

### Regular Tasks:
- **Daily**: Check logs for errors
- **Weekly**: Review analytics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Emergency Contacts:
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.com
- Team Lead: [contact]

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Inspect deployment
vercel inspect [deployment-url]

# Remove deployment
vercel rm [deployment-url]
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-into-prod)
- [Web Vitals](https://web.dev/vitals/)
