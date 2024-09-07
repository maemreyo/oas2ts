"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    baseType: {
        UUID: {
            type: 'string',
            format: 'uuid',
            props: ['id'],
        },
        ISODate: {
            type: 'string',
            format: 'date-time',
            props: ['at', 'created', 'updated', 'time'],
        },
    },
};
exports.default = config;
