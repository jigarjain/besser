import { injectable } from 'inversify';
import db from '../dbConnection';
import { Experiment, ExperimentId } from '../types/common';

export interface ExperimentModelInterface {
  /**
   * Returns *all* the experiments from the DB irrespective
   * of any flags set
   */
  getExperiments(): Promise<Experiment[]>;

  createExperiment(experiment: Partial<Experiment>): Promise<ExperimentId>;

  getExperiment(experiment_id: ExperimentId): Promise<Experiment | undefined>;

  updateExperiment(
    experiment_id: ExperimentId,
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

  public async getExperiment(experiment_id: ExperimentId) {
    const experiments = await db(this.table).where('id', experiment_id);

    return experiments[0];
  }

  public async updateExperiment(
    experiment_id: ExperimentId,
    experiment: Experiment
  ) {
    return await db(this.table)
      .where('id', experiment_id)
      .update(experiment);
  }
}
