import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, details?: unknown): ApiError {
        return new ApiError(message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(message = 'Unauthorized'): ApiError {
        return new ApiError(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message = 'Forbidden'): ApiError {
        return new ApiError(message, 403, 'FORBIDDEN');
    }

    static notFound(resource = 'Resource'): ApiError {
        return new ApiError(`${resource} not found`, 404, 'NOT_FOUND');
    }

    static conflict(message: string): ApiError {
        return new ApiError(message, 409, 'CONFLICT');
    }

    static internal(message = 'Internal server error'): ApiError {
        return new ApiError(message, 500, 'INTERNAL_ERROR');
    }

    static serviceUnavailable(message = 'Service unavailable'): ApiError {
        return new ApiError(message, 503, 'SERVICE_UNAVAILABLE');
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error for debugging
    console.error('[Error]', {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: 'Validation Error',
            code: 'VALIDATION_ERROR',
            details: error.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Handle custom API errors
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
            code: error.code,
            details: error.details,
        });
        return;
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token',
            code: 'INVALID_TOKEN',
        });
        return;
    }

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token expired',
            code: 'TOKEN_EXPIRED',
        });
        return;
    }

    // Handle syntax errors (malformed JSON)
    if (error instanceof SyntaxError && 'body' in error) {
        res.status(400).json({
            success: false,
            error: 'Invalid JSON',
            code: 'INVALID_JSON',
        });
        return;
    }

    // Default error response
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message,
        code: 'INTERNAL_ERROR',
    });
};
