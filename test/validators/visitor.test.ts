import visitorValidator, { ErrorMap } from '../../src/validators/visitor';

describe('Visitor Validator', () => {
  let query: Record<string, any>;

  beforeEach(() => {
    query = {
      experiment_ids: '1,2,3'
    };
  });

  // Experiment name is required while creating a new experiment
  it('should throw error on invalid `experiment_ids` in query params', () => {
    query.experiment_ids = '  ';

    expect(() => visitorValidator(undefined, query)).toThrow(
      ErrorMap.experiment_ids.message
    );

    query.experiment_ids = 'abc,3,4';

    expect(() => visitorValidator(undefined, query)).toThrow(
      ErrorMap.experiment_ids.message
    );
  });

  it('should throw error on missing `experiment_ids` in query params', () => {
    delete query.experiment_ids;

    expect(() => visitorValidator(undefined, query)).toThrow(
      ErrorMap.experiment_ids.message
    );
  });

  it('should not throw any error when correct data passed', () => {
    expect(visitorValidator(undefined, query)).toMatchObject({
      query: {
        experiment_ids: [1, 2, 3]
      }
    });
  });
});
