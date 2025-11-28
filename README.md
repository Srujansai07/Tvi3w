# Tvi3W - AI-Powered Personal Assistant

![Tvi3W Logo](https://img.shields.io/badge/Tvi3W-AI%20Assistant-6366f1?style=for-the-badge&logo=brain&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-14b8a6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)

**Tvi3W** is a revolutionary AI-powered personal assistant that analyzes live interactions, presentations, meetings, and content across platforms with real-time insights.

## 🚀 Features

### 📊 Real-Time Analysis
- AI-powered content analysis for LinkedIn, Twitter, and Gmail
- Sentiment detection with confidence scoring
- Actionable insights and recommendations
- Trend analysis and network effects
- **Database persistence** for analysis history

### 🎙️ Meeting Companion
- Live transcription and note-taking
- Dynamic question generation (Professional, Social, Humorous)
- Passive research and background information retrieval
- Real-time meeting statistics
- **Automatic meeting summarization and storage**

### 💼 Business Tools
- **Contract Manager**: Track agreements and signings
- **Venue & Scheduling**: Manage meeting locations
- **Contact Hub**: Professional network management
- **Shark Tank Analysis**: AI-powered pitch analysis with recommendations

### 🔒 Authentication
- OAuth 2.0 integration (Google, LinkedIn, Twitter)
- Secure session management
- User profile storage

### ⚡ Real-Time Features
- WebSocket connections for live updates
- Meeting room collaboration
- Instant notifications

### 🎨 Premium Design
- Dark mode with glassmorphism effects
- Vibrant purple-cyan gradient color scheme
- Smooth animations and transitions
- Fully responsive design

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Socket.IO Client** for real-time communication
- Google Fonts (Inter)
- Responsive Grid Layouts

### Backend
- **Node.js + Express** - RESTful API server
- **PostgreSQL + Sequelize** - Relational database with ORM
- **Google Gemini API** - AI-powered analysis
- **Passport.js** - OAuth 2.0 authentication
- **Socket.IO** - Real-time bidirectional communication
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Google Gemini API key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Srujansai07/Tvi3w.git
cd Tvi3w

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Create PostgreSQL database
createdb tvi3w_db

# Start backend server
npm run dev
# Server runs on http://localhost:3000
```

### Frontend Setup

```bash
# In a separate terminal
python -m http.server 8000
# Frontend runs on http://localhost:8000
```

### Environment Variables

Create a `.env` file with the following:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Database (PostgreSQL)
DB_NAME=tvi3w_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Session Secret
SESSION_SECRET=your_random_secret_key

# OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# Allowed Origins
ALLOWED_ORIGINS=http://localhost:8000
```

## 🎯 Usage

### Navigation
- **Dashboard**: Overview and platform integration
- **Analysis**: Real-time content analysis with AI
- **Meetings**: AI meeting companion with transcription
- **Business**: Professional productivity tools

### API Endpoints

#### Analysis
- `POST /api/analysis/content` - Analyze content
- `POST /api/analysis/sentiment` - Get sentiment
- `POST /api/analysis/insights` - Generate insights

#### Meetings
- `POST /api/meeting/questions` - Generate questions
- `POST /api/meeting/keypoints` - Extract key points
- `POST /api/meeting/research` - Passive research
- `POST /api/meeting/summarize` - Summarize meeting

#### Business
- `POST /api/business/pitch` - Analyze pitch
- `POST /api/business/contract-summary` - Summarize contract
- `POST /api/business/contact-insights` - Get contact insights
- `POST /api/business/venue-suggestions` - Venue suggestions

#### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/linkedin` - LinkedIn OAuth login
- `GET /auth/twitter` - Twitter OAuth login
- `GET /auth/logout` - Logout

## 📁 Project Structure

```
Tvi3w/
├── config/
│   ├── database.js       # PostgreSQL connection
│   └── passport.js       # OAuth strategies
├── models/
│   ├── User.js           # User model
│   ├── Analysis.js       # Analysis model
│   ├── Meeting.js        # Meeting model
│   ├── BusinessRecord.js # Business record model
│   └── index.js          # Model exports
├── routes/
│   ├── analysis.js       # Analysis endpoints
│   ├── meeting.js        # Meeting endpoints
│   ├── business.js       # Business endpoints
│   └── auth.js           # Auth endpoints
├── services/
│   ├── gemini.js         # AI service
│   └── socket.js         # WebSocket service
├── server.js             # Express server
├── api-client.js         # Frontend API client
├── app.js                # Frontend app logic
├── index.html            # Main HTML
├── styles.css            # Design system
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## ✅ Roadmap

- [x] Core UI/UX implementation
- [x] Google Gemini API integration
- [x] Backend server with Express
- [x] PostgreSQL database with Sequelize
- [x] OAuth for LinkedIn, Twitter, Google
- [x] User authentication system
- [x] Real-time WebSocket features
- [ ] Real-time speech-to-text
- [ ] Deployment to production
- [ ] Mobile app versions

## 🚀 Deployment

### Recommended Platforms
- **Backend**: Render, Heroku, Railway
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: Supabase, AWS RDS, Heroku Postgres

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Srujansai07**
- GitHub: [@Srujansai07](https://github.com/Srujansai07)

## 🌟 Acknowledgments

- Google Gemini for AI capabilities
- PostgreSQL for reliable data storage
- Socket.IO for real-time features
- Inter font family by Rasmus Andersson
- Inspiration from modern AI assistants

---

**Made with ❤️ and AI**
