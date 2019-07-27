import express, { Request, Response, NextFunction } from 'express';
import asyncMiddleware from './utils/asyncMiddleware';

// Create a new express application instance
const app = express();

// Express configurations
app.set('port', process.env.PORT || 3000);

// Setting up routes
app.get(
  '/',
  asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Promise.resolve('Hello World');
    res.send(data);
  })
);

export default app;
