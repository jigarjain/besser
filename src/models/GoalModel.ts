import { injectable } from 'inversify';
import db from '../dbConnection';
import { Goal } from '../types/common';

export interface GoalModelInterface {
  /**
   * Returns a Promise which resolves to a list of all goals
   */
  getGoals(): Promise<Goal[]>;

  /**
   * Returns a Promise which resolves to a newly created Goal `id`
   */
  createGoal(goal: Partial<Goal>): Promise<number>;

  /**
   * Returns a Promise which resolves to a Goal
   */
  getGoal(goal_id: number): Promise<Goal>;

  /**
   * Returns a Promise which resolves to number of rows updated
   */
  updateGoal(goal_id: number, goal: Partial<Goal>): Promise<number>;
}

@injectable()
export default class implements GoalModelInterface {
  private readonly table = 'goals';

  public async getGoals() {
    return await db.select().from(this.table);
  }

  public async createGoal(goal: Goal) {
    const ids = await db(this.table)
      .insert(goal)
      .returning('id');
    return ids[0];
  }

  public async getGoal(goal_id: number) {
    const goals = await db(this.table)
      .where('id', goal_id)
      .limit(1);
    return goals[0];
  }

  public async updateGoal(goal_id: number, goal: Goal) {
    return await db(this.table)
      .where('id', goal.id)
      .update(goal);
  }
}
