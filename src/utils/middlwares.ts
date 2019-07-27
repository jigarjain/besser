import { Request, Response, NextFunction } from 'express';

type RouteHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * This is a standard asyncMiddlware for wrapping the async route handlers.
 * Simply put, if you wish to use `async/await` syntax on your express route handlers,
 * wrap them with this function
 */
export const asyncHandler = (fn: RouteHandlerFn) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

type ValidatorFn = (body: any) => any;

/**
 * This is a middleware for validations. A validation function(`validatorFn`) can be passed
 * to this middlware which will receive the `req.body` as an argument. The `validatorFn` must
 * return the sanitized result on validation success or should throw error(s) on failure.
 * This middleware will set the sanitized result on `req.data.body` on success & pass the control to next middleware or it will
 * respond with validation errors & finish the request.
 */
export const validatorMiddleware = (validatorFn: ValidatorFn) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(req.body)
    .then(validatorFn)
    .then(sanitizedData => {
      req.data.body = sanitizedData;
      next();
    })
    .catch((err: Error | [Error]) => {
      // To respect the JSONAPI format, we always send the validation errors
      // as an array. This gives the validatorFn a flexibility to either return
      // array of Error object or a single Error object
      const errors = Array.isArray(err) ? err : [err];
      res.status(422).json({ errors: errors.map(e => e.message) });
    });
};
