export interface Experiment {
  id?: number;
  name: string;
  traffic_alloc: number;
  is_running: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Variation {
  id?: number;
  name: string;
  experiment_id: number;
  is_control: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type Goal_Type = 'IMPRESSION' | 'CUSTOM';

export interface Goal {
  id?: number;
  name: string;
  type: Goal_Type;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}