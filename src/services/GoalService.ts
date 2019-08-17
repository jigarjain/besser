import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { Goal, GoalId } from '../types/common';
import { ModelTypes } from '../container';
import { GoalModelInterface } from '../models/GoalModel';

export interface GoalServiceInterface {
  /**
   * Returns a Promise which resolves to a list of all goals
   * from the DB
   */
  getAllGoals(): Promise<Goal[]>;

  createGoal(goal: Partial<Goal>): Promise<GoalId>;

  getGoal(goal_id: GoalId): Promise<Goal | undefined>;

  updateGoal(goal_id: GoalId, goal: Partial<Goal>): Promise<void>;
}

@injectable()
export default class GoalService implements GoalServiceInterface {
  private _GoalModel: GoalModelInterface;

  /**
   * We use `LazyServiceIdentifier` here due to cyclic dependency
   * https://github.com/inversify/InversifyJS/blob/master/wiki/circular_dependencies.md
   */
  public constructor(
    @inject(new LazyServiceIdentifer(() => ModelTypes.GoalModel))
    goalModel: GoalModelInterface
  ) {
    this._GoalModel = goalModel;
  }

  public async getAllGoals() {
    return await this._GoalModel.getGoals();
  }

  public async createGoal(goal: Partial<Goal>) {
    return await this._GoalModel.createGoal(goal);
  }

  public async getGoal(goal_id: GoalId) {
    return await this._GoalModel.getGoal(goal_id);
  }

  public async updateGoal(goal_id: GoalId, goal: Goal) {
    // Delete the id to prevent from goal.id getting tampered in DB
    delete goal.id;

    await this._GoalModel.updateGoal(goal_id, goal);
  }
}
