import experimentValidator, { ErrorMap } from '../../src/validators/experiment';

describe('Experiment Validator', () => {
  let body: Record<string, any>;

  beforeEach(() => {
    body = {
      name: 'Test Exp',
      traffic_alloc: 42,
      is_running: false
    };
  });

  // Experiment name is required while creating a new experiment
  it('should throw error on invalid `name`', () => {
    body.name = '';

    expect(() => experimentValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should throw error on missing `name`', () => {
    delete body.name;

    expect(() => experimentValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should throw error on invalid `traffic_alloc`', () => {
    // When traffic_alloc is string;
    body.traffic_alloc = '';

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.traffic_alloc.message
    );
  });

  it('should throw error when `traffic_alloc` is negative', () => {
    body.traffic_alloc = -2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.traffic_alloc.message
    );
  });

  it('should throw error when `traffic_alloc` is over 100', () => {
    body.traffic_alloc = 100.2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.traffic_alloc.message
    );
  });

  it('should throw error when `traffic_alloc` is negative', () => {
    body.traffic_alloc = -2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.traffic_alloc.message
    );
  });

  it('should set default `traffic_alloc` when its missing', () => {
    delete body.traffic_alloc;

    expect(experimentValidator(body).body).toMatchObject({
      traffic_alloc: 100
    });
  });

  it('should throw error on invalid `is_running`', () => {
    body.is_running = '';

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.is_running.message
    );
  });

  it('should set the default `is_running` to true', () => {
    delete body.is_running;

    expect(experimentValidator(body).body).toMatchObject({
      is_running: true
    });
  });

  it('should not throw any error when correct data passed', () => {
    expect(experimentValidator(body)).toMatchObject({ body });
  });
});
