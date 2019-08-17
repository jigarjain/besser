import { ASSIGNMENT_ACTION } from '../constants';

export type ExperimentId = number;
export type VariationId = number;
export type GoalId = number;
export type AssignmentId = number;
export type VisitorId = string;

export interface Experiment {
  id: ExperimentId;
  name: string;
  /** Ranges from 0-100 */
  traffic_alloc: number;
  is_running: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variation {
  id: number;
  name: string;
  experiment_id: number;
  is_control: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  name: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: AssignmentId;
  visitor_id: VisitorId;
  experiment_id: ExperimentId;
  variation_id?: VariationId;
  action: ASSIGNMENT_ACTION;
  created_at: string;
}

export interface AssignmentResult {
  id: AssignmentId;
  experiment_id: ExperimentId;
  experiment_name: Pick<Experiment, 'name'>;
  variation_id: VariationId;
  variation_name: Pick<Variation, 'name'>;
  is_control: Pick<Variation, 'is_control'>;
}

export interface VisitorGoal {
  id: number;
  visitor_assignment_id: AssignmentId;
  goal_id: GoalId;
  device: string;
  browser: string;
  created_at: string;
}

export interface PlatformInfo {
  device: string;
  browser: string;
}
