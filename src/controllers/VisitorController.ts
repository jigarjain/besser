import { Router } from 'express';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import visitorValidation from '../validators/visitor';

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
  validatorMiddleware(visitorValidation),
  asyncHandler(async (req, res) => {
    const { experiment_ids } = req.data.query;
    res.json({ data: `Activatings experiments: ${experiment_ids.join(',')}` });
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
