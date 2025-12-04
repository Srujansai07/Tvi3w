# Tvi3W Next - Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase project
- Gemini API key

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Configure environment variables (see below)
- Click "Deploy"

3. **Environment Variables**
Add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://tvi3w-ai.vercel.app
```

4. **Done!**
Your app will be live at `https://tvi3w-ai.vercel.app`

## Alternative: Railway

1. Go to https://railway.app
2. Create new project from GitHub
3. Add environment variables
4. Deploy

## Alternative: Netlify

1. Go to https://netlify.com
2. Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables

## Post-Deployment

### Custom Domain
1. Go to Vercel dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records

### Analytics
Vercel provides built-in analytics:
- Go to your project
- Click "Analytics" tab

### Monitoring
- Check deployment logs in Vercel
- Monitor API usage in Supabase
- Track Gemini API usage

## Troubleshooting

**Build fails**: Check environment variables
**API errors**: Verify Gemini API key
**Auth issues**: Check Supabase configuration
**404 errors**: Ensure all routes are deployed

## Performance Optimization

- Enable Vercel Edge Functions
- Use Vercel Image Optimization
- Enable caching headers
- Monitor Core Web Vitals
