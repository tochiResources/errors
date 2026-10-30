import { TochiResError, type TochiResErrorOptions } from './base.js';
import { ErrorCode } from './codes.js';

/** Narrow a value to {@link TochiResError}. */
export function isTochiResError(value: unknown): value is TochiResError {
    return value instanceof TochiResError;
}

/** Whether a value is a {@link TochiResError} carrying one of the given codes. */
export function hasErrorCode(value: unknown, ...codes: ErrorCode[]): boolean {
    return value instanceof TochiResError && codes.includes(value.code);
}

/**
 * Coerce any thrown value into a {@link TochiResError}.
 *
 * Already-typed errors pass through unchanged; native `Error`s and arbitrary
 * thrown values are wrapped with {@link ErrorCode.Unknown} and kept as `cause`.
 */
export function toTochiResError(value: unknown, fallbackMessage = 'Unknown error'): TochiResError {
    if (value instanceof TochiResError) return value;
    if (value instanceof Error) {
        return new TochiResError(ErrorCode.Unknown, value.message, { cause: value });
    }
    return new TochiResError(
        ErrorCode.Unknown,
        typeof value === 'string' ? value : fallbackMessage,
        { cause: value }
    );
}

/** Assert a condition, throwing a {@link TochiResError} with the given code if falsy. */
export function assertTochiRes(
    condition: unknown,
    code: ErrorCode,
    message: string,
    options: TochiResErrorOptions = {}
): asserts condition {
    if (!condition) throw new TochiResError(code, message, options);
}
