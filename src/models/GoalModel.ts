import db from '../dbConnection';
import { Goal } from '../types/common';

const table = 'goals';

export default {
  /**
   * Returns a Promise which resolves to an `Goal` type object with newly
   * created `id` & timestamps
   */
  async createGoal(goal: Goal) {
    return await db(table).insert(goal);
  },

  /**
   *
   * Returns a Promise which resolves to an `Goal` type object
   */
  async updateGoal(goal: Goal) {
    return await db(table)
      .where('id', goal.id)
      .update(goal);
  }
};
