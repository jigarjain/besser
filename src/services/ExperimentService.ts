import { Experiment } from '../types/common';
import Container, { ModelTypes } from '../inversify.config';
import { ExperimentModelInterface } from '../models/ExperimentModel';

const ExperimentModel = Container.get<ExperimentModelInterface>(
  ModelTypes.ExperimentModel
);

export default {
  async getAllExperiments() {
    return await ExperimentModel.getExperiments();
  },

  async createExperiment(experiment: Partial<Experiment>) {
    return await ExperimentModel.createExperiment(experiment);
  },

  async getExperiment(experiment_id: number) {
    return await ExperimentModel.getExperiment(experiment_id);
  },

  async updateExperiment(experiment_id: number, experiment: Experiment) {
    // Delete the id from the experiment object as it is passed separately
    delete experiment.id;

    return await ExperimentModel.updateExperiment(experiment_id, experiment);
  }
};
