# Tvi3W Next - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://tvi3w-v2-srujansais-projects.vercel.app
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: https://tvi3w-v2-srujansais-projects.vercel.app

## Getting API Keys

### Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy the URL and anon key

### Gemini AI
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Copy the key

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── api/              # API routes
├── dashboard/        # Dashboard page
├── analysis/         # Analysis page
├── meetings/         # Meetings page
├── business/         # Business page
├── layout.tsx        # Root layout
├── page.tsx          # Home page
├── error.tsx         # Error boundary
├── loading.tsx       # Loading state
└── not-found.tsx     # 404 page

components/
├── Navigation.tsx    # Main navigation
├── Button.tsx        # Button component
├── Card.tsx          # Card components
└── LoadingSpinner.tsx # Loading spinner

lib/
├── supabase/         # Supabase clients
├── gemini.ts         # AI service
├── store.ts          # Zustand stores
├── types.ts          # TypeScript types
└── utils.ts          # Utilities
```

## Features

✅ Next.js 14 with App Router
✅ TypeScript
✅ Tailwind CSS + Dark Mode
✅ Supabase Auth (ready)
✅ Gemini AI Integration
✅ Responsive Design
✅ Error Boundaries
✅ Loading States
✅ SEO Optimized

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables (Production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Troubleshooting

**Issue**: Dependencies not installing
**Solution**: Make sure Node.js 18+ is installed

**Issue**: Environment variables not working
**Solution**: Restart dev server after changing `.env.local`

**Issue**: TypeScript errors
**Solution**: Run `npm run build` to see all errors

## Next Steps

1. Set up Supabase database tables
2. Configure authentication
3. Add data persistence
4. Deploy to production
