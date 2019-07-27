import experimentValidator, { ErrorMap } from '../../src/validators/experiment';

describe('Experiment Validator', () => {
  let body: Record<string, any>;

  beforeEach(() => {
    body = {
      name: 'Test Exp',
      trafficAlloc: 42,
      isRunning: false
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

  it('should throw error on invalid `trafficAlloc`', () => {
    // When trafficAlloc is string;
    body.trafficAlloc = '';

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.trafficAlloc.message
    );
  });

  it('should throw error when `trafficAlloc` is negative', () => {
    body.trafficAlloc = -2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.trafficAlloc.message
    );
  });

  it('should throw error when `trafficAlloc` is over 100', () => {
    body.trafficAlloc = 100.2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.trafficAlloc.message
    );
  });

  it('should throw error when `trafficAlloc` is negative', () => {
    body.trafficAlloc = -2;

    expect(() => experimentValidator(body)).toThrow(
      ErrorMap.trafficAlloc.message
    );
  });

  it('should set default `trafficAlloc` when its missing', () => {
    delete body.trafficAlloc;

    expect(experimentValidator(body)).toMatchObject({
      trafficAlloc: 100
    });
  });

  it('should throw error on invalid `isRunning`', () => {
    body.isRunning = '';

    expect(() => experimentValidator(body)).toThrow(ErrorMap.isRunning.message);
  });

  it('should set the default `isRunning` to true', () => {
    delete body.isRunning;

    expect(experimentValidator(body)).toMatchObject({
      isRunning: true
    });
  });

  it('should not throw any error when correct data passed', () => {
    expect(experimentValidator(body)).toMatchObject(body);
  });
});
