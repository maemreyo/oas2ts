import logger from '../logger';

// Generic error handler to log and throw errors
export const handleError = (error: Error, context: string): void => {
  logger.error(`Error in ${context}`, error);
  throw new Error(`Error in ${context}: ${error.message}`);
};
