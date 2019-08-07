import { Goal } from '../types/common';

export const ErrorMap = {
  name: new Error('Goal: `name` of the goal is missing or invalid')
};

function validateGoalName(str: any) {
  if (!str) {
    return ErrorMap.name;
  }

  const name = `${str}`.trim();

  if (name.length === 0) {
    return ErrorMap.name;
  }

  return name;
}

/**
 * We always set `CUSTOM` as the goal type which is received by the user
 */
function validateGoalType() {
  return 'CUSTOM';
}

/**
 * This function is invoked for performing validations when receiving client input for creating a new goal,
 */
export default function validateNewGoal(body: any) {
  const { name } = body;
  const sanitized: Record<string, any> = {
    name: validateGoalName(name),
    type: validateGoalType()
  };

  const errors = [];

  for (let key in sanitized) {
    if (sanitized[key] instanceof Error) {
      errors.push(sanitized[key]);
    }
  }

  if (errors.length) {
    throw errors as [Error];
  }

  return {
    body: sanitized as Partial<Goal>
  };
}
