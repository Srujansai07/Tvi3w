# Tvi3W - AI-Powered Meeting Assistant

Transform your meetings into actionable insights with AI-powered transcription, question generation, and business intelligence.

## 🚀 Features

- **Real-Time Meeting Companion**: Live transcription and AI-generated questions
- **Content Intelligence**: Analyze LinkedIn, Twitter, and article content
- **Business Intelligence**: Shark Tank-style pitch analysis
- **Contact Management**: Track relationships and interactions
- **Insights & Analytics**: AI-powered patterns and recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Google Gemini AI
- **Auth**: NextAuth.js (Google & GitHub OAuth)
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Srujansai07/Tvi3w.git
cd Tvi3w
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

4. Run database migrations:
- Go to your Supabase SQL Editor
- Run the SQL from `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Setup Guide](./SETUP.md)
- [Supabase Configuration](./SUPABASE_SETUP.md)
- [Environment Variables](./ENV_VARIABLES.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🎯 Key Features

### Meeting Management
- Create and manage meetings
- AI-powered transcription
- Real-time question suggestions
- Automatic summarization

### Content Analysis
- LinkedIn post analysis
- Twitter content insights
- Article summarization
- Actionable recommendations

### Business Intelligence
- Pitch analysis (Shark Tank style)
- Market viability assessment
- Implementation roadmaps
- Risk analysis

### Contact Management
- Relationship tracking
- Interaction history
- Follow-up reminders
- Network insights

## 🔒 Security

- OAuth authentication (Google & GitHub)
- Row Level Security (RLS) in Supabase
- Encrypted data at rest and in transit
- GDPR compliant

## 📈 Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- Supabase for backend infrastructure
- Vercel for hosting
- Next.js team for the amazing framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Supabase, and Gemini AI**
