import logger from '../../utils/logger';

/**
 * Extracts the reference to the success response (status 200) from the responses section.
 *
 * @param responses - The responses object containing all possible HTTP responses.
 * @returns The reference to the success response (status 200) if found.
 */
export const extractSuccessResponseRef = (
  responses: Record<string, any>,
): string | undefined => {
  const successResponse = responses['200'];
  // logger.info({ '>>>>>> successResponse <<<<<<':     successResponse     } );

  // Case 1: Success response has a $ref directly (e.g., "200": { $ref: "../components/responses/200.yaml" })
  if (successResponse && successResponse.$ref) {
    return successResponse.$ref;
  }

  // Case 2: Success response has content with application/json schema
  if (
    successResponse &&
    successResponse.content &&
    successResponse.content['application/json']
  ) {
    const schema = successResponse.content['application/json'].schema;
    if (schema && schema.$ref) {
      return schema.$ref; // Return the $ref pointing to the success schema
    }
  }

  return undefined;
};
