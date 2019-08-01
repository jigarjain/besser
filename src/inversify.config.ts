import 'reflect-metadata';
import { Container } from 'inversify';
import ExperimentModel, {
  ExperimentModelInterface
} from './models/ExperimentModel';
import VariationModel, {
  VariationModelInterface
} from './models/VariationModel';
import GoalModel, { GoalModelInterface } from './models/GoalModel';

export const ModelTypes = {
  ExperimentModel: Symbol.for('ExperimentModel'),
  VariationModel: Symbol.for('VariationModel'),
  GoalModel: Symbol.for('GoalModel')
};

const container = new Container();
container
  .bind<ExperimentModelInterface>(ModelTypes.ExperimentModel)
  .to(ExperimentModel);
container
  .bind<VariationModelInterface>(ModelTypes.VariationModel)
  .to(VariationModel);
container.bind<GoalModelInterface>(ModelTypes.GoalModel).to(GoalModel);

export default container;
