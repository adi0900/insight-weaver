import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to catch errors and pass them to Express error handler
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
