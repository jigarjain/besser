import db from '../dbConnection';
import { Experiment } from '../types/common';

const table = 'experiments';

export default {
  async getExperiments() {
    return await db.select().from<Experiment>(table);
  },

  /**
   * Returns a Promise which resolves to an id of a newly created Experiment`
   */
  async createExperiment(experiment: Partial<Experiment>) {
    const ids = await db(table)
      .insert(experiment)
      .returning('id');
    return ids[0] as Pick<Experiment, 'id'>;
  },

  async getExperiment(experiment_id: number) {
    const experiments = await db(table)
      .where<Experiment[]>('id', experiment_id)
      .limit(1);
    return experiments[0];
  },

  /**
   *
   * Returns a Promise which resolves to an number indicating the number of row
   * which were updated
   */
  async updateExperiment(experiment_id: number, experiment: Experiment) {
    return await db(table)
      .where<Experiment>('id', experiment_id)
      .update(experiment);
  }
};
