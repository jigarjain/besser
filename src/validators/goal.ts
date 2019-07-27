export const ErrorMap = {
  name: new Error('Goal: `name` of the goal is missing or invalid')
};

interface SanitizedGoal {
  name: string;
}

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
 * This function is invoked for performing validations when receiving client input for creating a new goal,
 */
export default function validateNewGoal(body: any) {
  const { name } = body;
  const sanitized: Record<string, any> = {
    name: validateGoalName(name)
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

  return sanitized as SanitizedGoal;
}
