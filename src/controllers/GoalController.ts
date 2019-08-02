import { Router } from 'express';
import { GoalServiceInterface } from '../services/GoalService';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import goalValidator from '../validators/goal';
import { Goal } from '../types/common';
import Container, { ServiceTypes } from '../container';

const router = Router();
const GoalService = Container.get<GoalServiceInterface>(
  ServiceTypes.GoalService
);

router.get(
  '/goals',
  asyncHandler(async (req, res) => {
    const goals = await GoalService.getAllGoals();
    res.json({ data: goals });
  })
);

router.post(
  '/goals',
  validatorMiddleware(goalValidator),
  asyncHandler(async (req, res) => {
    const body: Partial<Goal> = req.data.body;
    const id = await GoalService.createGoal(body);
    res.status(201).json({ data: { id } });
  })
);

router.get(
  '/goals/:goal_id',
  asyncHandler(async (req, res) => {
    const goal = await GoalService.getGoal(Number(req.params.goal_id));
    if (!goal) {
      res.sendStatus(404);
    } else {
      res.json({
        data: goal
      });
    }
  })
);

router.put(
  '/goals/:goal_id',
  validatorMiddleware(goalValidator),
  asyncHandler(async (req, res) => {
    await GoalService.updateGoal(Number(req.params.goal_id), req.data.body);
    res.sendStatus(200);
  })
);

export default router;
