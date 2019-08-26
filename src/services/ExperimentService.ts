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

  deleteExperiment(experiment_id: ExperimentId): Promise<void>;
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

  private async runExperimentCheck(experiment_id: number) {
    const experiment = await this.getExperiment(experiment_id);

    /**
     * If experiment doesn't exist or is deleted, throw error
     */

    //test
    if (!experiment || experiment.is_deleted) {
      throw new Error(`Experiment with id ${experiment_id} doesn't exist`);
    }

    return experiment;
  }

  public async deleteExperiment(experiment_id: ExperimentId) {
    await this.runExperimentCheck(experiment_id);

    await this._ExperimentModel.deleteExperiment(experiment_id);
  }
}
