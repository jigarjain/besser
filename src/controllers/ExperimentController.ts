import { Router } from 'express';
import { ExperimentServiceInterface } from '../services/ExperimentService';
import { asyncHandler, validatorMiddleware } from '../utils/middlewares';
import experimentValidator from '../validators/experiment';
import Container, { ServiceTypes } from '../container';
import { Experiment } from '../types/common';

const router = Router();
const ExperimentService = Container.get<ExperimentServiceInterface>(
  ServiceTypes.ExperimentService
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

export default router;
