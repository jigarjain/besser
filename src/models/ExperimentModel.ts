import { injectable } from 'inversify';
import db from '../dbConnection';
import { Experiment } from '../types/common';

export interface ExperimentModelInterface {
  /**
   * Returns a Promise which resolves to an array of experiments
   */
  getExperiments(): Promise<Experiment[]>;

  /**
   * Returns a Promise which resolves to a newly created experiment `id`
   */
  createExperiment(experiment: Partial<Experiment>): Promise<number>;

  getExperiment(experiment_id: number): Promise<Experiment>;

  /**
   * Returns a Promise which resolves to an number indicating the number of row which were updated
   */
  updateExperiment(
    experiment_id: number,
    experiment: Partial<Experiment>
  ): Promise<number>;
}

@injectable()
export default class implements ExperimentModelInterface {
  private readonly table = 'experiments';

  public async getExperiments() {
    return await db.select().from(this.table);
  }

  public async createExperiment(experiment: Partial<Experiment>) {
    const ids = await db(this.table)
      .insert(experiment)
      .returning('id');
    return ids[0];
  }

  public async getExperiment(experiment_id: number) {
    const experiments = await db(this.table)
      .where('id', experiment_id)
      .limit(1);

    return experiments[0];
  }

  public async updateExperiment(experiment_id: number, experiment: Experiment) {
    return await db(this.table)
      .where('id', experiment_id)
      .update(experiment);
  }
}
