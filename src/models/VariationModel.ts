import { injectable } from 'inversify';
import db from '../dbConnection';
import { Variation, VariationId, ExperimentId } from '../types/common';

export interface VariationModelInterface {
  getVariationsByExperimentId(
    experiment_id: ExperimentId
  ): Promise<Variation[]>;

  createVariation(variation: Partial<Variation>): Promise<VariationId>;

  getVariation(variation_id: VariationId): Promise<Variation>;
}

@injectable()
export default class implements VariationModelInterface {
  private readonly table = 'variations';

  public async getVariationsByExperimentId(experiment_id: ExperimentId) {
    return await db
      .select()
      .from(this.table)
      .where('experiment_id', experiment_id);
  }

  public async createVariation(variation: Partial<Variation>) {
    const ids = await db(this.table)
      .insert(variation)
      .returning('id');
    return ids[0];
  }

  public async getVariation(variation_id: VariationId) {
    const variations = await db(this.table).where('id', variation_id);
    return variations[0];
  }
}
