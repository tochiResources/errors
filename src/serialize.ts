import { TochiResError } from './base.js';
import { ErrorCode, isErrorCode } from './codes.js';
import { errorClassFor } from './errors/index.js';
import type { SerializedError } from './types.js';

/** Serialize any thrown value into a {@link SerializedError}. */
export function serializeError(value: unknown): SerializedError {
    if (value instanceof TochiResError) return value.toJSON();
    if (value instanceof Error) {
        const json: SerializedError = {
            name: value.name || 'Error',
            code: ErrorCode.Unknown,
            category: 'general',
            message: value.message,
        };
        if (value.stack) json.stack = value.stack;
        return json;
    }
    return {
        name: 'Error',
        code: ErrorCode.Unknown,
        category: 'general',
        message: stringifyUnknown(value),
    };
}

/** Whether a value looks like a {@link SerializedError}. */
export function isSerializedError(value: unknown): value is SerializedError {
    if (typeof value !== 'object' || value === null) return false;
    const record = value as Record<string, unknown>;
    return isErrorCode(record.code) && typeof record.message === 'string';
}

/**
 * Rebuild a {@link TochiResError} (with the right domain subclass) from a
 * {@link SerializedError}, preserving the cause chain.
 */
export function deserializeError(value: unknown): TochiResError {
    const record =
        typeof value === 'object' && value !== null ? (value as Partial<SerializedError>) : {};
    const code = isErrorCode(record.code) ? record.code : ErrorCode.Unknown;
    const message = typeof record.message === 'string' ? record.message : 'Unknown error';

    const ErrorClass = errorClassFor(code);
    const context = record.context;
    const error = ErrorClass
        ? new ErrorClass(message, { code, context })
        : new TochiResError(code, message, context ? { context } : {});

    if (record.stack) error.stack = record.stack;
    if (record.cause) (error as { cause?: unknown }).cause = deserializeError(record.cause);
    return error;
}

function stringifyUnknown(value: unknown): string {
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value);
    }
}
