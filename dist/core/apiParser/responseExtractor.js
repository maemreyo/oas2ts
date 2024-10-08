"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSuccessResponseRef = void 0;
/**
 * Extracts the reference to the success response (status 200) from the responses section.
 *
 * @param responses - The responses object containing all possible HTTP responses.
 * @returns The reference to the success response (status 200) if found.
 */
const extractSuccessResponseRef = (responses) => {
    const successResponse = responses['200'];
    if (successResponse &&
        successResponse.content &&
        successResponse.content['application/json']) {
        const schema = successResponse.content['application/json'].schema;
        if (schema && schema.$ref) {
            return schema.$ref; // Return the $ref pointing to the success schema
        }
    }
    return undefined;
};
exports.extractSuccessResponseRef = extractSuccessResponseRef;
