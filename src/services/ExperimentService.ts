import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { Experiment, ExperimentId } from '../types/common';
import { ExperimentModelInterface } from '../models/ExperimentModel';
import { ModelTypes } from '../container';

export interface ExperimentServiceInterface {
  /**
   * Returns a Promise which resolves to a list of Experiments
   */
  getAllExperiments(): Promise<Experiment[]>;

  createExperiment(experiment: Partial<Experiment>): Promise<ExperimentId>;

  getExperiment(experiment_id: ExperimentId): Promise<Experiment | undefined>;

  updateExperiment(
    experiment_id: ExperimentId,
    experiment: Partial<Experiment>
  ): Promise<void>;

  updateExperimentRunningFlag(
    experiment_id: ExperimentId,
    running_flag: boolean
  ): Promise<number>;
}

@injectable()
export default class ExperimentService implements ExperimentServiceInterface {
  private _ExperimentModel: ExperimentModelInterface;

  /**
   * We use `LazyServiceIdentifier` here due to cyclic dependency
   * https://github.com/inversify/InversifyJS/blob/master/wiki/circular_dependencies.md
   */
  public constructor(
    @inject(new LazyServiceIdentifer(() => ModelTypes.ExperimentModel))
    experimentModel: ExperimentModelInterface
  ) {
    this._ExperimentModel = experimentModel;
  }

  public async getAllExperiments() {
    return await this._ExperimentModel.getExperiments();
  }

  public async createExperiment(experiment: Partial<Experiment>) {
    return await this._ExperimentModel.createExperiment(experiment);
  }

  public async getExperiment(experiment_id: ExperimentId) {
    return await this._ExperimentModel.getExperiment(experiment_id);
  }

  public async updateExperiment(
    experiment_id: ExperimentId,
    experiment: Experiment
  ) {
    // Delete the id to prevent from experiment.id getting tampered in DB
    delete experiment.id;

    await this._ExperimentModel.updateExperiment(experiment_id, experiment);
  }

  public async updateExperimentRunningFlag(
    experiment_id: ExperimentId,
    running_flag: boolean
  ) {
    return await this._ExperimentModel.updateExperimentRunningFlag(
      experiment_id,
      running_flag
    );
  }
}
