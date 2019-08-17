import { injectable } from 'inversify';
import db from '../dbConnection';
import { ASSIGNMENT_ACTION } from '../constants';
import {
  VisitorId,
  Assignment,
  AssignmentResult,
  VisitorGoal
} from '../types/common';

export interface VisitorModelInterface {
  /**
   * Returns a Promise which resolves to Assignments for the visitor
   */
  getAllAssignmentsForVisitor(visitor_id: VisitorId): Promise<Assignment[]>;

  /**
   * Will only return those Assignments which are marked as 'ASSIGNED` & experiments
   * are in running state & variation is active
   */
  getActiveAssignmentsForVisitor(
    visitor_id: VisitorId
  ): Promise<AssignmentResult[]>;

  /**
   * Returns a Promise which resolves to the newly created Assignment
   */
  createAssigmentForVisitor(
    assignment: Partial<Assignment>
  ): Promise<Assignment>;

  /**
   * Inserts a goal for tracking purpose. Returns a Promise which resolves to void
   */
  trackGoal(visitor_goal: VisitorGoal): Promise<void>;
}

@injectable()
export default class VisitorModel implements VisitorModelInterface {
  private readonly table = 'visitor_assignments';

  public async getAllAssignmentsForVisitor(visitor_id: VisitorId) {
    return await db
      .select()
      .from(this.table)
      .where('visitor_id', visitor_id);
  }

  public async getActiveAssignmentsForVisitor(visitor_id: VisitorId) {
    const columnsToPick = [
      `${this.table}.id`,
      `${this.table}.experiment_id`,
      `${this.table}.variation_id`,
      'experiments.name as experiment_name',
      'variations.name as variation_name',
      'variations.is_control'
    ];

    return await db
      .from(this.table)
      .select(columnsToPick)
      .join('experiments', `${this.table}.experiment_id`, 'experiments.id')
      .join('variations', `${this.table}.variation_id`, 'variations.id')
      .where(`${this.table}.visitor_id`, visitor_id)
      .where('experiments.is_running', true)
      .where('experiments.is_deleted', false)
      .where('variations.is_active', true)
      .where(`${this.table}.action`, ASSIGNMENT_ACTION.ASSIGNED);
  }

  public async createAssigmentForVisitor(assignment: Partial<Assignment>) {
    return await db(this.table)
      .insert(assignment)
      .returning<Assignment>('*');
  }

  public async trackGoal(visitor_goal: Partial<VisitorGoal>) {
    await db('visitor_goals').insert(visitor_goal);
    return;
  }
}
