import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import _ from 'lodash';
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

  updateVariations(
    experiment_id: number,
    variations: Partial<Variation>[]
  ): Promise<void>;
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

  public async updateVariations(
    experiment_id: number,
    variations: Partial<Variation>[]
  ) {
    await this.runExperimentCheck(experiment_id);

    const existingVariations = await this._VariationModel.getVariationsByExperimentId(
      experiment_id
    );

    const variationToCreate = variations.filter(v => !v.id);
    const variationsToUpdate = variations.filter(v => v.id);

    /**
     * Because we expect to receive the entire variations list again for update,
     * we must check whether the ones which we receive that has ids are same as
     * the ones which exist in our DB.
     * Basically, we should receive atleast all the variations for update which
     * exists in our DB
     * */
    const existingVariationIds = existingVariations.map(v => v.id);
    const variationsToUpdateIds = variationsToUpdate.map(v => v.id);

    if (!_.isEqual(existingVariationIds, variationsToUpdateIds)) {
      throw new Error(
        'Some Variation(s) are inconsistent with the existing variations. For updating, please send the entire list of variations'
      );
    }

    // Create insert requests
    const inserts = variationToCreate.map(v => {
      const variation = {
        ...v,
        experiment_id
      };

      return this._VariationModel.createVariation(variation);
    });

    // Create update requests
    const updates = variationsToUpdate.map(v => {
      const variationId = v.id as number;
      const variation = {
        ...v,
        experiment_id
      };

      return this._VariationModel.updateVariation(variationId, variation);
    });

    await Promise.all([...inserts, ...updates]);
  }
}
