import { Router } from 'express';
import asyncMiddleware from '../utils/asyncMiddleware';

const router = Router();

router.get(
  '/goals',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: 'Fetched all goals' });
  })
);

router.post(
  '/goals',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: 'Created a goal' });
  })
);

router.get(
  '/goals/:goal_id',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: `Fetched a goal with id ${req.params.goal_id}` });
  })
);

router.put(
  '/goals/:goal_id',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: `Updated a goal with id ${req.params.goal_id}` });
  })
);

export default router;
