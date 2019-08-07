import { Router } from 'express';
import { asyncHandler } from '../utils/middlewares';

const router = Router();

router.get(
  '/visitors/:visitor_id/experiments',
  asyncHandler(async (req, res) => {
    const visitor_id = String(req.params.visitor_id);
    res.json({
      data: `Fetched experiments for visitor with id: ${visitor_id}`
    });
  })
);

router.get(
  '/visitors/:visitor_id/activate',
  asyncHandler(async (req, res) => {
    const { experiment_ids } = req.query;
    res.json({ data: `Activatings experiments: ${experiment_ids.toString()}` });
  })
);

router.get(
  '/visitors/:visitor_id/track/:goal_id',
  asyncHandler(async (req, res) => {
    const { visitor_id, goal_id } = req.params;

    res.json({
      data: `Tracking goal with id: ${Number(
        goal_id
      )} for visitor ${visitor_id}`
    });
  })
);

export default router;
