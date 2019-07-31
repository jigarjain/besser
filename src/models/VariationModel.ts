import db from '../dbConnection';
import { Variation } from '../types/common';

const table = 'variations';

export default {
  /**
   * Returns a Promise which resolves to an `Variation` type object with newly
   * created `id` & timestamps
   */
  async createVariation(variation: Variation) {
    return await db(table).insert(variation);
  },

  /**
   *
   * Returns a Promise which resolves to an `Variation` type object
   */
  async updateVariation(variation: Variation) {
    return await db(table)
      .where('id', variation.id)
      .update(variation);
  }
};
