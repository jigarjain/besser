import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { VariationModelInterface } from '../models/VariationModel';
import { ExperimentServiceInterface } from '../services/ExperimentService';
import { ModelTypes, ServiceTypes } from '../container';
import { Variation } from '../types/common';

export interface VariationServiceInterface {
  /**
   * Returns a Promise which resolves to a list of Variations
   */
  getVariationsForExperiment(experiment_id: number): Promise<Variation[]>;

  /**
   * Returns a Promise which resolves to a list of newly created variation ids
   */
  createVariations(
    experiment_id: number,
    variations: Partial<Variation>[]
  ): Promise<number[]>;
}

@injectable()
export default class VariationService implements VariationServiceInterface {
  private _VariationModel: VariationModelInterface;
  private _ExperimentService: ExperimentServiceInterface;

  /**
   * We use `LazyServiceIdentifier` here due to cyclic dependency
   * https://github.com/inversify/InversifyJS/blob/master/wiki/circular_dependencies.md
   */
  public constructor(
    @inject(new LazyServiceIdentifer(() => ModelTypes.VariationModel))
    variationModel: VariationModelInterface,
    @inject(new LazyServiceIdentifer(() => ServiceTypes.ExperimentService))
    experimentService: ExperimentServiceInterface
  ) {
    this._VariationModel = variationModel;
    this._ExperimentService = experimentService;
  }

  // ToDo: Refactor this as @decorator
  private async runExperimentCheck(experiment_id: number) {
    const experiment = await this._ExperimentService.getExperiment(
      experiment_id
    );

    // If experiment doesn't exist or is deleted, throw error
    if (!experiment || experiment.is_deleted) {
      throw new Error(`Experiment with id ${experiment_id} doesn't exist`);
    }

    return experiment;
  }

  public async getVariationsForExperiment(experiment_id: number) {
    await this.runExperimentCheck(experiment_id);

    return await this._VariationModel.getVariationsByExperimentId(
      experiment_id
    );
  }

  public async createVariations(
    experiment_id: number,
    variations: Partial<Variation>[]
  ) {
    await this.runExperimentCheck(experiment_id);

    // If variations are already created for this experiment, then we must
    // not accept new variations from this endpoint. But rather use `updateVariations`
    // to add more
    const existingVariations = await this._VariationModel.getVariationsByExperimentId(
      experiment_id
    );

    if (existingVariations.length) {
      throw new Error(
        `Experiment with id ${experiment_id} already has some variations. Do you intend to add more variation? Use update(PUT) endpoint instead`
      );
    }

    const insertVariations = variations.map(({ id, ...v }) => {
      return {
        ...v,
        experiment_id
      };
    });

    const inserts = insertVariations.map(v =>
      this._VariationModel.createVariation(v)
    );

    return await Promise.all(inserts);
  }
}
