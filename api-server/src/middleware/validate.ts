import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware factory to validate request body against a Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
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
            next(error);
        }
    };
}

/**
 * Middleware factory to validate request query against a Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.query = schema.parse(req.query) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Query Validation Error',
                    code: 'QUERY_VALIDATION_ERROR',
                    details: error.errors.map((e) => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
}

/**
 * Middleware factory to validate request params against a Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            req.params = schema.parse(req.params) as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Params Validation Error',
                    code: 'PARAMS_VALIDATION_ERROR',
                    details: error.errors.map((e) => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
}
