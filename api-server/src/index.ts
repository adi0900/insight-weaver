import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { insightsRouter } from './routes/insights.js';
import { narrativesRouter } from './routes/narratives.js';
import { inspectorRouter } from './routes/inspector.js';
import { webhooksRouter } from './routes/webhooks.js';
import { authRouter } from './routes/auth.js';
import { dataSourcesRouter } from './routes/dataSources.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
    crossOriginEmbedderPolicy: false, // Allow embedding Tableau
    contentSecurityPolicy: false, // Customize in production
}));

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://insight-weaver-woad.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel previews
].filter(Boolean) as (string | RegExp)[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Rejected origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
    });
});

// ============================================
// API ROUTES
// ============================================

// Public routes
app.use('/api/v1/auth', authRouter);

// Protected routes
app.use('/api/v1/insights', authMiddleware, insightsRouter);
app.use('/api/v1/narratives', authMiddleware, narrativesRouter);
app.use('/api/v1/inspector', authMiddleware, inspectorRouter);
app.use('/api/v1/webhooks', authMiddleware, webhooksRouter);
app.use('/api/v1/data-sources', authMiddleware, dataSourcesRouter);

// API documentation redirect
app.get('/api/docs', (req, res) => {
    res.redirect('/api/v1/docs');
});

app.get('/api/v1/docs', (req, res) => {
    res.json({
        name: 'Insight Weaver API',
        version: '1.0.0',
        description: 'API for AI-driven analytics narratives',
        endpoints: {
            insights: '/api/v1/insights',
            narratives: '/api/v1/narratives',
            inspector: '/api/v1/inspector',
            webhooks: '/api/v1/webhooks',
            dataSources: '/api/v1/data-sources',
            auth: '/api/v1/auth',
        },
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
    });
});

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`
🚀 Insight Weaver API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Local:   http://localhost:${PORT}
  Health:  http://localhost:${PORT}/health
  Docs:    http://localhost:${PORT}/api/docs

  Environment: ${process.env.NODE_ENV || 'development'}
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export { app };
