import { Experiment } from '../types/common';

export const ErrorMap = {
  name: new Error('Experiment: `name` is missing or invalid'),
  traffic_alloc: new Error(
    'Experiment: `traffic_alloc` is invalid. It should be a positive integer in range of 0-100'
  ),
  is_running: new Error(
    'Experiment: `is_running` is invalid. It should be a boolean'
  )
};

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
 * validation will allow `traffic_alloc` to be undefined. In which case,
 * it will default to `100`. But if the key is specified, then it must
 * always be a valid number in the range of 0 - 100;
 */
function validateExperimentTraffic(num: any) {
  if (num !== undefined && typeof num !== 'number') {
    return ErrorMap.traffic_alloc;
  }

  if (num !== undefined && (num < 0 || num > 100)) {
    return ErrorMap.traffic_alloc;
  }

  return num !== undefined ? Number(num) : 100;
}

/**
 * validation will allow `is_running` to be undefined. In which case, it will
 * default to `true`. But if the key is specified, then it must always be a
 * valid boolean
 */
function validateIsRunning(flag: any) {
  if (flag !== undefined && typeof flag !== 'boolean') {
    return ErrorMap.is_running;
  }

  return flag !== undefined ? Boolean(flag) : true;
}

/**
 * This function is invoked to perform validation when receiving client input for creating a new experiment
 */
export default function validateNewExperiment(body: any) {
  const { name, traffic_alloc, is_running } = body;
  const sanitized: Record<string, any> = {
    name: validateExperimentName(name),
    traffic_alloc: validateExperimentTraffic(traffic_alloc),
    is_running: validateIsRunning(is_running),
    is_deleted: false
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

  return sanitized as Partial<Experiment>;
}
