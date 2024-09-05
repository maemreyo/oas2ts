// src/shared/errorHandler/index.ts
import { logError } from '../logger';

export function handleError(error: Error) {
  logError(`Error: ${error.message}`);
}
