import { Router } from 'express';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import goalValidator from '../validators/goal';

const router = Router();

router.get(
  '/goals',
  asyncHandler(async (req, res, next) => {
    res.json({ data: 'Fetched all goals' });
  })
);

router.post(
  '/goals',
  validatorMiddleware(goalValidator),
  asyncHandler(async (req, res, next) => {
    res.json({ data: req.data.body });
  })
);

router.get(
  '/goals/:goalId',
  asyncHandler(async (req, res, next) => {
    res.json({ data: `Fetched a goal with id ${req.params.goalId}` });
  })
);

router.put(
  '/goals/:goalId',
  validatorMiddleware(goalValidator),
  asyncHandler(async (req, res, next) => {
    res.json({ data: `Updated a goal with id ${req.params.goalId}` });
  })
);

export default router;
