import { Request, Response, NextFunction } from 'express';

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default (fn: Middleware) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
