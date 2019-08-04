import { injectable } from 'inversify';
import db from '../dbConnection';
import { Variation } from '../types/common';

export interface VariationModelInterface {
  /**
   * Returns a Promise which resolves to a list of all variations belonging to
   * the experiment
   */
  getVariationsByExperimentId(experiment_id: number): Promise<Variation[]>;

  /**
   * Returns a Promise which resolves to a newly created Variation `id`
   */
  createVariation(variation: Partial<Variation>): Promise<number>;

  /**
   * Returns a Promise which resolves to a Vatiation
   */
  getVariation(variation_id: number): Promise<Variation>;

  /**
   * Returns a Promise which resolves to number of rows updated
   */
  updateVariation(
    variation_id: number,
    variation: Partial<Variation>
  ): Promise<number>;
}

@injectable()
export default class implements VariationModelInterface {
  private readonly table = 'variations';

  public async getVariationsByExperimentId(experiment_id: number) {
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

  public async getVariation(variation_id: number) {
    const variations = await db(this.table)
      .where('id', variation_id)
      .limit(1);
    return variations[0];
  }

  public async updateVariation(variation_id: number, variation: Variation) {
    return await db(this.table)
      .where('id', variation_id)
      .update(variation);
  }
}
