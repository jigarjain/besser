import 'reflect-metadata';
import { Container } from 'inversify';
import ExperimentModel, {
  ExperimentModelInterface
} from './models/ExperimentModel';
import VariationModel, {
  VariationModelInterface
} from './models/VariationModel';
import GoalModel, { GoalModelInterface } from './models/GoalModel';
import ExperimentService, { ExperimentServiceInterface } from './services/ExperimentService';
import GoalService, { GoalServiceInterface } from './services/GoalService';

export const ModelTypes = {
  ExperimentModel: Symbol.for('ExperimentModel'),
  VariationModel: Symbol.for('VariationModel'),
  GoalModel: Symbol.for('GoalModel')
};

export const ServiceTypes = {
  ExperimentService: Symbol.for('ExperimentService'),
  GoalService: Symbol.for('GoalService'),
}

const container = new Container();

// Bind models to container
container
  .bind<ExperimentModelInterface>(ModelTypes.ExperimentModel)
  .to(ExperimentModel);
container
  .bind<VariationModelInterface>(ModelTypes.VariationModel)
  .to(VariationModel);
container.bind<GoalModelInterface>(ModelTypes.GoalModel).to(GoalModel);

// Bind services to container
container.bind<ExperimentServiceInterface>(ServiceTypes.ExperimentService).to(ExperimentService);
container.bind<GoalServiceInterface>(ServiceTypes.GoalService).to(GoalService);

export default container;
