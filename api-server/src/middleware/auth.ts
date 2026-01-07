import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'insight-weaver-secret-key';

interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    // Allow requests without auth in development for easier testing
    if (process.env.NODE_ENV === 'development' && !authHeader) {
        (req as any).user = {
            id: 'user_demo',
            email: 'demo@insightweaver.io',
        };
        return next();
    }

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'No token provided',
        });
        return;
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        (req as any).user = {
            id: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: 'Token expired',
                message: 'Please log in again',
            });
            return;
        }

        res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: 'Authentication failed',
        });
    }
}

/**
 * Optional auth middleware
 * Attaches user if token is present, but doesn't require it
 */
export function optionalAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

        (req as any).user = {
            id: decoded.userId,
            email: decoded.email,
        };
    } catch {
        // Ignore invalid tokens in optional auth
    }

    next();
}
