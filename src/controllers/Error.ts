import Express, { ErrorRequestHandler } from 'express';

const router = Express.Router();

router.use(((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.json({ errors: [err] });
}) as ErrorRequestHandler);

export default router;
