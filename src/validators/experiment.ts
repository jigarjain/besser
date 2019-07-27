export const ErrorMap = {
  name: new Error('Experiment: `name` is missing or invalid'),
  trafficAlloc: new Error(
    'Experiment: `trafficAlloc` is invalid. It should be a positive integer in range of 0-100'
  ),
  isRunning: new Error(
    'Experiment: `isRunning` is invalid. It should be a boolean'
  )
};

interface SanitizedExperiment {
  name: string;
  trafficAlloc: number;
  isRunning: boolean;
}

function validateExperimentName(str: any) {
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
 * validation will allow `trafficAlloc` to be undefined. In which case,
 * it will default to `100`. But if the key is specified, then it must
 * always be a valid number in the range of 0 - 100;
 */
function validateExperimentTraffic(num: any) {
  if (num !== undefined && typeof num !== 'number') {
    return ErrorMap.trafficAlloc;
  }

  if (num !== undefined && (num < 0 || num > 100)) {
    return ErrorMap.trafficAlloc;
  }

  return num !== undefined ? Number(num) : 100;
}

/**
 * validation will allow `isRunning` to be undefined. In which case, it will
 * default to `true`. But if the key is specified, then it must always be a
 * valid boolean
 */
function validateIsRunning(flag: any) {
  if (flag !== undefined && typeof flag !== 'boolean') {
    return ErrorMap.isRunning;
  }

  return flag !== undefined ? Boolean(flag) : true;
}

/**
 * This function is invoked to perform validation when receiving client input for creating a new experiment
 */
export default function validateNewExperiment(body: any) {
  const { name, trafficAlloc, isRunning } = body;
  const sanitized: Record<string, any> = {
    name: validateExperimentName(name),
    trafficAlloc: validateExperimentTraffic(trafficAlloc),
    isRunning: validateIsRunning(isRunning)
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

  return sanitized as SanitizedExperiment;
}
