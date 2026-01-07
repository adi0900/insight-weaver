import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBody } from '../middleware/validate.js';

export const authRouter = Router();

// ============================================
// IN-MEMORY USER STORAGE (replace with DB)
// ============================================

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    passwordHash: string;
}

const users: Map<string, User> = new Map();

// Seed demo user
users.set('demo@insightweaver.io', {
    id: 'user_demo',
    email: 'demo@insightweaver.io',
    name: 'Demo User',
    passwordHash: 'demo123', // In production, use bcrypt
});

const JWT_SECRET = process.env.JWT_SECRET || 'insight-weaver-secret-key';
const JWT_EXPIRES_IN = '24h';

// ============================================
// SCHEMAS
// ============================================

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT
 */
authRouter.post(
    '/login',
    validateBody(loginSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = users.get(email);

        if (!user || user.passwordHash !== password) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const { passwordHash, ...userData } = user;

        res.json({
            success: true,
            data: userData,
            token,
        });
    })
);

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
authRouter.post(
    '/register',
    validateBody(registerSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, name, password } = req.body;

        if (users.has(email)) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered',
            });
        }

        const user: User = {
            id: `user_${uuidv4().slice(0, 8)}`,
            email,
            name,
            passwordHash: password, // In production, use bcrypt
        };

        users.set(email, user);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const { passwordHash, ...userData } = user;

        res.status(201).json({
            success: true,
            data: userData,
            token,
        });
    })
);

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 */
authRouter.get(
    '/me',
    asyncHandler(async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided',
            });
        }

        const token = authHeader.slice(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
            const user = users.get(decoded.email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
            }

            const { passwordHash, ...userData } = user;

            res.json({
                success: true,
                data: userData,
            });
        } catch {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
            });
        }
    })
);

/**
 * POST /api/v1/auth/logout
 * Logout (client-side token removal)
 */
authRouter.post(
    '/logout',
    asyncHandler(async (req: Request, res: Response) => {
        // In production, you might want to blacklist the token
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    })
);

/**
 * GET /api/v1/auth/oauth/tableau/initiate
 * Initiate Tableau OAuth flow
 */
authRouter.get(
    '/oauth/tableau/initiate',
    asyncHandler(async (req: Request, res: Response) => {
        const tableauCloudUrl = process.env.TABLEAU_CLOUD_URL;
        const clientId = process.env.TABLEAU_CLIENT_ID;
        const redirectUri = `${process.env.FRONTEND_URL}/auth/callback/tableau`;

        if (!tableauCloudUrl || !clientId) {
            return res.status(500).json({
                success: false,
                error: 'Tableau OAuth not configured',
            });
        }

        // TODO: Implement actual Tableau OAuth
        // For now, return mock redirect URL
        res.json({
            redirectUrl: `${tableauCloudUrl}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        });
    })
);

/**
 * GET /api/v1/auth/oauth/salesforce/initiate
 * Initiate Salesforce OAuth flow
 */
authRouter.get(
    '/oauth/salesforce/initiate',
    asyncHandler(async (req: Request, res: Response) => {
        const loginUrl = process.env.SF_LOGIN_URL || 'https://login.salesforce.com';
        const clientId = process.env.SF_CLIENT_ID;
        const redirectUri = `${process.env.FRONTEND_URL}/auth/callback/salesforce`;

        if (!clientId) {
            return res.status(500).json({
                success: false,
                error: 'Salesforce OAuth not configured',
            });
        }

        // TODO: Implement actual Salesforce OAuth
        res.json({
            redirectUrl: `${loginUrl}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20cdp_api%20refresh_token`,
        });
    })
);
