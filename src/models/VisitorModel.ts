import { injectable } from 'inversify';
import db from '../dbConnection';
import { ASSIGNMENT_ACTION, DB_TABLE } from '../constants';
import {
  VisitorId,
  Assignment,
  AssignmentResult,
  VisitorGoal
} from '../types/common';

export interface VisitorModelInterface {
  /**
   * Returns all the assignments for the visitor from the DB irrespective
   * of any flags set
   */
  getAllAssignmentsForVisitor(visitor_id: VisitorId): Promise<Assignment[]>;

  /**
   * Will only return those Assignments which are marked as 'ASSIGNED` & experiments
   * & variations which are in active state
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
  trackGoal(visitor_goal: Partial<VisitorGoal>): Promise<void>;
}

@injectable()
export default class VisitorModel implements VisitorModelInterface {
  public async getAllAssignmentsForVisitor(visitor_id: VisitorId) {
    return await db
      .select()
      .from(DB_TABLE.VISITOR_ASSIGNMENTS)
      .where('visitor_id', visitor_id);
  }

  public async getActiveAssignmentsForVisitor(visitor_id: VisitorId) {
    const columnsToPick = [
      `${DB_TABLE.VISITOR_ASSIGNMENTS}.id`,
      `${DB_TABLE.VISITOR_ASSIGNMENTS}.experiment_id`,
      `${DB_TABLE.VISITOR_ASSIGNMENTS}.variation_id`,
      `${DB_TABLE.EXPERIMENTS}.name as experiment_name`,
      `${DB_TABLE.VARIATIONS}.name as variation_name`,
      `${DB_TABLE.VARIATIONS}.is_control`
    ];

    return await db
      .from(DB_TABLE.VISITOR_ASSIGNMENTS)
      .select(columnsToPick)
      .join(
        `${DB_TABLE.EXPERIMENTS}`,
        `${DB_TABLE.VISITOR_ASSIGNMENTS}.experiment_id`,
        `${DB_TABLE.EXPERIMENTS}.id`
      )
      .join(
        `${DB_TABLE.VARIATIONS}`,
        `${DB_TABLE.VISITOR_ASSIGNMENTS}.variation_id`,
        `${DB_TABLE.VARIATIONS}.id`
      )
      .where(`${DB_TABLE.VISITOR_ASSIGNMENTS}.visitor_id`, visitor_id)
      .where(`${DB_TABLE.EXPERIMENTS}.is_running`, true)
      .where(`${DB_TABLE.EXPERIMENTS}.is_deleted`, false)
      .where(`${DB_TABLE.VARIATIONS}.is_active`, true)
      .where(
        `${DB_TABLE.VISITOR_ASSIGNMENTS}.action`,
        ASSIGNMENT_ACTION.ASSIGNED
      );
  }

  public async createAssigmentForVisitor(assignment: Partial<Assignment>) {
    return await db(DB_TABLE.VISITOR_ASSIGNMENTS)
      .insert(assignment)
      .returning<Assignment>('*');
  }

  public async trackGoal(visitor_goal: Partial<VisitorGoal>) {
    await db(DB_TABLE.VISITOR_GOALS).insert(visitor_goal);
    return;
  }
}
