import variationValidator, { ErrorMap } from '../../src/validators/variation';

describe('Variation Validator', () => {
  let body: any;

  beforeEach(() => {
    body = [
      {
        name: 'Variation1',
        is_control: true,
        is_active: true
      },
      {
        name: 'Variation2',
        is_control: false,
        is_active: true
      }
    ];
  });

  // Variation name should be non-empty
  it('should throw error on invalid variations object', () => {
    // body as string
    body = '';

    expect(() => variationValidator(body)).toThrow(ErrorMap.variations.message);

    // body as empty array
    body = [];

    expect(() => variationValidator(body)).toThrow(ErrorMap.variations.message);

    // body as array of strings
    body = ['', true, {}];

    expect(() => variationValidator(body)).toThrow();
  });

  // Variation name should be non-empty
  it('should throw error on non-empty `name`', () => {
    // empty name
    body[0].name = '';

    expect(() => variationValidator(body)).toThrow(ErrorMap.name.message);

    // non-empty space-filled string
    body[0].name = '    ';

    expect(() => variationValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should throw error on missing `name`', () => {
    delete body[1].name;

    expect(() => variationValidator(body)).toThrow(ErrorMap.name.message);
  });

  it('should throw error on invalid `is_control` flag', () => {
    body[1].is_control = '';

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_control.message);
  });

  it('should throw error on missing `is_control` flag', () => {
    delete body[0].is_control;

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_control.message);
  });

  it('should throw error when there are 0 `is_control` flag set to true', () => {
    body[0].is_control = false;

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_control.message);
  });

  it('should throw error when there are more than 1 `is_control` flag set to true', () => {
    body[1].is_control = true;

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_control.message);
  });

  it('should throw error on invalid `is_active` flag', () => {
    body[1].is_active = '';

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_active.message);

    body[1].is_active = 'truthy';

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_active.message);
  });

  it('should throw error on missing `is_active` flag', () => {
    delete body[0].is_active;

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_active.message);
  });

  it('should throw error when there are 0 `is_active` flag set to true', () => {
    body[0].is_active = false;
    body[1].is_active = false;

    expect(() => variationValidator(body)).toThrow(ErrorMap.is_active.message);
  });

  it('should not throw error when one `is_active` is set to false while the other is set to `true`', () => {
    body[0].is_active = false;

    expect(variationValidator(body)).toMatchObject(body);
  });

  it('should not throw any error when correct data passed', () => {
    expect(variationValidator(body)).toMatchObject(body);
  });
});
