import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

type RouteHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * This is a standard asyncMiddlware for wrapping the async route handlers.
 * Simply put, if you wish to use `async/await` syntax on your express route
 * handlers wrap them with this function
 */
export const asyncHandler = (fn: RouteHandlerFn) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

type ValidatorFn = (
  body?: any,
  query?: any
) => {
  body?: any;
  query?: any;
};

/**
 * This is a middleware for validations. A validation function(`validatorFn`)
 * can be passed to this middlware which will receive the `req.body` & `req.query`
 * as arguments. The `validatorFn` must return the sanitized `body` & `query`
 * on validation success or should throw error(s) on failure. This middleware
 * will set the sanitized `body` & `query` on `req.data` & pass the control to
 * next middleware or it will respond with validation errors & finish the request.
 */
export const validatorMiddleware = (validatorFn: ValidatorFn) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, query } = await validatorFn(req.body, req.query);
    req.data.body = body || {};
    req.data.query = query || {};
    next();
  } catch (err) {
    const error: Error | [Error] = err;
    // To respect the JSONAPI format, we always send the validation errors
    // as an array. This gives the validatorFn a flexibility to either return
    // array of Error object or a single Error object
    const errors = Array.isArray(error) ? error : [error];
    res.status(422).json({ errors: errors.map(e => e.message) });
  }
};

/**
 * This is a catch-all error handler which will be called when any uncaught
 * error occurs in one of the mounted routes
 */
export const errorHandler = ((
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.json({ errors: [err.message] });
}) as ErrorRequestHandler;

/**
 * This is a 404 error handler which is invoked when none of the routes match
 */
export const notFoundHandler = (req: Request, res: Response) =>
  res.sendStatus(404);
