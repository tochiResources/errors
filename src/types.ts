import type { ErrorCategory, ErrorCode } from './codes.js';

/**
 * The wire representation of an error. Produced by {@link serializeError} and
 * accepted by `deserializeError`; safe to embed in a JSON-RPC error object.
 */
export interface SerializedError {
    /** The error class name, e.g. `ConfigError`. */
    name: string;
    /** Stable {@link ErrorCode}. */
    code: ErrorCode;
    /** Coarse category derived from the code. */
    category: ErrorCategory;
    /** Human-readable message. */
    message: string;
    /** Stack trace, when available. */
    stack?: string;
    /** Structured, JSON-safe context for logging/telemetry. */
    context?: Record<string, unknown>;
    /** Serialized cause chain. */
    cause?: SerializedError;
}
