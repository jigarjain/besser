import { Router } from 'express';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import experimentValidator from '../validators/experiment';
import variationValidator from '../validators/variation';
import Container, { ServiceTypes } from '../container';
import { ExperimentServiceInterface } from '../services/ExperimentService';
import { VariationServiceInterface } from '../services/VariationService';
import { Experiment, Variation } from '../types/common';

const router = Router();
const ExperimentService = Container.get<ExperimentServiceInterface>(
  ServiceTypes.ExperimentService
);
const VariationService = Container.get<VariationServiceInterface>(
  ServiceTypes.VariationService
);

router.get(
  '/experiments',
  asyncHandler(async (req, res) => {
    const experiments = await ExperimentService.getAllExperiments();
    res.json({ data: experiments });
  })
);

router.post(
  '/experiments',
  validatorMiddleware(experimentValidator),
  asyncHandler(async (req, res) => {
    const body: Partial<Experiment> = req.data.body;
    const id = await ExperimentService.createExperiment(body);
    res.status(201).json({ data: { id } });
  })
);

router.get(
  '/experiments/:experiment_id',
  asyncHandler(async (req, res) => {
    const experiment = await ExperimentService.getExperiment(
      Number(req.params.experiment_id)
    );
    if (!experiment) {
      res.sendStatus(404);
    } else {
      res.json({
        data: experiment
      });
    }
  })
);

router.put(
  '/experiments/:experiment_id',
  validatorMiddleware(experimentValidator),
  asyncHandler(async (req, res) => {
    await ExperimentService.updateExperiment(
      Number(req.params.experiment_id),
      req.data.body
    );
    res.sendStatus(200);
  })
);

router.get(
  '/experiments/:experiment_id/variations',
  asyncHandler(async (req, res, next) => {
    try {
      const variations = await VariationService.getVariationsForExperiment(
        Number(req.params.experiment_id)
      );

      res.json({ data: variations });
    } catch (err) {
      next(err);
    }
  })
);

router.post(
  '/experiments/:experiment_id/variations',
  validatorMiddleware(variationValidator),
  asyncHandler(async (req, res, next) => {
    try {
      const variations: Partial<Variation>[] = req.data.body;
      const variationIds = await VariationService.createVariations(
        Number(req.params.experiment_id),
        variations
      );

      res.json({ data: variationIds });
    } catch (err) {
      next(err);
    }
  })
);

export default router;
