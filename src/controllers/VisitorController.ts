import { Router } from 'express';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import visitorValidation from '../validators/visitor';
import { VisitorServiceInterface } from '../services/VisitorService';
import Container, { ServiceTypes } from '../container';

const router = Router();
const VisitorService = Container.get<VisitorServiceInterface>(
  ServiceTypes.VisitorService
);

router.post(
  '/visitors/:visitor_id/assignments',
  asyncHandler(async (req, res) => {
    const visitor_id = String(req.params.visitor_id);
    const assignments = await VisitorService.getAssignments(visitor_id);
    res.status(201).json({
      data: {
        assignments
      }
    });
  })
);

router.post(
  '/visitors/:visitor_id/activate',
  validatorMiddleware(visitorValidation),
  asyncHandler(async (req, res) => {
    const visitor_id = String(req.params.visitor_id);
    const { experiment_ids } = req.data.query;
    const assignments = await VisitorService.activate(
      visitor_id,
      experiment_ids
    );
    res.status(201).json({
      data: {
        assignments
      }
    });
  })
);

router.post(
  '/visitors/:visitor_id/track/:goal_id',
  asyncHandler(async (req, res) => {
    const visitor_id = String(req.params.visitor_id);
    const goal_id = Number(req.params.goal_id);
    const platform_info = {
      device: '',
      browser: ''
    };
    await VisitorService.track(visitor_id, goal_id, platform_info);
    res.status(201).json({ data: {} });
  })
);

export default router;
