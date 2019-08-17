import { injectable } from 'inversify';
import db from '../dbConnection';
import { DB_TABLE } from '../constants';
import { Goal, GoalId } from '../types/common';

export interface GoalModelInterface {
  /**
   * Returns all goals from the DB
   */
  getGoals(): Promise<Goal[]>;

  createGoal(goal: Partial<Goal>): Promise<GoalId>;

  getGoal(goal_id: GoalId): Promise<Goal | undefined>;

  updateGoal(goal_id: GoalId, goal: Partial<Goal>): Promise<number>;
}

@injectable()
export default class implements GoalModelInterface {
  public async getGoals() {
    return await db.select().from(DB_TABLE.GOALS);
  }

  public async createGoal(goal: Goal) {
    const ids = await db(DB_TABLE.GOALS)
      .insert(goal)
      .returning('id');
    return ids[0];
  }

  public async getGoal(goal_id: GoalId) {
    const goals = await db(DB_TABLE.GOALS).where('id', goal_id);
    return goals[0];
  }

  public async updateGoal(goal_id: GoalId, goal: Goal) {
    return await db(DB_TABLE.GOALS)
      .where('id', goal.id)
      .update(goal);
  }
}
