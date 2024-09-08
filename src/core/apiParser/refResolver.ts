import { toCamelCaseFileName } from '../../utils/string';

/**
 * Resolves the response type from the $ref.
 */
export const resolveResponseType = (ref: string): string => {
  return ref.split('/').pop()?.replace('.yaml', '') || 'unknown';
};

/**
 * Resolves the filename from the $ref.
 */
export const resolveFileName = (ref: string): string => {
  return toCamelCaseFileName(ref.split('#')[0].split('/').pop() || '');
};
