import { injectable } from 'inversify';
import db from '../dbConnection';
import { DB_TABLE } from '../constants';
import { Variation, VariationId, ExperimentId } from '../types/common';

export interface VariationModelInterface {
  getVariationsByExperimentId(
    experiment_id: ExperimentId
  ): Promise<Variation[]>;

  createVariation(variation: Partial<Variation>): Promise<VariationId>;
}

@injectable()
export default class implements VariationModelInterface {
  public async getVariationsByExperimentId(experiment_id: ExperimentId) {
    return await db
      .select()
      .from(DB_TABLE.VARIATIONS)
      .where('experiment_id', experiment_id);
  }

  public async createVariation(variation: Partial<Variation>) {
    const ids = await db(DB_TABLE.VARIATIONS)
      .insert(variation)
      .returning('id');
    return ids[0];
  }
}
