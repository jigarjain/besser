import { Router } from 'express';
import asyncMiddleware from '../utils/asyncMiddleware';

const router = Router();

router.get(
  '/experiments',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: 'All experiments fetched' });
  })
);

router.post(
  '/experiments',
  asyncMiddleware(async (req, res, next) => {
    res.json({ data: 'Created new experiment' });
  })
);

router.get(
  '/experiments/:experiment_id',
  asyncMiddleware(async (req, res, next) => {
    res.json({
      data: `Fetched experiment with id ${req.params.experiment_id}`
    });
  })
);

router.put(
  '/experiments/:experiment_id',
  asyncMiddleware(async (req, res, next) => {
    res.json({
      data: `Updated experiment with id ${req.params.experiment_id}`
    });
  })
);

export default router;
