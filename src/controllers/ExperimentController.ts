import { Router } from 'express';
import { asyncHandler, validatorMiddleware } from '../utils/middlwares';
import experimentValidator from '../validators/experiment';
const router = Router();

router.get(
  '/experiments',
  asyncHandler(async (req, res, next) => {
    res.json({ data: 'All experiments fetched' });
  })
);

router.post(
  '/experiments',
  validatorMiddleware(experimentValidator),
  asyncHandler(async (req, res, next) => {
    res.json({ data: req.data.body });
  })
);

router.get(
  '/experiments/:experimentId',
  asyncHandler(async (req, res, next) => {
    res.json({
      data: `Fetched experiment with id ${req.params.experimentId}`
    });
  })
);

router.put(
  '/experiments/:experimentId',
  validatorMiddleware(experimentValidator),
  asyncHandler(async (req, res, next) => {
    res.json({
      data: `Updated experiment with id ${req.params.experimentId}`
    });
  })
);

export default router;
