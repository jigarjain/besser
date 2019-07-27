import { ErrorRequestHandler } from 'express';

export default ((err: Error, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  res.status(500);
  res.json({ errors: [err.message] });
}) as ErrorRequestHandler;
