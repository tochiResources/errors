import { describe, expect, it } from 'vitest';

import {
    ApiError,
    assertTochiRes,
    CodegenError,
    ConfigError,
    categoryOf,
    deserializeError,
    ERROR_CODES,
    ErrorCode,
    errorClassFor,
    hasErrorCode,
    IpcError,
    isErrorCode,
    isSerializedError,
    isTochiResError,
    serializeError,
    TochiResError,
    toTochiResError,
    ValidationError,
} from '../src/index.js';

describe('ErrorCode', () => {
    it('contains no duplicate codes', () => {
        expect(new Set(ERROR_CODES).size).toBe(ERROR_CODES.length);
    });

    it('namespaces every code with TOCHIRES_', () => {
        for (const code of ERROR_CODES) expect(code.startsWith('TOCHIRES_')).toBe(true);
    });

    it('derives a category for every code', () => {
        for (const code of ERROR_CODES) {
            expect(categoryOf(code)).toBeTruthy();
        }
    });

    it('recognises known codes only', () => {
        expect(isErrorCode(ErrorCode.ConfigInvalid)).toBe(true);
        expect(isErrorCode('NOPE')).toBe(false);
        expect(isErrorCode(42)).toBe(false);
    });
});

describe('TochiResError', () => {
    it('carries code, category and context', () => {
        const error = new TochiResError(ErrorCode.IpcTimeout, 'timed out', {
            context: { requestId: 7 },
        });
        expect(error.code).toBe(ErrorCode.IpcTimeout);
        expect(error.category).toBe('ipc');
        expect(error.context).toEqual({ requestId: 7 });
        expect(error).toBeInstanceOf(Error);
    });

    it('serializes to a wire-safe object', () => {
        const error = new ConfigError('bad config', { context: { field: 'name' } });
        const json = error.toJSON();
        expect(json.name).toBe('ConfigError');
        expect(json.code).toBe(ErrorCode.ConfigInvalid);
        expect(json.category).toBe('config');
        expect(json.message).toBe('bad config');
        expect(json.context).toEqual({ field: 'name' });
    });
});

describe('domain errors', () => {
    it('default to their category code and are instanceof TochiResError', () => {
        expect(new ConfigError('x').code).toBe(ErrorCode.ConfigInvalid);
        expect(new ValidationError('x').code).toBe(ErrorCode.ValidationFailed);
        expect(new ApiError('x').code).toBe(ErrorCode.ApiBadRequest);
        expect(new IpcError('x').code).toBe(ErrorCode.IpcTransport);
        expect(new CodegenError('x').code).toBe(ErrorCode.CodegenEmit);
        expect(new ConfigError('x')).toBeInstanceOf(TochiResError);
    });

    it('derive the api category and class', () => {
        expect(categoryOf(ErrorCode.ApiUnauthorized)).toBe('api');
        expect(categoryOf(ErrorCode.ApiNotFound)).toBe('api');
        expect(errorClassFor(ErrorCode.ApiForbidden)).toBe(ApiError);
    });

    it('allow overriding the code', () => {
        expect(new ConfigError('x', { code: ErrorCode.ConfigMissing }).code).toBe(
            ErrorCode.ConfigMissing
        );
    });

    it('map every code to a domain class by category', () => {
        expect(errorClassFor(ErrorCode.IpcAuth)).toBe(IpcError);
        expect(errorClassFor(ErrorCode.ConfigMissing)).toBe(ConfigError);
        expect(errorClassFor(ErrorCode.Unknown)).toBeUndefined();
    });
});

describe('serialize / deserialize', () => {
    it('round-trips a typed error preserving code, message and context', () => {
        const original = new IpcError('auth failed', {
            code: ErrorCode.IpcAuth,
            context: { token: 'redacted' },
        });
        const restored = deserializeError(serializeError(original));
        expect(restored).toBeInstanceOf(IpcError);
        expect(restored.code).toBe(ErrorCode.IpcAuth);
        expect(restored.message).toBe('auth failed');
        expect(restored.context).toEqual({ token: 'redacted' });
    });

    it('round-trips the cause chain', () => {
        const cause = new Error('root');
        const original = new ConfigError('wrapper', { cause });
        const restored = deserializeError(serializeError(original));
        expect(restored.cause).toBeInstanceOf(TochiResError);
        expect((restored.cause as TochiResError).message).toBe('root');
    });

    it('serializes arbitrary thrown values', () => {
        expect(serializeError('boom').message).toBe('boom');
        expect(serializeError({ a: 1 }).code).toBe(ErrorCode.Unknown);
        expect(serializeError(new Error('native')).name).toBe('Error');
    });

    it('validates serialized shape', () => {
        expect(isSerializedError(serializeError(new ConfigError('x')))).toBe(true);
        expect(isSerializedError({ code: 'NOPE', message: 'x' })).toBe(false);
        expect(isSerializedError(null)).toBe(false);
    });

    it('falls back safely for malformed input', () => {
        const restored = deserializeError({ message: 'only message' });
        expect(restored.code).toBe(ErrorCode.Unknown);
        expect(restored.message).toBe('only message');
    });
});

describe('guards', () => {
    it('narrows typed errors', () => {
        const error: unknown = new ValidationError('bad');
        expect(isTochiResError(error)).toBe(true);
        expect(hasErrorCode(error, ErrorCode.ValidationFailed)).toBe(true);
        expect(hasErrorCode(error, ErrorCode.IpcTimeout)).toBe(false);
    });

    it('coerces unknown values', () => {
        expect(toTochiResError(new Error('x')).code).toBe(ErrorCode.Unknown);
        expect(toTochiResError('x').message).toBe('x');
        const typed = new ConfigError('y');
        expect(toTochiResError(typed)).toBe(typed);
    });

    it('asserts and throws typed errors', () => {
        expect(() => assertTochiRes(false, ErrorCode.ConfigMissing, 'nope')).toThrow(TochiResError);
        expect(() => assertTochiRes(true, ErrorCode.ConfigMissing, 'nope')).not.toThrow();
    });
});
