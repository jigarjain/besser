declare module 'express-pino-logger';

declare namespace Express {
  export interface Request {
    id: string;
    data: {
      body?: any;
    };
  }
}

type GoalType = 'IMPRESSION' | 'CUSTOM';
