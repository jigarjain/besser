import { Variation } from '../types/common';

export const ErrorMap = {
  variations: new Error(
    'Variation: It is required & must be a non-empty array of variation object'
  ),
  name: new Error('Variation: `name` is missing or invalid'),
  is_control: new Error(
    'Variation: `is_control` is invalid. It must be a boolean & there must exist exactly one variation where `is_control` is `true`'
  ),
  is_active: new Error(
    'Variation: `is_active` is invalid. It must be a boolean & there must exist atleast one variation where `is_active` is `true`'
  )
};

function doesNonBoolPropertyExists(arr: [Record<string, any>], prop: string) {
  return arr.some(a => a.hasOwnProperty(prop) && typeof a[prop] !== 'boolean');
}

function doesOneTruePropExists(arr: [Record<string, any>], prop: string) {
  return arr.some(a => a[prop] === true);
}

function validateVariationName(str: any) {
  if (!str) {
    return ErrorMap.name;
  }

  if (`${str}`.trim().length === 0) {
    return ErrorMap.name;
  }

  return;
}

/**
 * Given a list of variations for creation/updation, there should exists exactly
 * one variation whose `is_control` is set to `true`. The property `is_control` is
 * optional but if set, it should only be a boolean value
 */
function validateIsControlFlag(validations: [any]) {
  // Check if non-boolean value exists
  const doesNonBoolValueExists = doesNonBoolPropertyExists(
    validations,
    'is_control'
  );
  const doesControlExists = doesOneTruePropExists(validations, 'is_control');
  const totalControls = validations.filter(v => v.is_control === true);

  if (
    doesNonBoolValueExists ||
    !doesControlExists ||
    totalControls.length !== 1
  ) {
    return ErrorMap.is_control;
  }

  return;
}

/**
 * Given a list of variations for creation/updation, there should exists atleast
 * one variation whose `is_active` is set to `true`. The property `is_active` is
 * required
 */
function validateIsActiveFlag(validations: [any]) {
  // Check if non-boolean value exists
  const doesNonBoolValueExists = doesNonBoolPropertyExists(
    validations,
    'is_active'
  );
  const doesActiveVariationExists = doesOneTruePropExists(
    validations,
    'is_active'
  );
  const isKeyMissing = validations.some(v => !v.hasOwnProperty('is_active'));

  if (doesNonBoolValueExists || !doesActiveVariationExists || isKeyMissing) {
    return ErrorMap.is_active;
  }

  return;
}

/**
 * This function is invoked to perform validation when receiving client input for creating a new variations
 */
export default function validateVariations(variations: any) {
  if (!variations || !Array.isArray(variations) || !variations.length) {
    throw ErrorMap.variations;
  }

  // Validate variation names
  let errors = variations.map(v => validateVariationName(v.name));

  // Validate `is_control`
  errors.push(validateIsControlFlag(variations as [any]));

  // Validate `is_active` flag
  errors.push(validateIsActiveFlag(variations as [any]));

  const filteredErrors = errors.filter(e => e instanceof Error);

  if (filteredErrors.length) {
    throw filteredErrors as Error[];
  }

  const sanitized = variations.map(v => {
    return {
      name: v.name.trim(),
      is_control: Boolean(v.is_control),
      is_active: Boolean(v.is_active)
    };
  });

  return {
    body: sanitized as Partial<Variation>
  };
}
