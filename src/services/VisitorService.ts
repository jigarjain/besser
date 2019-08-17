import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { ASSIGNMENT_ACTION } from '../constants';
import { getRandomIntInclusive } from '../utils/helpers';
import { ServiceTypes, ModelTypes } from '../container';
import { ExperimentServiceInterface } from '../services/ExperimentService';
import { VariationServiceInterface } from '../services/VariationService';
import { GoalServiceInterface } from '../services/GoalService';
import { VisitorModelInterface } from '../models/VisitorModel';
import {
  VisitorId,
  ExperimentId,
  GoalId,
  AssignmentId,
  Experiment,
  Variation,
  Assignment,
  AssignmentResult,
  PlatformInfo
} from '../types/common';

export interface VisitorServiceInterface {
  /**
   * This method will assign the visitor to a variation for every
   * eligible & active experiments. It is also possible that the visitor may
   * not be assigned to any experiment based on the `traffic_alloc` set for an
   * experiment or if experiment does not meet any other eligibility criteria
   */
  getAssignments(visitor_id: VisitorId): Promise<AssignmentResult[]>;

  /**
   * This method will assign the visitor to a variation for the list of experiments
   * passed to it. It will still check whether the experiment is active & calculate
   * based on the `traffic_alloc` of the experiment. But it will skip the checks
   * for the eligibility of the experiment
   */
  activate(
    visitor_id: VisitorId,
    experiment_ids: ExperimentId[]
  ): Promise<AssignmentResult[]>;

  track(
    visitor_id: VisitorId,
    goal_id: GoalId,
    platform_info: PlatformInfo
  ): void;
}

@injectable()
export default class VisitorService implements VisitorServiceInterface {
  private _ExperimentService: ExperimentServiceInterface;
  private _VariationService: VariationServiceInterface;
  private _VisitorModel: VisitorModelInterface;
  private _GoalService: GoalServiceInterface;

  /**
   * We use `LazyServiceIdentifier` here due to cyclic dependency
   * https://github.com/inversify/InversifyJS/blob/master/wiki/circular_dependencies.md
   */
  public constructor(
    @inject(new LazyServiceIdentifer(() => ModelTypes.VisitorModel))
    visitorModel: VisitorModelInterface,
    @inject(new LazyServiceIdentifer(() => ServiceTypes.ExperimentService))
    experimentService: ExperimentServiceInterface,
    @inject(new LazyServiceIdentifer(() => ServiceTypes.VariationService))
    variationService: VariationServiceInterface,
    @inject(new LazyServiceIdentifer(() => ServiceTypes.GoalService))
    goalService: GoalServiceInterface
  ) {
    this._VisitorModel = visitorModel;
    this._ExperimentService = experimentService;
    this._VariationService = variationService;
    this._GoalService = goalService;
  }

  private isExperimentActive(experiment: Experiment) {
    return experiment.is_running && !experiment.is_deleted;
  }

  private getUnAssignedExperiments(
    currentAssignments: Assignment[],
    experiments: Experiment[]
  ) {
    const assignedExperimentIds = currentAssignments.map(
      ca => ca.experiment_id
    );

    return experiments.reduce(
      (acc, e) => {
        return e && assignedExperimentIds.includes(e.id)
          ? acc
          : acc.concat([e]);
      },
      [] as Experiment[]
    );
  }

  /**
   * This method decides whether visitor should be assigned to the the
   * experiment depending on the `traffic_alloc`.
   */
  private isVisitorPartOfExperimentTraffic(experiment: Experiment) {
    const random = getRandomIntInclusive(0, 100);

    return random <= experiment.traffic_alloc;
  }

  /**
   * This method decides which variation should be assigned to the visitor.
   * It will filter out inactive variations before deciding a random variation
   * for assignment
   */
  private getVariationToAssign(variations: Variation[]) {
    const activeVariations = variations.filter(v => v.is_active);
    const random = getRandomIntInclusive(0, activeVariations.length - 1);

    return activeVariations[random];
  }

  /**
   * This method will mark the visitor as `IGNORED` for the given experiment
   */
  private async ignoreVisitorForExperiment(
    visitor_id: VisitorId,
    experiment: Experiment
  ) {
    const assignment: Partial<Assignment> = {
      visitor_id,
      experiment_id: experiment.id,
      action: ASSIGNMENT_ACTION.IGNORED
    };

    return await this._VisitorModel.createAssigmentForVisitor(assignment);
  }

  /**
   * This method will assign the given variation to the visitor
   */
  private async assignVisitorToVariation(
    visitor_id: VisitorId,
    variation: Variation
  ) {
    const assignment: Partial<Assignment> = {
      visitor_id,
      experiment_id: variation.experiment_id,
      variation_id: variation.id,
      action: ASSIGNMENT_ACTION.ASSIGNED
    };

    return await this._VisitorModel.createAssigmentForVisitor(assignment);
  }

  private async generateAssignmentForVisitor(
    visitor_id: VisitorId,
    experiment: Experiment
  ) {
    // Experiment is not active, so do nothing
    if (!this.isExperimentActive(experiment)) {
      return Promise.resolve();
    }

    // Visitor cannot be allocated to experiment traffic
    if (!this.isVisitorPartOfExperimentTraffic(experiment)) {
      return this.ignoreVisitorForExperiment(visitor_id, experiment);
    }

    const variations = await this._VariationService.getVariationsForExperiment(
      experiment.id
    );

    // If no variations are present for this experiment, then ignore the user
    // for this experiment
    if (!variations.length) {
      return this.ignoreVisitorForExperiment(visitor_id, experiment);
    }

    // Fetch variation which needs to be assigned to the visitor
    const visitorVariation = this.getVariationToAssign(variations);

    return this.assignVisitorToVariation(visitor_id, visitorVariation);
  }

  public async getAssignments(visitor_id: VisitorId) {
    const [experiments, currentAssignments] = await Promise.all([
      this._ExperimentService.getAllExperiments(),
      this._VisitorModel.getAllAssignmentsForVisitor(visitor_id)
    ]);

    const unassignedExperiments = this.getUnAssignedExperiments(
      currentAssignments,
      experiments
    );

    const generateAssignmentPromises = unassignedExperiments.map(
      async experiment => {
        return this.generateAssignmentForVisitor(visitor_id, experiment);
      }
    );

    await Promise.all(generateAssignmentPromises);

    return await this._VisitorModel.getActiveAssignmentsForVisitor(visitor_id);
  }

  public async activate(visitor_id: VisitorId, experiment_ids: ExperimentId[]) {
    const currentAssignments = await this._VisitorModel.getAllAssignmentsForVisitor(
      visitor_id
    );

    const experiments = await Promise.all(
      experiment_ids.map(exp_id =>
        this._ExperimentService.getExperiment(exp_id)
      )
    );

    /**
     * Remove undefined experiments received possibly due to incorrect experiment_ids
     * passed to the API
     */
    const filteredExps = experiments.filter(e => Boolean(e)) as Experiment[];

    const unassignedExperiments = this.getUnAssignedExperiments(
      currentAssignments,
      filteredExps
    );

    const generateAssignmentPromises = unassignedExperiments.map(
      async experiment => {
        if (!experiment) {
          return Promise.resolve();
        }

        return this.generateAssignmentForVisitor(visitor_id, experiment);
      }
    );

    await Promise.all(generateAssignmentPromises);

    const assigments = await this._VisitorModel.getActiveAssignmentsForVisitor(
      visitor_id
    );

    // Only return for those experiments which were requested to be activated
    return assigments.filter(a => experiment_ids.includes(a.experiment_id));
  }

  public async track(
    visitor_id: VisitorId,
    goal_id: GoalId,
    platform_info: PlatformInfo
  ) {
    // Validate whether goal exists or not
    const goal = await this._GoalService.getGoal(goal_id);

    if (!goal) {
      return;
    }

    const assignments = await this._VisitorModel.getActiveAssignmentsForVisitor(
      visitor_id
    );

    const goalPromises = assignments.map(async assignment => {
      const visitorGoal = {
        visitor_assignment_id: assignment.id as AssignmentId,
        goal_id,
        device: platform_info.device || '',
        browser: platform_info.browser || ''
      };

      return this._VisitorModel.trackGoal(visitorGoal);
    });

    await Promise.all(goalPromises);
  }
}
