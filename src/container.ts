import 'reflect-metadata';
import { Container } from 'inversify';
import ExperimentModel, {
  ExperimentModelInterface
} from './models/ExperimentModel';
import VariationModel, {
  VariationModelInterface
} from './models/VariationModel';
import GoalModel, { GoalModelInterface } from './models/GoalModel';
import VisitorModel, { VisitorModelInterface } from './models/VisitorModel';
import ExperimentService, {
  ExperimentServiceInterface
} from './services/ExperimentService';
import VariationService, {
  VariationServiceInterface
} from './services/VariationService';
import GoalService, { GoalServiceInterface } from './services/GoalService';
import VisitorService, {
  VisitorServiceInterface
} from './services/VisitorService';

export const ModelTypes = {
  ExperimentModel: Symbol.for('ExperimentModel'),
  VariationModel: Symbol.for('VariationModel'),
  GoalModel: Symbol.for('GoalModel'),
  VisitorModel: Symbol.for('VisitorModel')
};

export const ServiceTypes = {
  ExperimentService: Symbol.for('ExperimentService'),
  VariationService: Symbol.for('VariationService'),
  GoalService: Symbol.for('GoalService'),
  VisitorService: Symbol.for('VisitorService')
};

const container = new Container();

// Bind models to container
container
  .bind<ExperimentModelInterface>(ModelTypes.ExperimentModel)
  .to(ExperimentModel);
container
  .bind<VariationModelInterface>(ModelTypes.VariationModel)
  .to(VariationModel);
container.bind<GoalModelInterface>(ModelTypes.GoalModel).to(GoalModel);
container.bind<VisitorModelInterface>(ModelTypes.VisitorModel).to(VisitorModel);

// Bind services to container
container
  .bind<ExperimentServiceInterface>(ServiceTypes.ExperimentService)
  .to(ExperimentService);
container
  .bind<VariationServiceInterface>(ServiceTypes.VariationService)
  .to(VariationService);
container.bind<GoalServiceInterface>(ServiceTypes.GoalService).to(GoalService);
container
  .bind<VisitorServiceInterface>(ServiceTypes.VisitorService)
  .to(VisitorService);

export default container;
