import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { Experiment } from '../types/common';
import { ExperimentModelInterface } from '../models/ExperimentModel';
import { ModelTypes } from '../container';

export interface ExperimentServiceInterface {
  /**
   * Returns a Promise which resolves to a list of Experiments
   */
  getAllExperiments(): Promise<Experiment[]>;

  createExperiment(experiment: Partial<Experiment>): Promise<number>;

  getExperiment(experiment_id: number): Promise<Experiment>;

  updateExperiment(
    experiment_id: number,
    experiment: Partial<Experiment>
  ): Promise<void>;
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

  public async getExperiment(experiment_id: number) {
    return await this._ExperimentModel.getExperiment(experiment_id);
  }

  public async updateExperiment(experiment_id: number, experiment: Experiment) {
    // Delete the id to prevent from experiment.id getting tampered in DB
    delete experiment.id;

    await this._ExperimentModel.updateExperiment(experiment_id, experiment);
  }
}
