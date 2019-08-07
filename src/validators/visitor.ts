export const ErrorMap = {
  experiment_ids: new Error(
    '`experiment_ids` must exists in query params & it should be a comma-separated list of experiment ids'
  )
};

function validateExperimentIds(experiment_ids: string) {
  if (typeof experiment_ids !== 'string' || !experiment_ids.trim().length) {
    return ErrorMap.experiment_ids;
  }

  const ids = experiment_ids
    .split(',')
    .map(str => str.trim())
    .map(Number);

  if (ids.some(isNaN)) {
    return ErrorMap.experiment_ids;
  }

  return ids;
}

export default function validateActivation(_: void, query: any) {
  const { experiment_ids } = query;

  const sanitized: Record<string, any> = {
    experiment_ids: validateExperimentIds(experiment_ids)
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
    query: sanitized
  };
}
