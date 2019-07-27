import goalValidator, { ErrorMap } from '../../src/validators/goal';

describe('Goal Validator', () => {
  let body: Record<string, any>;

  beforeEach(() => {
    body = {
      name: 'Test Goal'
    };
  });

  // goal name is required while creating a new goal
  it('should throw error on invalid `name`', () => {
    body.name = '';

    expect(() => goalValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should throw error on missing `name`', () => {
    delete body.name;

    expect(() => goalValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should not throw any error when correct data passed', () => {
    expect(goalValidator(body)).toMatchObject(body);
  });
});
