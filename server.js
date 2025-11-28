import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from '../config/passport.js';
import { sequelize } from './models/index.js';
import { createServer } from 'http';
import { initSocket } from '../services/socket.js';

// Import Routes
import analysisRoutes from './routes/analysis.js';
import meetingRoutes from './routes/meeting.js';
import businessRoutes from './routes/business.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
initSocket(httpServer);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'],
    credentials: true
};
app.use(cors(corsOptions));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/business', businessRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Tvi3W API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            analysis: '/api/analysis',
            meeting: '/api/meeting',
            business: '/api/business'
        }
    });
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Database connected successfully');

        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synced');

        httpServer.listen(PORT, () => {
            console.log(`🚀 Tvi3W API Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();

export default app;
