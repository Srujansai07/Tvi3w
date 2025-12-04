# Tvi3W Next - Modern Gold Standard Stack

> **🚀 Built with Next.js 14, TypeScript, Supabase, and Gemini AI**

## 🏆 The Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | PostgreSQL database + Authentication |
| **Tailwind CSS** | Utility-first styling |
| **Gemini AI** | AI-powered analysis and insights |
| **Zustand** | Client state management |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Google Gemini API key ([makersuite.google.com](https://makersuite.google.com/app/apikey))

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Features

### 📊 Content Analysis
- AI-powered content analysis
- Sentiment detection
- Key insights extraction
- Actionable recommendations

### 🎯 Meeting Companion
- Dynamic question generation
- Context-aware suggestions
- Real-time note taking
- Meeting summaries

### 💼 Business Pitch Analysis
- Shark Tank-style investor feedback
- Strengths and weaknesses analysis
- Market potential scoring
- Investment recommendations

## 📁 Project Structure

```
Tvi3w-Next/
├── app/
│   ├── api/              # API routes
│   │   ├── analysis/
│   │   ├── meetings/
│   │   └── business/
│   ├── dashboard/        # Dashboard page
│   ├── analysis/         # Analysis module
│   ├── meetings/         # Meetings module
│   ├── business/         # Business module
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── supabase/         # Supabase clients
│   │   ├── server.ts
│   │   └── client.ts
│   └── gemini.ts         # Gemini AI service
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## 🔐 Authentication

Currently using **Supabase Auth** for rapid development.

**Migration Path**: Switch to NextAuth.js before investor pitch for:
- More provider options
- Custom authentication flows
- Better enterprise support

## 🎨 Design System

- **Dark Mode**: Enabled by default
- **Glassmorphism**: Custom `.glass` utility class
- **Color Palette**: HSL-based with CSS variables
- **Typography**: Inter font family
- **Animations**: Tailwind transitions + hover effects

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🛠️ Tech Decisions

### Why This Stack?

1. **Next.js 14**: Industry standard, SEO-friendly, fast
2. **TypeScript**: Catches bugs before runtime
3. **Supabase**: Managed Postgres with built-in auth
4. **Tailwind**: Rapid UI development with consistency
5. **Gemini AI**: Powerful, cost-effective AI capabilities

### Migration from Original Stack

| Original | New | Benefit |
|----------|-----|---------|
| Express.js | Next.js API Routes | Unified codebase |
| Vanilla JS | TypeScript + React | Type safety |
| Vanilla CSS | Tailwind CSS | Faster development |
| Passport.js | Supabase Auth | Less boilerplate |
| Sequelize | Prisma (planned) | Better DX |

## 📚 Next Steps

1. ✅ Install Node.js and dependencies
2. ✅ Configure environment variables
3. ⏳ Set up Supabase project
4. ⏳ Create database tables
5. ⏳ Test all features
6. ⏳ Deploy to Vercel

## 🤝 Contributing

This is a migration of the original Tvi3W project to modern technologies.

## 📄 License

ISC

---

**Built with ❤️ using the Modern Gold Standard Stack**
