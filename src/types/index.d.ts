declare module 'express-pino-logger';

declare namespace Express {
  export interface Request {
    id: string,
    log: any,
    data: {
      body?: any
    };
  }
}
