import { categoryOf, type ErrorCategory, ErrorCode } from './codes.js';
import type { SerializedError } from './types.js';

/** Options accepted by every {@link TochiResError}. */
export interface TochiResErrorOptions {
    /** Underlying error/value that caused this one. */
    cause?: unknown;
    /** Structured, JSON-safe context for logging and telemetry. */
    context?: Record<string, unknown>;
}

/**
 * Base class for every typed error in this package.
 *
 * Carries a stable {@link ErrorCode} (mirrored in C#), a derived
 * {@link ErrorCategory}, optional structured context and an optional cause
 * chain, and serializes to a {@link SerializedError} that survives JSON-RPC.
 */
export class TochiResError extends Error {
    /** Stable code — part of the public contract. */
    readonly code: ErrorCode;
    /** Coarse category derived from {@link code}. */
    readonly category: ErrorCategory;
    /** Structured, JSON-safe context. */
    readonly context?: Record<string, unknown>;
    /** Underlying cause, if any. */
    readonly cause?: unknown;

    constructor(code: ErrorCode, message: string, options: TochiResErrorOptions = {}) {
        super(message);
        this.name = 'TochiResError';
        this.code = code;
        this.category = categoryOf(code);
        if (options.context !== undefined) this.context = options.context;
        if (options.cause !== undefined) this.cause = options.cause;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /** Serialize this error (and its cause chain) to a wire-safe object. */
    toJSON(): SerializedError {
        const json: SerializedError = {
            name: this.name,
            code: this.code,
            category: this.category,
            message: this.message,
        };
        if (this.stack) json.stack = this.stack;
        if (this.context) json.context = this.context;
        const cause = serializeCause(this.cause);
        if (cause) json.cause = cause;
        return json;
    }
}

/** Serialize any value used as a `cause` into a {@link SerializedError}. */
export function serializeCause(value: unknown): SerializedError | undefined {
    if (value === undefined) return undefined;
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

function stringifyUnknown(value: unknown): string {
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value);
    }
}
